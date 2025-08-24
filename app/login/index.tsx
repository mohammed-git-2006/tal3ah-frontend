import LoadingComponent from '@/components/LoadingComponent';
import i18n from '@/constants/i18n';
import { Colors, Theme } from "@/constants/Theme";
import { sendGoogleToken, userString } from '@/scripts/ServerController';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video } from 'expo-av';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Animated, Dimensions, Easing, Image, Text, TouchableOpacity, View } from "react-native";
import Modal from 'react-native-modal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface GoogleLoginComponentProps {
  onPressed : () => void,
  text : string
};

interface GoogleLoginErrorComponentProps {
  msg : string,
  visible : boolean,
  onClose : () => void
}

const GoogleLoginComponent = ( {onPressed, text} : GoogleLoginComponentProps ) => {

  return <TouchableOpacity style={{width:'100%'}} onPress={() => {onPressed()}}>
    <View style={[{
      backgroundColor: Colors.onSurface,
      borderRadius:10,
      padding : 15,
      width:'100%',
      flexDirection:'row',
      justifyContent:'flex-end',
      alignItems:'center',
      gap:15,
    }, Theme.genericShadow]}>
      <Text style={[Theme.textMedium]}>{text}</Text>
      <Image source={require('@/assets/images/google.webp')} style={{width:35, height:35}} />
    </View>
  </TouchableOpacity>
};


const GoogleLoginErrorComponent = ( {visible, msg, onClose} : GoogleLoginErrorComponentProps ) => {
  if (!visible) return <></>


  return <TouchableOpacity style={{width:'100%'}} onPress={() => onClose()}>
    <View style={{
        backgroundColor: 'rgba(139, 0, 0, 0.5)', // dark red with opacity
        borderColor:'rgba(100, 0, 0, 0.75)',
        padding: 10,
        borderWidth: 3,
        borderRadius: 10,
        width: '100%',
        justifyContent: 'space-between',
        flexDirection: 'row',
        direction:'ltr',
        alignItems: 'center'
        }}>
      <Ionicons name='close' color={Colors.surface} size={35} />
      <Text style={[Theme.textSmall, {color:Colors.surface, fontWeight:'700'}]}>{msg}</Text>
    </View>
  </TouchableOpacity>
}

export default function LoginPage() {
  const [fontsLoaded] = useFonts({
    "Cairo" : require('@/assets/fonts/Cairo.ttf'),
  })




  // define states
  const [loadingFont, setLoadingFont] = useState(true)
  const [logginIn, setLogginIn] = useState(false)
  const [logginErorr, setLogginError] = useState(false)




  const { t } = useTranslation()
  
  // define animations refs
  const {width, height} = Dimensions.get('window')
  const panelAnimationRef = useRef(new Animated.Value(height)).current
  const titleAnimationRef = useRef(new Animated.Value(0)).current


  useEffect(() => {
    // change the locale
    // const locale = RNLocalization.getLocales()[0].languageCode
    i18n.changeLanguage('ar')
    setLoadingFont(false)

    // reset animations
    panelAnimationRef.setValue(height);

    // define animations
    Animated.sequence([
      Animated.timing(panelAnimationRef, {
        useNativeDriver:true,
        toValue:0,
        duration:1000,
        easing: Easing.out(Easing.exp)
      }),

      Animated.timing(titleAnimationRef, {
        useNativeDriver:true,
        toValue:1,
        duration:1000,
      }),
    ]).start()
  }, [])

  useEffect(() => {
    
  }, [fontsLoaded])

  const padding = useSafeAreaInsets()
  const router = useRouter()

  const loginWithGoogle = async () => {
    setLogginIn(true)
    const response = await sendGoogleToken('Test Google Token');
    // alert(JSON.stringify(response))
    setLogginError(!response.status)
    if (!response.status || response.jwtToken == undefined) {
      setLogginIn(false)
      return;
    }

    AsyncStorage.setItem('key', response.jwtToken)
    AsyncStorage.setItem('user', userString(response))

    setLogginIn(false);

    router.replace('/home')
  }

  return <View style={[Theme.body, {backgroundColor:Colors.secondary}]}>
    <Animated.View style={{
      justifyContent:'center', 
      alignItems:'center', 
      height:height * .3 - padding.top,
      marginTop:padding.top,
      opacity: titleAnimationRef
    }}>
      <Video source={require('@/assets/rive/title.mp4')} style={{
        width:width * .75,
        height:height * .3,
      }} shouldPlay={true} isLooping={true} />
    </Animated.View>
    <Animated.View style={{
      backgroundColor:Colors.surface,
      borderTopLeftRadius:20,
      borderTopRightRadius:20,
      transform : [{translateY:panelAnimationRef}],
      padding:15,
      position:'absolute',
      left:0, right:0, bottom:0, top:height*.3,
      justifyContent:'space-between',
      paddingBottom:padding.bottom,
      gap:30,
      alignItems:'center'
    }}>
      <Text style={[Theme.textLarge]}>
        {t('login_signup')}
      </Text>

      <Text style={[Theme.textMedium, {
        textAlign:'center',
        fontWeight:'700',
        paddingHorizontal:15,
        marginBottom:height*.15,
      }]}>
        <Text style={{fontWeight:'900', fontSize:22}}>“ </Text>
        <Text style={{color:Colors.secondary, fontFamily:'Cairo'}}>{t('ls_message')}</Text>
        <Text style={{fontWeight:'900', fontSize:22}}> ”</Text>  
      </Text>

      {/* <Lottie source={require('@/assets/lottie/loading.json')} style={{width:250, height:250}}
        autoPlay={true} loop={true} /> */}

      <Text style={{fontFamily:'Cairo'}}></Text>

      <View style={{gap:10}}>
        <GoogleLoginErrorComponent visible={logginErorr} msg={t('ls_error')} onClose={() => setLogginError(false)} />
        <GoogleLoginComponent onPressed={loginWithGoogle} text={t('ls_google')} />
      </View>
    </Animated.View>

    <Modal isVisible={logginIn}>
      <LoadingComponent />
    </Modal>
  </View>
}