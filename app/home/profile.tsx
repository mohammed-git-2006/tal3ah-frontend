import LoadingComponent from '@/components/LoadingComponent'
import { HTag } from '@/components/Tag'
import i18n from '@/constants/i18n'
import { Colors, Theme } from '@/constants/Theme'
import { FullUser, getFullUser, HobbiesList, loadUserFromStorage, ServerUtils, User } from '@/scripts/ServerController'
import { Ionicons } from '@expo/vector-icons'
import { format } from 'date-fns'
import * as Localization from 'expo-localization'
import { Link, useRouter } from 'expo-router'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Dimensions, FlatList, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import Modal from 'react-native-modal'

export default function ProfilePage() {
  const { width, height } = Dimensions.get('window')
  const [token, setToken] = useState<string>()
  const [userProfile, setUserProfile] = useState<User>()
  const [fullUser, setFullUser] = useState<FullUser>();
  const [loading, setLoading] = useState(true);
  const [connecitonErr, setConnecitonErr] = useState(false);
  const [editingHobbies, setEditingHobbies] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [formattedDate, setFormattedDate] = useState('')
  const [hobbiesList, setHobbiesList] = useState<HobbiesList>()
  
  const router = useRouter()
  const { t } = useTranslation()

  const locales = Localization.useLocales();
  const { languageCode } = locales[0]
  const direction = languageCode == 'ar' ? 'rtl' : 'ltr'

  useEffect(() => {
    // alert(`Updating : ${updating}`)
    if (!updating) {
      handleLoading();
    }
  }, [updating])

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

    // setHobbies(getListFrom(_hobbies, result!))
    const result = await ServerUtils.getHobbies()
    if (result == 'error') {
      setLoading(false);
      setConnecitonErr(true);
      return;
    }
    setHobbiesList(result)
    setFormattedDate(format(fullUserResult.joined, 'dd-M-y'))
    setFullUser(fullUserResult)
    setLoading(false);
    setConnecitonErr(false);
  }



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
    <Image source={require('@/assets/images/bg1.png')} style={{
      width:width,
      height:height * .65,
      position:'absolute',
      opacity:.25
    }} resizeMode='cover' />

    <ScrollView>
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
          justifyContent:'center',
          direction:'rtl',
          marginVertical:10,
          rowGap:5,
          columnGap:5,
        }}>
          <TouchableOpacity style={{
            backgroundColor:Colors.secondary, 
            borderRadius:70, 
            padding:5,
            shadowColor:Colors.secondary,
            shadowRadius:10,
            shadowOpacity:.5,
          }} onPress={() => setEditingHobbies(true)}>
            <Ionicons name='pencil' color={Colors.surface} size={22}/>
          </TouchableOpacity>
          
          { fullUser?.hobbies.map( (_item, index) => {
            var item = (hobbiesList??[]).find(a => a.en === _item || a.ar === _item);
            if (item == undefined) return <></>;
            return <HTag  content={languageCode == 'ar' ? item.ar : item.en} index={index} key={index} iconName={item.icon} />
          })}

        </View>
        <Link href={"/home/my_meetings"}>
          <Text style={{fontFamily:'Cairo', color:Colors.secondary, textDecorationLine:'underline'}}>تصفّح لقائاتك</Text>
        </Link>
      </View>
    </ScrollView>

    <Modal isVisible={editingHobbies} style={{}}>
      <View style={{
        height:height*.5,
        backgroundColor:Colors.surface,
        borderRadius:15,
        paddingHorizontal : 10
      }}>
        
        <HobbiesModifyView userHobbies={getListFrom(fullUser?.hobbies!, hobbiesList!)} hobbiesList={hobbiesList!} 
          updatingHook={setUpdating} visibilityHook={setEditingHobbies}/>
      </View>
    </Modal>

    {/* <Modal isVisible={updating}>
      <LoadingComponent/>
    </Modal> */}
  </>
}

const getListFrom = (input : string[], original : HobbiesList) :  HobbiesList => {
  // alert(JSON.stringify(input))
  // alert(JSON.stringify(original))
  return input.map(a => {
    for(let b of original) {
      if (b.ar === a || b.en === a) return b
    }
  }) as HobbiesList
}

