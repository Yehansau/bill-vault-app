// services/notificationService.ts

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { Warranty } from '../types/warranty.types';

// ─────────────────────────────────────────────────────
// Configure how notifications appear when app is open
// Show the alert, play sound, and show badge number
// ─────────────────────────────────────────────────────
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// ─────────────────────────────────────────────────────
// REQUESTING PERMISSION
// ─────────────────────────────────────────────────────
// Must be called before scheduling any notifications
// Shows the system permission popup on first launch
// Returns true if permission granted, false if denied

export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    // Notifications only work on real devices, not simulators
    if (!Device.isDevice) {
      console.log('⚠️ Notifications only work on real devices');
      return false;
    }

    // Check current permission status
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    // If not granted yet, ask the user
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('❌ Notification permission denied');
      return false;
    }

    // Android needs a notification channel set up
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('warranty-alerts', {
        name: 'Warranty Alerts',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#944ABC',
        sound: 'default',
      });
    }

    console.log('✅ Notification permission granted');
    return true;

  } catch (error) {
    console.error('❌ Error requesting notification permission:', error);
    return false;
  }
};

// ─────────────────────────────────────────────────────
// CANCEL ALL SCHEDULED NOTIFICATIONS
// ─────────────────────────────────────────────────────
// Called before rescheduling to avoid duplicates
// Every time user opens app we cancel and reschedule fresh

export const cancelAllNotifications = async (): Promise<void> => {
  await Notifications.cancelAllScheduledNotificationsAsync();
  console.log('🗑️ All scheduled notifications cancelled');
};

// ─────────────────────────────────────────────────────
// SCHEDULE NOTIFICATIONS FOR ONE WARRANTY
// ─────────────────────────────────────────────────────
// Schedules up to 3 notifications per warranty:
// - 14 days before expiry
// - 7 days before expiry
// - 1 day before expiry
// All notifications fire at 9:00 AM on the correct day
// Only schedules future notifications — skips past ones

const scheduleWarrantyNotifications = async (
  warranty: Warranty
): Promise<void> => {
  // The 3 reminder intervals we want
  const reminderDays = [14, 7, 1];

  for (const days of reminderDays) {
    // Calculate what date this notification should fire
    const notificationDate = new Date(warranty.expiryDate);
    notificationDate.setDate(notificationDate.getDate() - days);

    // Set the time to 9:00 AM
    notificationDate.setHours(9, 0, 0, 0);

    // Skip if this date is already in the past
    if (notificationDate <= new Date()) {
      console.log(
        `⏭️ Skipping ${days}-day reminder for ${warranty.productName} — date has passed`
      );
      continue;
    }

    // Build the notification message based on days remaining
    let title = '';
    let body = '';

    if (days === 14) {
      title = '🔔 Warranty Expiring Soon';
      body = `Your ${warranty.productName} warranty expires in 14 days!`;
    } else if (days === 7) {
      title = '⚠️ Warranty Expiring in 7 Days';
      body = `Your ${warranty.productName} warranty expires on ${formatNotificationDate(warranty.expiryDate)}`;
    } else if (days === 1) {
      title = '🚨 Warranty Expires Tomorrow!';
      body = `Your ${warranty.productName} warranty expires tomorrow! Take action now.`;
    }

    // Schedule the notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        // Extra data passed to app when notification is tapped
        data: {
          warrantyId: warranty.id,
          productName: warranty.productName,
          type: 'warranty_expiry',
        },
        sound: 'default',
      },
      trigger: {
        date: notificationDate,
        channelId: 'warranty-alerts', // Android only
      },
    });

    console.log(
      `✅ Scheduled ${days}-day reminder for ${warranty.productName} on ${notificationDate.toDateString()}`
    );
  }
};

// ─────────────────────────────────────────────────────
// SCHEDULE ALL WARRANTY NOTIFICATIONS
// ─────────────────────────────────────────────────────
// Main function called from HomeScreen on app open
// Cancels all existing notifications first
// Then schedules fresh ones for all warranties
// This keeps notifications accurate and up to date

export const scheduleAllWarrantyNotifications = async (
  warranties: Warranty[]
): Promise<void> => {
  try {
    // Step 1: Cancel all existing scheduled notifications
    // Prevents duplicates if user opens app multiple times
    await cancelAllNotifications();

    // Step 2: Filter to only active and expiring_soon warranties
    // No point notifying about already expired warranties
    const relevantWarranties = warranties.filter(
      (w) => w.status === 'active' || w.status === 'expiring_soon'
    );

    console.log(
      `📅 Scheduling notifications for ${relevantWarranties.length} warranties`
    );

    // Step 3: Schedule notifications for each warranty
    for (const warranty of relevantWarranties) {
      await scheduleWarrantyNotifications(warranty);
    }

    console.log('✅ All warranty notifications scheduled successfully');

  } catch (error) {
    console.error('❌ Error scheduling notifications:', error);
  }
};

// ─────────────────────────────────────────────────────
// HELPER: Format date for notification message
// Returns string like "24 Mar 2026"
// ─────────────────────────────────────────────────────
const formatNotificationDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};