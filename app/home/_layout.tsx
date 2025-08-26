import i18n from "@/constants/i18n";
import { Colors } from "@/constants/Theme";
import { User, userFromString } from "@/scripts/ServerController";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { getLocales } from "expo-localization";
import { Tabs, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import Header from '../../components/_header';


export default function RootLayout() {
  const [userProfile, setUserProfile] = useState<User>()
  const [token, setToken] = useState<string>()
  const router = useRouter()
  const [fontsLoaded] = useFonts({
    'Cairo' : require('@/assets/fonts/Cairo.ttf')
  })

  const { t } = useTranslation();
  const locales = getLocales()
  const [langCode, setLangCode] = useState<'en'|'ar'>()
  const [dirMode, setDirMode] = useState<'ltr'|'rtl'>()

  
  useEffect(() => {
    loadUserFromStorage()
    setLangCode(locales[0].languageCode == 'en' ? 'en' : 'ar');
    setDirMode(langCode == 'ar' ? 'rtl' : 'ltr');
    i18n.changeLanguage(langCode)
  }, [])


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
  
  return <View style={{flex:1}}>
    <Header content={`${t('welcome')} ${userProfile?.name ?? ''}`} dir={dirMode??'ltr'}/>
    <Tabs screenOptions={{
      headerShown:false,
      tabBarActiveTintColor:Colors.secondary,
      tabBarLabelStyle: {
        fontFamily:'Cairo'
      },
      
    }} initialRouteName="home">

      <Tabs.Screen name={'my_meetings'} options={{
        title:'My Meetings',
        tabBarLabel:'لقائاتي',
        tabBarIcon : ( {focused, size} ) => <Ionicons name="calendar" size={size} color={focused ? Colors.secondary : Colors.onSurface} />
      }} />

      <Tabs.Screen name={'home'} options={{
        title:'Home',
        tabBarLabel:'الصفحة الرئيسية',
        tabBarIcon : ( {focused, size} ) => <Ionicons name="home" size={size} color={focused ? Colors.secondary : Colors.onSurface} />
      }} />

      <Tabs.Screen name={'profile'} options={{
        title:'Profile',
        tabBarLabel:'حسابي',
        tabBarIcon : ( {focused, size} ) => <Ionicons name="person" size={size} color={focused ? Colors.secondary : Colors.onSurface} />
      }} />
    </Tabs>
  </View>
}