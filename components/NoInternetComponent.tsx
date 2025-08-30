import { Colors, Theme } from "@/constants/Theme";
import LottieView from "lottie-react-native";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";



export default function NoInternetComponent({content, callback} : {content:string[], callback:() => void}) {
  const { width } = Dimensions.get('window')
  return <View style={{flex:1, justifyContent:'center', alignItems:'center', gap:25}}>
    <LottieView source={require('@/assets/lottie/no_internet.json')} style={{
      width : width * .5,
      height : width * .5
    }} />

    <Text style={[Theme.textMedium]}>
      {content[0]}
    </Text>

    <TouchableOpacity style={{
      backgroundColor:Colors.secondary,
      borderRadius:15,
      paddingHorizontal : 15,
      paddingVertical:7,
      alignItems:'center',
      justifyContent:'center',
    }} onPress={() => callback()}>

      <Text style={[Theme.textMedium, {color:Colors.surface, fontWeight:'800'}]}>
        {content[1]}
      </Text>

    </TouchableOpacity>
  </View>
}