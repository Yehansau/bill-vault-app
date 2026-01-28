import { CustomButton } from "@/components/ui"
import { LinearGradient } from "expo-linear-gradient"
import { Link, router } from "expo-router"
import { useState } from "react"
import { Image, StyleSheet, Text, View } from 'react-native'
import billVaultImage from '../../assets/images/BillVaultImage.png'
import logo from '../../assets/images/LogoPicture.png'

const WelcomeScreen = () => {
  const [loading, setLoading] = useState(false)
  const handlePressLogin = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
    router.push("/auth/login")
  }
  const handlePressRegister = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
    router.push("/auth/register")
  }
  return (
      <LinearGradient colors={["#944ABC", "#3B0856"]} start={{x:0, y:0}} end={{x:1,y:0}} style={styles.container}>
        <View style={styles.imageContainer}>
          <Image source={logo} style={styles.logo}/>
          <Image source={billVaultImage} style={styles.billVaultImage}/>
        </View>
        <View style = {styles.ButtonContainer}>
          <Text style={styles.welcomeText}>WELCOME</Text>
          <CustomButton title="Login" onPress={handlePressLogin} loading={loading} variant="secondary"/>
          <View style = {styles.button}><CustomButton title="Create Account" onPress={handlePressRegister} loading={loading} variant="secondary"/></View>
        </View>
      </LinearGradient>
  )
}

const styles = StyleSheet.create
({container: {
  flex:1,
  alignItems:"center"
},

logo:{
  height:130,
  width:130,
  marginTop:100
}, 

view:{
  flex:1
},

billVaultImage : {
  height:100,
  width:310,
  marginTop:10
},

welcomeText : {
  fontSize:55,
  color:"white",
  marginBottom : 20,
},

imageContainer : {
  alignItems : 'center'
},

ButtonContainer : {
  alignItems : 'center',
  width : '100%',
  marginTop : 80,
  paddingHorizontal : 50,
  justifyContent : 'center'
},

button : {
  marginTop : 20,
  width : '100%',
}
});

export default WelcomeScreen