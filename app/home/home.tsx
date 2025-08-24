import { Colors } from "@/constants/Theme";
import { Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import { BlurView } from "expo-blur";
import { useFonts } from "expo-font";
import { useTranslation } from "react-i18next";
import { Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Home() {
  const { width, height } = Dimensions.get('window')
  const padding = useSafeAreaInsets()
  const [fontsLoaded] = useFonts({
    // 'Cairo' : require('/assets/fonts/cairo.ttf'),
    'cairo' : require('@/assets/fonts/Cairo.ttf'),
  })

  const { t } = useTranslation()

  return <View style={{flex:1, padding : 0}}>
    <ScrollView style={{
      flex:1,
      padding:0,
    }}>

      {/* <View>
        <Video source={require('@/assets/rive/bg1.mp4')} isLooping={true} shouldPlay={true} style={{
          width:width - 40,
          height:250,
          marginHorizontal:20,
          marginTop:10,
          borderRadius:20
        }} resizeMode={ResizeMode.STRETCH} />
        <BlurView style={{
          width:width - 40,
          marginHorizontal:20,
          height:250,
          position:'absolute',
          marginTop:10,
          // marginHorizontal : 20,
          // marginVertical: 10,
          backgroundColor: Colors.secondary,
          borderRadius:20,
          overflow:'hidden',
        }} intensity={80} tint="dark"/>
      </View> */}

      {new Array(30).fill(null).map((_, i) => {
        return <View style={{flexDirection:'row', margin:10}} key={i}>
          <Image source={require('../../assets/images/react-logo.png')} style={{width:50, height:50}} />
          <Text>Item : {i}</Text>
        </View>
      })}

    </ScrollView>
    <TouchableOpacity style={{
      position:'absolute',
      width:60,
      height:60,
      bottom : 10,
      right: 10,
      borderRadius:30, 
      overflow:'hidden'
    }}>

      <View style={{
        backgroundColor:Colors.secondary,
        borderRadius:30, 
        width :'100%',
        height:'100%',
        flex:1,
        justifyContent:'center',
        alignItems:'center'
      }}>
        <Ionicons name="add" color={Colors.surface} size={30} />
      </View>
    </TouchableOpacity>
  </View>
}