

import Lottie from 'lottie-react-native'
import { View } from 'react-native'

export default function LoadingComponent() {
  

  return <View style={{
    justifyContent:'center', 
    alignItems:'center',
  }}>
    <Lottie source={require('@/assets/lottie/loading.json')} style={{width:250, height:250}}
      autoPlay={true} loop={true} />
  </View>
}