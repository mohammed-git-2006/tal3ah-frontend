import { Redirect } from "expo-router";
import { View } from "react-native";


export default function main() {
  return <View style={{flex:1}}>
    <Redirect href={"/login"} />
  </View>
} 