import { Colors, Theme } from "@/constants/Theme";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";


const IconsMap = {
  "Cars" :  "car",
  "Movies" :  "film",
  "Photography" :  "camera",
  "Cooking" :  "restaurant",
  "Gardening" :  "leaf",
  "Reading" :  "book",
  "Traveling" :  "airplane",
  "Hiking" :  "walk",
  "Painting" :  "color-palette",
  "Music" :  "musical-notes",
  "Dancing" :  "body",
  "Fishing" :  "fish",
  "Cycling" :  "bicycle",
  "Swimming" :  "water",
  "Chess" :  "game-controller",
  "Camping" :  "bonfire",
  "Collecting Stamp" : "mail-open",
  "Bird Watchin" : "eye",
  "Writing" :  "create",
  "Cards" :  "card",
};


function HTag ({content, index, iconName} : {content:string, index:number, iconName:string}) {

  return <View style={{
    borderRadius:10, 
    padding : 5, 
    backgroundColor:Colors.secondary,
    // margin:5,
    gap:7,
    flexDirection:'row',
    justifyContent:'space-between',
    shadowColor:Colors.secondary,
    shadowRadius:3,
    shadowOpacity:.3,
    paddingLeft:10,
    alignItems:'center',
    direction:'rtl'
  }}>

    <Ionicons name={iconName} size={20} color={Colors.surface} />
    <Text style={[Theme.textSmall, {fontWeight:'800', color:Colors.surface}]}>
      {content}
    </Text>
  </View>
}



export { HTag, IconsMap };

