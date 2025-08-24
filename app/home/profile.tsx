import LoadingComponent from '@/components/LoadingComponent'
import { HTag } from '@/components/Tag'
import { Colors, Theme } from '@/constants/Theme'
import { FullUser, getFullUser, loadUserFromStorage, User } from '@/scripts/ServerController'
import { format } from 'date-fns'
import { Link, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'

export default function ProfilePage() {
  const { width, height } = Dimensions.get('window')
  const [token, setToken] = useState<string>()
  const [userProfile, setUserProfile] = useState<User>()
  const [fullUser, setFullUser] = useState<FullUser>();
  const [loading, setLoading] = useState(true);
  const [connecitonErr, setConnecitonErr] = useState(false);
  const [formattedDate, setFormattedDate] = useState('')
  
  const router = useRouter()



  const handleLoading = async () => {
    const loadResult = await loadUserFromStorage()
    if (loadResult == 'login') {
      alert(`load result if ${loadResult}`)
      // router.replace('/login')
      return;
    }

    setToken(loadResult.token)
    setUserProfile(loadResult.user)
    
    const fullUserResult = await getFullUser(loadResult.user.email, loadResult.token)

    if (fullUserResult == 'error') {
      setLoading(false);
      setConnecitonErr(true);
      return;
    }

    setFormattedDate(format(fullUserResult.joined, 'dd-M-y'))
    setFullUser(fullUserResult)
    setLoading(false);
    setConnecitonErr(false);
  }

  useEffect(() => {
    handleLoading()
  }, [])


  if (loading) {

    return <View style={{
      flex:1, justifyContent:'center', alignItems:'center'
    }}>
      <LoadingComponent />
    </View>
  } else if (connecitonErr) {
    return <View style={{
      flex:1, justifyContent:'center', alignItems:'center'
    }}>
      <Text style={[Theme.textMedium]}>Network error</Text>
      <TouchableOpacity style={{padding:10}} onPress={() => {
        setLoading(true); setConnecitonErr(false); handleLoading()
      }}>
        <Text> Try </Text>
      </TouchableOpacity>
    </View>
  }

  return <>
    <ScrollView>
      {/* <Text>
        {JSON.stringify(fullUser)}
      </Text> */}
      <View style={{margin:25, alignItems:'center'}}>
        <Image  source={{uri : fullUser?.img}} style={{width:150, height:150, borderRadius:75, marginBottom:20}} resizeMode='stretch' />
        <Text style={[Theme.textLarge]}>
          {userProfile?.name}
        </Text>
        <Text style={[Theme.textMedium]}>
          إنضم في {formattedDate}
        </Text>
        <Text style={[Theme.textMedium]}>
          عدد اللقائات التي شاركت فيها : <Text style={{color:Colors.secondary}}>{fullUser?.meetingsJoined}</Text>
        </Text>

        <View style={{
          flexWrap:'wrap',
          flexDirection:'row',
          alignItems:'center',
          justifyContent:'flex-start',
          direction:'rtl',
          marginVertical:10
        }}>

          { fullUser?.hobbies.map( (item, index) => {
            return <HTag  content={item} index={index} key={index} />
          })}
          { fullUser?.hobbies.map( (item, index) => {
            return <HTag  content={item} index={index} key={index} />
          })}

        </View>
        <Link href={"/home/my_meetings"}>
          <Text style={{fontFamily:'Cairo', color:Colors.secondary, textDecorationLine:'underline'}}>تصفّح لقائاتك</Text>
        </Link>
      </View>
    </ScrollView>
  </>
}