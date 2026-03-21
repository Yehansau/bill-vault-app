import { useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';


export const useCamera = () => {
  const [permission, requestPermission] = useCameraPermissions();


  const requestAllPermissions = async () => {
    await requestPermission();
    await ImagePicker.requestMediaLibraryPermissionsAsync();
  };


  return {
    hasPermission: permission?.granted ?? false,
    requestPermission: requestAllPermissions,
  };
};
