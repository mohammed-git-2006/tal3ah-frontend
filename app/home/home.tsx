import { DropdownButton } from "@/components/DropdownButton";
import LoadingComponent from "@/components/LoadingComponent";
import { MeetingComponentLarge } from "@/components/MeetingComponent";
import NoInternetComponent from "@/components/NoInternetComponent";
import { Colors } from "@/constants/Theme";
import { getToken, HobbiesList, Meeting, SERVER_URL, ServerUtils } from "@/scripts/ServerController";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import * as Localization from 'expo-localization';
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, FlatList, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppState } from "../contexts/AppState";

export default function Home() {
  const { width, height } = Dimensions.get('window')
  const padding = useSafeAreaInsets()
  const [fontsLoaded] = useFonts({
    'cairo' : require('@/assets/fonts/Cairo.ttf'),
  })

  const { t } = useTranslation()
  const router = useRouter()
  const appState = useAppState();
  const congratsRef = useRef<LottieView>(null);
  const [langCode, setLangCode] = useState<'ar'|'en'>('ar')
  const [dirMode, setDirMode] = useState<'ltr'|'rtl'>('rtl')
  const [city, setCity] = useState<string>()
  const [cities, setCities] = useState<{en:string, ar:string}[]>()
  const [hobbiesList, setHobbiesList] = useState<HobbiesList>()
  const [hobbiesMap, setHobbiesMap] = useState<Map<string, boolean>>(new Map())
  const [connectionErr, setConnectionErr] = useState(false);
  const [searchToggled, setSearchToggled] = useState(true);
  const [resultIndex, setResultIndex] = useState(0);
  const [lastPage, setLastPage] = useState(false);
  const [numPages, setNumPages] = useState<number>(0);
  const [totalResult, setTotalResult] = useState<number>(0)

  const peopleRanges = useRef([
    '2 > 4',
    '5 > 7',
    '8 > 10',
    '2 > 10'
  ]).current

  const [peopleRange, setPeopleRange] = useState(peopleRanges[1])
  const [searchResult, setSearchResult] = useState<Meeting[]>()
  const [searching, setSearching] = useState(false);

  const handleSearch = async (setZero = true, pageIndex:number|null = null) => {
    try {
      setSearching(true);
      setSearchResult(undefined);
      if (setZero) setResultIndex(0);
      const token = await getToken()
      if (!token) {
        router.replace('/login');
        return;
      }

      const r = await fetch(`${SERVER_URL}/meetings/search`, {
        method : 'POST',
        headers : {
          Authorization : `Bearer ${token}`,
          'Content-type' : 'application/json',
        },

        body : JSON.stringify({
          hobbies : Array.from(hobbiesMap.entries()).filter(e => e[1]).map(e => e[0]),
          pR : peopleRange,
          city : city == 'كل المدن' ? 'all' : cities?.find(e => e[langCode] === city)?.en,
          page : pageIndex ?? resultIndex
        })
      })

      if (r.status != 200) {
        setConnectionErr(true);
        setSearching(false);
        return;
      }

      const jR : {result : Meeting[], count : number} = await r.json();

      setSearchResult(jR.result)
      setTotalResult(jR.count)
      setNumPages(Math.ceil(jR.count / 10))
      setSearching(false)
    } catch (err) {
      setSearching(false);
      setConnectionErr(true);
    }
  }

  const handleLoadHobbies = () => {
    setConnectionErr(false)
    ServerUtils.getHobbies().then(r => {
      setConnectionErr(r == 'error');
      
      if (r == 'error') {
        return;
      }

      setHobbiesMap(new Map(r.map(e => ([e.en, false]))))
      setHobbiesList(r)
    })

  }

  useEffect(() => {
    const langCode = Localization.getLocales().at(0)?.languageCode == 'ar' ? 'ar' : 'en'
    setLangCode(langCode)
    const _cities : {en:string, ar:string}[] = require('@/assets/sources/cities.json') 
    setCities(_cities)
    handleLoadHobbies();
    ServerUtils.getCity().then(r => {
      if (r) setCity(r)
    })
  }, [])

  useEffect(() => {
    setDirMode(langCode == 'ar' ? 'rtl' : 'ltr');
  }, [langCode])

  useEffect(() => {
    if (appState.crMeet) {
      congratsRef.current?.play()
      appState.setCrMeet(false);
      appState.setMeetChange(true);
    }
  }, [appState.crMeet])

  const SearchView = () => {

    const allCities = {
      en : 'All cities',
      ar : 'كل المدن'
    };

    return <View style={{
        margin:10, 
        width:width - 20, 
        gap:10,
        backgroundColor:Colors.onSurface.concat('90'),
        paddingBottom:10,
        borderRadius:7
      }}
      onStartShouldSetResponder={() => true}
    >
      <View style={{width:'100%', padding : 10, paddingBottom:0, flexDirection:'row', gap:10, alignItems:'center'}}>
        <DropdownButton content={[allCities,...(cities??[])].map(e => langCode == 'en' ? e.en : e.ar)} text={t('city')}
          backgroundColor={Colors.secondaryShade} textColor={Colors.primary}
          value={city}
          onSelected={(e) => {
            setCity(e)
            ServerUtils.setCity(e)
          }} icon={"home"} iconColor={Colors.primary} scrollable />

        <DropdownButton content={peopleRanges} text={t('enter_mp').replace(' : ', '')}
          backgroundColor={Colors.secondaryShade} textColor={Colors.primary}
          value={peopleRange}
          onSelected={(e) => {
            setPeopleRange(e)
          }} icon={"people"} iconColor={Colors.primary} flex />

        <TouchableOpacity onPress={() => { setSearchToggled(!searchToggled) }}
          style={{justifyContent:'center',}}>

          <Ionicons name={searchToggled ? 'chevron-up' : 'chevron-down'}
            color={Colors.secondary} size={25}/>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { handleSearch() }}
          style={{
            justifyContent:'center', 
            alignItems:'center', 
            backgroundColor:Colors.secondary,
            borderRadius:25, 
            width:40, 
            height:40,
            shadowColor:Colors.secondary,
            shadowOffset : {width:0,height:0},
            shadowOpacity:.5,
            shadowRadius:4
          }}
        >
          <Ionicons name={'search'}
            color={Colors.surface} size={18}/>
        </TouchableOpacity>
      </View>
      
      {searchToggled ? <View style={{width:'100%', flexDirection:'row', flexWrap:'wrap', gap:5, justifyContent:'center'}}>
        {hobbiesList?.map(e => {
          const selected = hobbiesMap.get(e.en)
          return <TouchableOpacity key={e.en} style={{
            padding : 5,
            backgroundColor:Colors.secondaryShade,
            borderRadius:7,
            flexDirection:'row',
            gap:7,
            alignItems:'center',
            marginHorizontal:5
          }} onPress={() => {
            const newMap = new Map(hobbiesMap)
            newMap.set(e.en, !selected);
            setHobbiesMap(newMap)
          }} 
          >
            <Text style={{fontFamily:'Cairo', fontWeight:'700'}}>
              {e[langCode]}
            </Text>
            <Ionicons name={e.icon as any} color={Colors.secondary} size={16} />
            <Ionicons name={selected ? 'checkbox' : 'checkbox-outline'} color={Colors.secondary} size={16} />
          </TouchableOpacity>
        })}
      </View> : <></>}
    </View>
  }


  if (connectionErr) {
    return <NoInternetComponent content={[t('conn_err'), t('retry')]} callback={() => handleSearch()} />
  }


  return <View style={{flex:1, padding : 0}}>
    <Image source={require('@/assets/images/bg1.png')} style={{
      width:width,
      height:height * .65,
      position:'absolute',
      opacity:.1
    }} resizeMode='cover' />

    <ScrollView style={{
      flex:1,
      padding:0,
    }}>

      <SearchView />

      {searching ? <View style={{alignItems:'center'}}>
        <LoadingComponent />
      </View> : searchResult ? <> 
        <FlatList 
          data={searchResult}
          renderItem={({item, index}) => {
            return <MeetingComponentLarge key={index} content={t('more_info')} meeting={item} onPressed={() => {
              router.navigate({pathname:'/create_meeting/view_meeting/[id]', params : { id : item._id!}})
            }} 
              langCode={langCode} hobbies={hobbiesList?? [] as any}/>
          }}
        />

        <View style={{alignItems:'center', justifyContent:'space-evenly', flexDirection:'row', marginBottom:90}}>
          <TouchableOpacity style={{flexDirection:'row', alignItems:'center', gap:5}} onPress={() => { 
            if (resultIndex > 0) {
              handleSearch(false, resultIndex - 1)
              setResultIndex(resultIndex - 1)
            }
           }}>
            <Ionicons name="arrow-back" color={Colors.secondary} />
            <Text style={{fontFamily:'Cairo', textDecorationLine:'underline', color:Colors.secondary}}>{t('prev_page')}</Text>
          </TouchableOpacity>

          <View>
            <Text style={{fontWeight:'800', fontFamily:'Cairo'}}>{t('page')} : {resultIndex+1} </Text>
            <Text style={{fontWeight:'800', fontFamily:'Cairo', textAlign:'center'}}>{resultIndex+1} - {numPages} </Text>
          </View>

          <TouchableOpacity style={{flexDirection:'row', alignItems:'center', gap:5}} onPress={() => {
            if (resultIndex < (numPages-1)) {
              handleSearch(false, resultIndex + 1)
              setResultIndex(resultIndex + 1)
            }
          }}>
            <Text style={{fontFamily:'Cairo', textDecorationLine:'underline', color:Colors.secondary}}>{t('next_page')}</Text>
            <Ionicons name="arrow-forward" color={Colors.secondary} />
          </TouchableOpacity>
        </View>
      </> : <View style={{width:width, alignItems:'center'}}>
        <LottieView
          source={require('../../assets/lottie/1.json')}
          autoPlay={true}
          loop={true}
          style={{width:width * .75, height:width * .75}}
        />
      </View>}

    </ScrollView>
    <TouchableOpacity style={{
      position:'absolute',
      width:60,
      height:60,
      bottom : 10,
      right: 10,
      borderRadius:30, 
      overflow:'hidden'
    }} onPress={() => { router.navigate('/create_meeting') }} >

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