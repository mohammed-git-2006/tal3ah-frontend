import { Colors } from "@/constants/Theme";
import { User, userFromString } from "@/scripts/ServerController";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { Tabs, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import Header from '../../components/_header';


export default function RootLayout() {
  const [userProfile, setUserProfile] = useState<User>()
  const [token, setToken] = useState<string>()
  const router = useRouter()
  const [fontsLoaded] = useFonts({
    'Cairo' : require('@/assets/fonts/Cairo.ttf')
  })

  const loadUserFromStorage = async () => {
    const jwtKey = await AsyncStorage.getItem('key')
    const userString = await AsyncStorage.getItem('user')
    if (jwtKey == null || userString == null) {
      router.replace('/login');
      return;
    }

    setToken(jwtKey)

    try {
      setUserProfile(userFromString(userString))
    } catch (err) {
      router.replace('/login');
      return;
    }
  }

  useEffect(() => {
    loadUserFromStorage()
  }, [])

  
  
  return <View style={{flex:1}}>
    <Header username={userProfile?.name ?? ''}/>
    <Tabs screenOptions={{
      headerShown:false,
      tabBarActiveTintColor:Colors.secondary,
      tabBarLabelStyle: {
        fontFamily:'Cairo'
      }
    }}>

      <Tabs.Screen name={'profile'} options={{
        title:'Profile',
        tabBarLabel:'حسابي',
        tabBarIcon : ( {focused, size} ) => <Ionicons name="person" size={size} color={focused ? Colors.secondary : Colors.onSurface} />
      }} />

      <Tabs.Screen name={'home'} options={{
        title:'Home',
        tabBarLabel:'الصفحة الرئيسية',
        tabBarIcon : ( {focused, size} ) => <Ionicons name="home" size={size} color={focused ? Colors.secondary : Colors.onSurface} />
      }} />

      <Tabs.Screen name={'my_meetings'} options={{
        title:'My Meetings',
        tabBarLabel:'لقائاتي',
        tabBarIcon : ( {focused, size} ) => <Ionicons name="calendar" size={size} color={focused ? Colors.secondary : Colors.onSurface} />
      }} />
    </Tabs>
  </View>
}