const HobbiesModifyView = ( {userHobbies, hobbiesList, updatingHook, visibilityHook} : 
  {userHobbies : HobbiesList, hobbiesList:HobbiesList, updatingHook:Dispatch<SetStateAction<boolean>>,
   visibilityHook:Dispatch<SetStateAction<boolean>>} ) => {

  const [hobbies, setHobbies] = useState<HobbiesList>()
  const [notChoosen, setNotChoosen] = useState<HobbiesList>()
  const [changesHappend, setChangesHappend] = useState(false)
  
  const handleUpdate = async () => {
    if (!changesHappend) {
      visibilityHook(false)
      return;
    }

    try {
      updatingHook(true)
      await ServerUtils.updateHobbies(hobbies?.map(a => a.en)!)
    } catch(err) {
      alert(`Failed to update hobbies`)
    }

    updatingHook(false);
    visibilityHook(false);
  }

  const locales = Localization.getLocales()
  const [dirMode, setDirMode] = useState<'ltr'|'rtl'>('rtl')
  const [lang, setLang] = useState<'ar'|'en'>('en')
  const { t } = useTranslation()

  useEffect(() => {
    setHobbies(userHobbies)
    setNotChoosen(hobbiesList.filter(i => !userHobbies.includes(i)) as HobbiesList)
    setLang(locales[0].languageCode == 'ar' ? 'ar' : 'en')
    setDirMode(lang == 'ar' ? 'rtl' : 'ltr')
    i18n.changeLanguage(lang)
  }, [])


  return <View style={{flex:1}}>
    <View style={{
      flexDirection:'row',
      justifyContent:'space-between',
      alignItems:'center',
      marginVertical:10,
      direction:dirMode,
    }}>
      <Text style={[Theme.textMedium, {flex:1}]}>
        {t('edit_hobbies')} 
      </Text>
      <TouchableOpacity onPress={() => { handleUpdate() }}>
        <Ionicons name='close' size={30} />
      </TouchableOpacity>
    </View>
    <ScrollView style={{
      flex:1,
    }}>
      <FlatList 
        data={hobbies} 
        scrollEnabled={false}
        keyExtractor={(item) => item.icon}
        renderItem={ ( { item, index } ) => {
          if (item === undefined) return <Text>Undefined</Text>
          return <View style={{ 
            direction:dirMode, 
            alignItems:'center',
            padding : 10,
            justifyContent:'space-between',
            flexDirection:'row'
          }}>
            <View style={{flexDirection:'row', alignItems:'center', gap : 10}}>
              <Ionicons name={item.icon as any} color={Colors.secondary} size={15} />
              <Text style={[Theme.textMedium, {direction:dirMode}]}>{lang == 'ar' ? item.ar : item.en}</Text>
            </View>
            <TouchableOpacity style={{padding:3}} onPress={() => {
              setChangesHappend(true)
              setHobbies(hobbies?.filter((a, i) => i !== index) as HobbiesList)
            }}>
              <Ionicons name='trash-bin' color={'red'} size={18} style={{
                shadowColor:'red',
                shadowOpacity:0.5,
                shadowRadius:3,
              }}/>
            </TouchableOpacity>
          </View>
        }}

        ItemSeparatorComponent={ () => {
          return <View>
            <View style={{ height: 1, backgroundColor:'lightgray' }} />
          </View>
        }}
      />
      <View style={{ height: 1, backgroundColor:'lightgray' }} />
      <FlatList 
        scrollEnabled={false}
        keyExtractor={(item) => item.icon}
        data={notChoosen} 
        renderItem={ ( { item, index } ) => {
          if (item === undefined) return <Text>Undefined</Text>
          return <View style={{ 
            direction:dirMode, 
            alignItems:'center',
            padding : 10,
            justifyContent:'space-between',
            flexDirection:'row'
          }}>
            <View style={{flexDirection:'row', alignItems:'center', gap : 10}}>
              <Ionicons name={item.icon as any} color={Colors.secondary} size={15} />
              <Text style={[Theme.textMedium, {direction:dirMode}]}>{lang == 'ar' ? item.ar : item.en}</Text>
            </View>
            <TouchableOpacity style={{padding:3}} onPress={() => {
              const hobbiesPlaceholder = hobbies!;
              hobbiesPlaceholder.push(item)
              setChangesHappend(true)
              setHobbies(hobbiesPlaceholder)
              setNotChoosen(notChoosen!.filter(a => a.icon !== item.icon) as HobbiesList)
            }}>
              <Ionicons name='add' color={'green'} size={18} style={{
                shadowColor:'green',
                shadowOpacity:0.5,
                shadowRadius:3,
              }}/>
            </TouchableOpacity>
          </View>
        }}

        ItemSeparatorComponent={ () => {
          return <View>
            <View style={{ height: 1, backgroundColor:'lightgray' }} />
          </View>
        }}
      />
    </ScrollView>
  </View>
}