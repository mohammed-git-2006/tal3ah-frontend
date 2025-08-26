import { Colors } from "@/constants/Theme";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Meeting {
  creator : string, // creator email
  _id : string, // id given from the mongodb
  time : Date, // when the meet should happen
  location : string // LatLng
  location_name : string // location actual name (for reference) 
  max : number, // max people to attend
  code : string, // 6-digit codes
  people : string[], // peoples emails
}


export default function Home() {
  const { width, height } = Dimensions.get('window')
  const padding = useSafeAreaInsets()
  const [fontsLoaded] = useFonts({
    'cairo' : require('@/assets/fonts/Cairo.ttf'),
  })

  const { t } = useTranslation()
  const router = useRouter()
  


  return <View style={{flex:1, padding : 0}}>
    <ScrollView style={{
      flex:1,
      padding:0,
    }}>
      
      <Text>
        
      </Text>
      
      <View>

      </View>
    </ScrollView>
    <TouchableOpacity style={{
      position:'absolute',
      width:60,
      height:60,
      bottom : 10,
      right: 10,
      borderRadius:30, 
      overflow:'hidden'
    }} onPress={() => { router.navigate('/create_meeting') }}>

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