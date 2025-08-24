import Lottie from 'lottie-react-native'
import { View } from 'react-native'
import Modal from 'react-native-modal'

interface LoadingModalComponentProps {
  isVisible : boolean
}

export default function LoadingModalComponent( {isVisible} : LoadingModalComponentProps) {
  return <Modal isVisible={isVisible}>
    <View style={{
      justifyContent:'center',
      alignItems:'center',
    }}>
      <Lottie source={require('@/assets/lottie/loading.json')} style={{width:250, height:250}}
        autoPlay={true} loop={true} />
    </View>
  </Modal>
}