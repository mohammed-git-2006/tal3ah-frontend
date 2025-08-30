import LoadingComponent from "@/components/LoadingComponent";
import { MeetingComponent } from "@/components/MeetingComponent";
import NoInternetComponent from "@/components/NoInternetComponent";
import { loadUserFromStorage, Meeting, ServerUtils } from "@/scripts/ServerController";
import * as Localization from 'expo-localization';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, Image, RefreshControl, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppState } from "../contexts/AppState";


export default function MyMeetingsPage() {
  const padding = useSafeAreaInsets();
  const { t } = useTranslation();
  const locales = Localization.getLocales();
  const router = useRouter();
  const { width, height } = Dimensions.get('window')
  const [langCode, setLangCode] = useState<'en'|'ar'>()
  const [dirMode, setDirMode] = useState<'ltr'|'rtl'>()
  const [ls, setLS] = useState<{loading:boolean, err:boolean}>({loading:false, err:true});
  const [myMeetings, setMyMeetings] = useState<Meeting[]>()
  const { meetChange, setMeetChange } = useAppState();
  const [meetingsMap, setMeetingsMap] = useState<Map<string, Meeting[]>>(new Map())
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async () => {
    setRefreshing(true);
    await handleLoadData();
    setRefreshing(false);
  }

  useEffect(() => {
    if (meetChange) {
      handleLoadData();
      setMeetChange(false);
    }
  }, [meetChange])

  useEffect(() => {
    const lCode = locales[0].languageCode == 'ar' ? 'ar' : 'en';
    setLangCode(lCode);
    setDirMode(lCode == 'ar' ? 'rtl' : 'ltr');
    handleLoadData();
  }, [])

  const handleLoadData = async () => {
    try {
      setLS({loading:true, err:false});
      const user = await loadUserFromStorage();

      if (user == 'login') {
        router.replace('/login');
        return;
      }

      const cats = ["mine_live", "engaged_live", "mine_done", "engaged_done"]
      const newMap : Map<string, Meeting[]> = new Map()

      for(let cat of cats) {
        newMap.set(cat, await ServerUtils.getMeetings(user.token, cat as any))
        console.log(`==> ${cat} : ${JSON.stringify(newMap.get(cat))}`)
      }

      setMeetingsMap(newMap)
      setLS({loading:false, err:false})
    } catch (err) {
      console.log(err)
      setLS({loading:false, err:true});
    }
  }

  if (ls.loading) {
    return <View style={{flex:1, justifyContent:'center'}}>
      <LoadingComponent />
    </View>
  } else if (ls.err) {
    return <NoInternetComponent content={[t('conn_err'), t('retry')]} callback={handleLoadData} />
  }

  const MeetingsSlide = ( {cat, text} : {cat:string, text:string} ) => {
    const meetings = meetingsMap?.get(cat)

    if (!meetings || meetings.length == 0) return <></>

    return <View style={{direction:dirMode, alignItems:'flex-start', gap:10}}>
      <Text style={{fontFamily:'Cairo', fontWeight:'600', fontSize:15, marginHorizontal:20}}>
        { text } <Text style={{fontWeight:'800', fontSize:18}}>({meetings.length})</Text>
      </Text>
      <ScrollView horizontal={true} style={{
        width:width,
      }} >
        {meetings.length > 0 ? meetings!.map((e, i) => {
          return <MeetingComponent key={i} meeting={e} content={t('more_info')}
            onPressed={() => { router.push({pathname:'/create_meeting/view_meeting/[id]', params: {id : e._id!}}) }} />
        }) : <><Text></Text></>}
      </ScrollView>
    </View>

  }

  return (
    <>
      <Image source={require('@/assets/images/bg1.png')} style={{
        width:width,
        height:height * .65,
        position:'absolute',
        opacity:.1
      }} resizeMode='cover' /> 
      <ScrollView style={{width:width, flex:1, paddingTop:20}}
        refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
        <MeetingsSlide text={t('mts_live')} cat="mine_live" />
        {/* <View style={{backgroundColor:'gray', height:1, marginHorizontal:10}} /> */}
        <MeetingsSlide text={t('mts_done')} cat="mine_done" />
        {/* <View style={{backgroundColor:'gray', height:1, marginHorizontal:10}} /> */}
        <MeetingsSlide text={t('mts_e_live')} cat="engaged_live" />
        {/* <View style={{backgroundColor:'gray', height:1, marginHorizontal:10}} /> */}
        <MeetingsSlide text={t('mts_e_done')} cat="engaged_done" />
      </ScrollView>
    </>
  )
}