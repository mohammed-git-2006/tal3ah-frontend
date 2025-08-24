import { Colors, Theme } from "@/constants/Theme"
import { Ionicons } from "@expo/vector-icons"
import { Text, View } from "react-native"


const IconsMap = {
  'أفلام' : "film",
  'شدّة' : "sparkles",
  'سيارات' : "car",
}



function HTag ({content, index} : {content:string, index:number}) {

  return <View style={{
    borderRadius:10, 
    padding : 5, 
    backgroundColor:Colors.secondary,
    margin:5,
    gap:7,
    flexDirection:'row',
    justifyContent:'space-between',
    // width:80,
    paddingLeft:10,
    alignItems:'center',
    direction:'rtl'
  }}>

    <Ionicons name={IconsMap[content]} size={20} color={Colors.surface} />
    <Text style={[Theme.textSmall, {fontWeight:'800', color:Colors.surface}]}>
      {content}
    </Text>
  </View>
}



export { HTag }

