
import { Colors, Theme } from '@/constants/Theme'
import { Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function HomeHeader( {content, dir} : { content : string, dir:'ltr'|'rtl'} ) {
  const padding = useSafeAreaInsets()

  return <View style={{
    padding : 15,
    paddingTop : padding.top,
    width : '100%',
    backgroundColor: Colors.secondary,
    flexDirection:'row',
    alignItems:'center',
    gap:10,
    direction:dir
  }}>
    {/* <Text style={[Theme.textMedium, {color:Colors.surface, alignItems:'center'}]}>
    </Text> */}
    <Text style={[Theme.textMedium, {fontWeight:'800', color:Colors.surface}]}> {content} !</Text>

    {/* <Ionicons name="happy-outline" color={'white'} size={25} /> */}
  </View>
}