import { useAppState } from "@/app/contexts/AppState";
import LoadingComponent from "@/components/LoadingComponent";
import NoInternetComponent from "@/components/NoInternetComponent";
import { HTag } from "@/components/Tag";
import { Colors, Theme } from "@/constants/Theme";
import { getToken, HobbiesList, loadUserFromStorage, Meeting, ServerUtils, User } from "@/scripts/ServerController";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as Localization from 'expo-localization';
import { useLocalSearchParams, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Animated, Dimensions, Easing, FlatList, Image, LogBox, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
// import Modal from 'react-native-modal';
// import DateTimeView from '@react-native-community/datetimepicker';
import { Calendar } from 'react-native-calendars';
import { useSafeAreaInsets } from "react-native-safe-area-context";

const  getAlign = (text:string) : 'left'|'right' => {
  return /[\u0600-\u06FF]/.test(text) ? 'right' : 'left';
}

export default function MeetView() {
  const padding = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const { width, height} = Dimensions.get('window')
  const [meeting, setMeeting] = useState<Meeting>()
  const [ls, setLS] = useState<{loading:boolean, err:boolean}>({loading:true, err:false})
  const [langCode, setLangCode] = useState<'en'|'ar'>()
  const [dirMode, setDirMode] = useState<'ltr'|'rtl'>()
  const [token, setToken] = useState("")
  const locales = Localization.getLocales();
  const { t } = useTranslation();
  const [people, setPeople] = useState<Map<string, User>>();
  const [hobbiesList, setHobbiesList] = useState<HobbiesList>();
  const [userProfile, setUserProfile] = useState<User>()
  const [done, setDone] = useState(false);
  const router = useRouter();
  const [joiningMeeting, setJoiningMeeting] = useState(false)
  const [ownerModif, setOwnerModif] = useState(false);
  const { setMeetChange } = useAppState()
  
  const a0 = useRef(new Animated.Value(0)).current
  const a1 = useRef(new Animated.Value(0)).current
  const a2 = useRef(new Animated.Value(0)).current
  const a3 = useRef(new Animated.Value(0)).current
  const a4 = useRef(new Animated.Value(0)).current
  const a5 = useRef(new Animated.Value(0)).current
  const a6 = useRef(new Animated.Value(0)).current
  const a7 = useRef(new Animated.Value(0)).current
  const a8 = useRef(new Animated.Value(0)).current
  const a9 = useRef(new Animated.Value(0)).current
  const i0 = useRef(new Animated.Value(0)).current
  const i1 = useRef(new Animated.Value(0)).current
  const i2 = useRef(new Animated.Value(0)).current
  const i3 = useRef(new Animated.Value(0)).current
  const i4 = useRef(new Animated.Value(0)).current
  const i5 = useRef(new Animated.Value(0)).current
  const i6 = useRef(new Animated.Value(0)).current
  const i7 = useRef(new Animated.Value(0)).current
  const i8 = useRef(new Animated.Value(0)).current
  const i9 = useRef(new Animated.Value(0)).current
  const tagsRef = useRef(new Animated.Value(0)).current
  const placeInfoRef = useRef(new Animated.Value(0)).current
  const calendarRef = useRef(new Animated.Value(0)).current
  const peopleListRef = useRef(new Animated.Value(0)).current

  const aRefs = useRef([
    a0,a1,a2,a3,a4,a5,a6,a7,a8,a9
  ])

  const iRefs = useRef([
    i0,i1,i2,i3,i4,i5,i6,i7,i8,i9
  ])


  const getHobby = (name:string) => {
    for(let h of hobbiesList!) {
      if (h.en == name) return h;
    }

    return undefined;
  }

  const handleLoadData = async () => {
    setLS({loading:true, err:false})
    try {
      setLS({loading:true, err:false})
      const token = await getToken()
      setToken(token!)
      const user = await loadUserFromStorage()
      if (user == 'login') {
        router.replace('/login');
        return;
      }

      setUserProfile(user.user)
      const _meeting = await ServerUtils.getMeeting(token!, id as string) 
      setMeeting(_meeting)

      var newMap = new Map<string, User>()

      for(let _name of [_meeting.author, ..._meeting?.people!]) {
        const userProfile = await ServerUtils.getUser(token!, _name!);
        console.log(userProfile)
        newMap.set(_name!, userProfile);
      }

      setPeople(newMap)

      const hobbies = await ServerUtils.getHobbies()
      if (hobbies == 'error') throw "Err";

      setHobbiesList(hobbies)

      setLS({loading:false, err:false})
    } catch (err) {
      alert(err)
      // alert(`${JSON.stringify(err, null, 2)}`)
      setLS({loading:false, err:true})
    }
  }


  useEffect(() => {
    if(meeting) {
      for(let i=0;i<10;++i) {
        const delay = i * 75 + 500
        const duration = 250
        aRefs.current[i].setValue(.0);
        iRefs.current[i].setValue(.0);
        tagsRef.setValue(.0);
        placeInfoRef.setValue(.0);
        calendarRef.setValue(.0);
        peopleListRef.setValue(.0);
        Animated.sequence([
          Animated.timing(aRefs.current[i], {
            useNativeDriver:true,
            toValue:-15,
            duration : duration,
            delay : delay,
            easing: Easing.inOut(Easing.sin),
          }),
          Animated.timing(aRefs.current[i], {
            useNativeDriver:true,
            toValue:0,
            duration : duration,
            delay : 0,
            easing: Easing.inOut(Easing.sin),
          })
        ]).start();

        Animated.timing(iRefs.current[i], {
          useNativeDriver:true,
          toValue:1.0,
          duration : 100,
          delay : 750 + delay,
          easing: Easing.inOut(Easing.sin),
        }).start()
      }

      setTimeout(() => {
        Animated.sequence([tagsRef, placeInfoRef, calendarRef, peopleListRef].map(e => {
          return Animated.timing(e, {
            useNativeDriver:true,
            toValue:1.0,
            duration : 350,
            easing: Easing.inOut(Easing.sin),
          })
        })).start()
      }, 2500);

    }
  }, [meeting])


  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    const lCode = locales[0].languageCode == 'ar' ? 'ar' : 'en';
    setLangCode(lCode);
    setDirMode(lCode == 'ar' ? 'rtl' : 'ltr');
    handleLoadData();
  }, [])

  const handleLeaveMeeting = () => {
    ServerUtils.leaveMeeting(token, meeting?._id!).then(r => {
      setMeetChange(true)
      handleLoadData();
    })
  }

  if (ls.loading) {
    return <View style={{flex:1, justifyContent:'center'}}>
      <LoadingComponent />
    </View>
  } else if (ls.err) {
    return <NoInternetComponent content={[t('conn_err'), t('retry')]} callback={handleLoadData} />
  }

  const PersonsView = () => {
    const w = 100, h = 100;
    const l = meeting?.people.length! + 1;
    const offset = (w / 2)

    return <View style={{
      marginHorizontal:10, 
      flexDirection:'row', 
      marginTop:10, 
      height:(h * (Math.ceil(l / 5.0))) + 10, 
      marginVertical:20,
    }}>
      {[meeting?.author, ...meeting?.people!].map((e, _i) => {
        const i = _i % 5;
        const y = Math.floor(_i / 5.0) * (h + 10);
        return <Animated.View key={_i} style={{
          width:w, 
          height:h, 
          borderRadius:w/2, 
          backgroundColor:Colors.secondary,
          shadowColor:Colors.primary,
          shadowOffset : {width:0, height:0},
          shadowRadius:5,
          shadowOpacity:.7,
          position:'absolute',
          left : ((width - 20) / 2) - (w/2) + (w * i) - (offset * i) - (offset * ((Math.min(l, 5) - 1) / 2)),
          top : y,
          opacity : iRefs.current[_i]
        }}>
          <Image source={{uri:people?.get(e!)?.img}} style={{
            width:w, 
            height:h, 
            borderRadius:w/2,
          }}  />
          <Ionicons style={{
            position:'absolute', 
            top:5, left:w/2-10,
            opacity:e === meeting?.author ? 1 : 0,
            shadowColor:'#FFD700',
            shadowRadius:5,
            shadowOpacity:.8,
            shadowOffset : {width:0, height:0}
          }} name="star" color={'#d8b800ff'} size={20} />
        </Animated.View>
      })}
    </View>
  }

  const DotsView = () => {
    return <View style={{flexDirection:'row', gap:15, justifyContent:'center', width:width - 20, alignItems:'center', marginBottom:10, marginHorizontal:10, marginTop:10}}>
      <View style={{flexDirection:'row', gap:7}}>
        {new Array(meeting!.max).fill(null).map((_, i) => {
          const s = (width *.5 / 10.0)
          return <Animated.View key={i} style={{
            width:s,
            height:s,
            borderRadius:s * .2,
            backgroundColor:'green',
            opacity : (i < meeting!.people.length+1 ? 1.0 : 0.35),
            transform : [{translateY : aRefs.current[i]}]
          }}>
          </Animated.View>
        })}
      </View>
      <Text style={{fontFamily:'Cairo', fontWeight:'800'}}>
        {meeting!.people.length + 1} / {meeting!.max}
      </Text>
    </View>
  }

  const DateView = () => {

    // Calculate dates between today and meeting date
    const today = new Date();
    const meetingDate = new Date(meeting?.time!);
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const end = new Date(meetingDate.getFullYear(), meetingDate.getMonth(), meetingDate.getDate());
    const dates: string[] = [];
    let d = new Date(start);
    while (d <= end) {
      dates.push(d.toISOString().split('T')[0]);
      d.setDate(d.getDate() + 1);
    }

    // Prepare markedDates for Calendar
    const markedDates: Record<string, any> = {};
    dates.forEach((date, idx) => {
      markedDates[date] = {
        startingDay: idx === 0,
        endingDay: idx === dates.length - 1,
        color: Colors.secondaryShade,
        textColor: Colors.primary,
        ...(idx === 0 && {
          selected: true,
          selectedColor: Colors.secondaryShade,
          selectedTextColor: Colors.surface,
        })
      };
    });
    // Highlight meeting date
    markedDates[end.toISOString().split('T')[0]] = {
      selected: true,
      selectedColor: Colors.secondary,
      selectedTextColor: Colors.surface,
      endingDay: true,
      color: Colors.secondary,
      textColor: Colors.surface,
    };

    return (
      <Animated.View style={{opacity:calendarRef}}>
        <Calendar
          style={{
            marginBottom: 10,
            marginHorizontal:10,
            borderRadius:10,
            shadowColor:Colors.primaryShade,
            shadowOffset:{width:0, height:0},
            shadowRadius:5,
            shadowOpacity:.25
          }}
          markedDates={markedDates}
          markingType="period"
          theme={{
            calendarBackground: 'white',
          }}
          // hideArrows
          current={today.toISOString().split('T')[0]}
        />
      </Animated.View>
    )
    // return <DateTimeView value={new Date(meeting?.time!)} />
  }

  const PlaceInfoView = () => {
    const [difference, setDifference] = useState("")


    const getDifference = () => {
      const now = new Date().getTime();
      const then = new Date(meeting!.time!).getTime()
      const d = then - now;
      console.log(d)

      if (d < 0) {
        setDone(true);
        setDifference('Done')
        return;
      }

      const days = Math.floor(d / 24 / 60 / 60 / 1000)
      const hours = Math.floor(d / 60 / 60 / 1000)
      const minutes = Math.floor(d / 60 / 1000)
      const weeks = Math.floor(days / 7)
      const order = [[weeks, 'w'], [days%7, 'd'], [hours%24, 'h'], [minutes%60, 'm']];
      var r : string[] = order.filter(e => e[0] as number > 0).slice(0, 2).map(e => e.join(''))
      setDifference(r.join(' - '))
    }

    useEffect(() => {
      getDifference();
    }, [])

    return <Animated.View style={{
      marginHorizontal:20,
      marginBottom:20,
      opacity:placeInfoRef,
    }}>
      <View style={{width:width-40, flexDirection: 'row', alignItems: 'center', direction:'rtl', gap: 8}}>
        <Ionicons name="business" size={24} color={Colors.secondary} />
        <Text style={[Theme.textMedium, {fontWeight:'800'}]}>{meeting?.city}</Text>
      </View>
      <View style={{width:'100%', backgroundColor:'gray', height:1}} />
      <View style={{width:width-40, flexDirection: 'row', alignItems: 'center', direction:'rtl', gap: 8}}>
        <Ionicons name="pin" size={24} color={Colors.secondary} />
        <Text style={[Theme.textMedium, {fontWeight:'800',flex:1, textAlign:'left'}]}>{meeting?.pname}</Text>
      </View>
      <View style={{width:'100%', backgroundColor:'gray', height:1}} />
      <View style={{width:width-40, flexDirection: 'row', alignItems: 'center', direction:'rtl', gap: 8}}>
        <Ionicons name="time" size={24} color={Colors.secondary} />
        <Text style={[Theme.textMedium, {fontWeight:'800', flex:1, textAlign:'left'}]}>{meeting?.time.toLocaleString().split('T')[0]}</Text>
        {done ? <Ionicons name="checkmark-done" color={Colors.secondary} size={20} />: 
          <Text style={[Theme.textMedium, {fontWeight:'800'}]}>{difference}</Text>}
      </View>
    </Animated.View>
  }

  const SpecialMapView = () => {
    const [latitude, longitude] = [meeting!.lat, meeting!.lng]

    return <View style={{justifyContent:'center', alignItems:'center'}}>
      <MapView provider="google" style={{
        width:width - 20,
        height:width,
        borderRadius:15,
        shadowColor:Colors.primary,
        shadowOffset:{width:0,height:0},
        shadowOpacity:.7,
        pointerEvents:'none'
      }} initialRegion={{
        latitude : latitude,
        longitude : longitude,
        latitudeDelta:.01,
        longitudeDelta:.01,
      }}>
        <Marker coordinate={{
          latitude:latitude,
          longitude:longitude,
        }} />
      </MapView>
    </View>
  }

  const TagsView = () => {
    return <Animated.View style={{
      flexWrap:'wrap',
      justifyContent:'center',
      flexDirection:'row',
      gap:10,
      marginVertical:15,
      opacity:tagsRef
    }}>
      {meeting?.hobbies.map((e, i) => {
        const h = getHobby(e)!
        return <HTag content={langCode == 'ar' ? h.ar : h.en} iconName={h.icon} key={i} index={i}  />
      })}
    </Animated.View>
  }

  const PeopleListView = () => {
    const Tile = ({name} : {name:string}) => {
      const user : User = people?.get(name)!
      const w = 40;
      const h = 40;

      return <TouchableOpacity style={{
        backgroundColor:'#f3f3f3', 
        height:50,
        flexDirection:'row',
        padding : 10,
        alignItems:'center',
        gap:10,
      }}>
        <Image source={{uri:user.img}} style={{
          width:w, 
          height:h, 
          borderRadius:w/2,
        }}  />
        <Text style={[Theme.textMedium, {fontWeight:'800', flex:1}]} numberOfLines={1} ellipsizeMode="tail">
          {user.name}
        </Text>
        {user.email == meeting!.author ? <>
          <Ionicons style={{
            shadowColor:Colors.primaryShade,
            shadowRadius:5,
            shadowOpacity:.8,
            shadowOffset : {width:0,height:0}
          }} name="star" color={Colors.primary} size={15} />
        </> : <></>}
        {/* {name != meeting!.author! ? <TouchableOpacity>
          <Ionicons name="arrow-forward" color={Colors.secondary} size={25} />
        </TouchableOpacity> : <></>} */}
      </TouchableOpacity>
    }



    return <FlatList
      data={[meeting!.author ,...meeting!.people]}
      renderItem={({item}) => {
        return <Tile name={item!}/>
      }}

      ItemSeparatorComponent={() => <View style={{height:2, backgroundColor:'lightgray'}}></View>}
      keyExtractor={(item, i) => (i.toString())}
      style={{
        height:'100%',
        marginBottom:15, 
        marginHorizontal:10, 
        borderRadius:10, 
      }}
    />
  }

  const BottomBar = () => {
    const isCreator = useRef(userProfile?.email === meeting?.author).current
    const isMax = useRef(meeting!.people.length+1 == meeting!.max).current

    const handleJoin = async () => {
      setJoiningMeeting(true)
      const r = ServerUtils.joinMeeting(token, meeting!._id!)
      if (!r) {
        alert(`Failed to join the meeting`)
        return;
      }

      setJoiningMeeting(false);
      setMeetChange(true)
      handleLoadData();
    }

    const adminHandleDelete = async () => {
      Alert.alert('Are you sure ?', 'Are you sure ?', [
        {isPreferred:true, text:'No', onPress:() => {}},
        {isPreferred:false, text:'Yes', onPress:async () => {
          setLS({loading:true, err:false});
          const r = await ServerUtils.deleteMeeting(id as string, token)
          
          if (!r) {
            setLS({loading:false, err:true});
            return;
          }

          setMeetChange(true);
          router.back();

        }, style : "destructive"},
      ])
    }


    const adminHandleModifyPanel = () => {
      setOwnerModif(true);
    }

    const _s = StyleSheet.create({
      button : {}
    })


    const adminToolsList = [
      {icon : 'trash-bin', color : 'red', job : adminHandleDelete},
      {icon : 'pencil', color : 'black', job : adminHandleModifyPanel},
    ];

    if (isMax && !isCreator) {
      return <View style={{width:width, paddingHorizontal:10, marginTop:15}}>
        <View style={{
          backgroundColor: Colors.secondary.concat('40'),
          padding: 15,
          borderRadius: 15,
          shadowColor: Colors.secondary.concat('40'),
          shadowOffset: { width: 0, height: 0 },
          shadowRadius: 7,
          shadowOpacity: .7,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection:'row',
          gap:15,
        }}>
          <Text style={[Theme.textMedium, { color: Colors.surface }]}>{t('meeting_full')}</Text>
          {/* <Ionicons name="log-in-outline" size={24} color={Colors.surface} style={{ marginTop: 5 }} /> */}
        </View>
      </View> 
    }

    if (!isCreator &&  meeting?.people.find(e => e === userProfile?.email)) return <TouchableOpacity
      style={{
        backgroundColor: '#9d1719ff',
        padding: 15,
        borderRadius: 15,
        marginHorizontal:10,
        marginTop:15,
        shadowColor: '#9d1719ff',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 7,
        shadowOpacity: .5,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection:'row',
        gap:15,
      }} onPress={() => {
        Alert.alert('', t('rusleave'), [
          {
            isPreferred:true, 
            text : 'No',
            style : 'cancel',
          },
          {
            isPreferred : false,
            text : 'Yes',
            style : 'destructive',
            onPress : handleLeaveMeeting
          }
        ])
      }}>
        <Text style={[Theme.textMedium, {fontWeight:'800', color:Colors.surface}]}>{t('leave')}</Text>
    </TouchableOpacity>
    
    if (!isCreator) {
      return <View style={{width:width, paddingHorizontal:10, marginTop:15}}>
        <TouchableOpacity style={{
          backgroundColor: Colors.secondary.concat(joiningMeeting ? '40' : ''),
          padding: 15,
          borderRadius: 15,
          shadowColor: Colors.secondary.concat(joiningMeeting ? '40' : ''),
          shadowOffset: { width: 0, height: 0 },
          shadowRadius: 7,
          shadowOpacity: .7,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection:'row',
          gap:15
        }} onPress={() => { handleJoin() }}>
          { joiningMeeting ?<>
            <LottieView source={require('@/assets/lottie/loading.json')} autoPlay={true} loop={true}
              style={{width:30, height:30, transform : [{scale:3}]}} />
          </> : <>
            <Text style={[Theme.textMedium, { color: Colors.surface }]}>{t('join')}</Text>
            <Ionicons name="log-in-outline" size={24} color={Colors.surface} style={{ marginTop: 5 }} />
          </> }
        </TouchableOpacity>
      </View>
    }


    return <View style={{
      backgroundColor:Colors.onSurface,
      padding: 15,
      borderRadius: 15,
      shadowColor: Colors.onSurface,
      shadowOffset: { width: 0, height: 0 },
      shadowRadius: 7,
      shadowOpacity: .7,
      alignItems: 'center',
      justifyContent: 'space-evenly',
      flexDirection:'row',
      gap:15,
      marginHorizontal:10,
      marginTop:15
    }}>
      {adminToolsList.map((e, i) => {
        return <TouchableOpacity onPress={() => {e.job()}} key={i} style={{
          flex:1, alignItems:'center', justifyContent:'center'
        }}>
          <Ionicons name={e.icon as any} size={26} color={e.color} />
        </TouchableOpacity>
      })}
    </View>
  }

  const s = StyleSheet.create({
    dir : {
      direction : langCode == 'ar' ? 'rtl' : 'ltr',
      flexDirection:'column',
      alignItems:'flex-start',
      gap:5
    },

    input : {
      backgroundColor:Colors.onSurface,
      width:'100%',
      // marginHorizontal:15,
      padding : 7,
      borderRadius:7,
      fontFamily:'Cairo',
      fontWeight:'600',
      color : Colors.primary
    }
  }) 

  const AdminPanel = () => {
    const [eName, setName] = useState(meeting!.name);
    const [eMax, setMax] = useState(meeting!.max)
    const oName = useRef(meeting!.name).current;
    const oMax = useRef(meeting!.max).current;
    const [updating, setUpdating] = useState({stat:false, err:false})

    const handleUpdate = async () => {
      try {
        setUpdating({stat:true, err:false})
        await ServerUtils.updateMeeting(id as string, token, eMax, eName);
        setUpdating({stat:false, err:false})
        setOwnerModif(false)
        handleLoadData();
        setMeetChange(true);
      } catch (err) {
        setUpdating({stat:false, err:true})
      }
    }

    const pl = meeting!.people.length;

    return <Modal 
      animationType="slide"
      visible={ownerModif}
      onRequestClose={() => { setOwnerModif(false) }}
    >
      
      <View style={{
        backgroundColor:Colors.surface, 
        padding : 15,
        position:'absolute',
        width:width,
        bottom : 0,
        height: height - padding.top
      }}>
        <View style={{flexDirection:'row', direction:langCode == 'ar' ? 'rtl' : 'ltr', alignItems:'center', justifyContent:'space-between'}}>
          <Text style={[Theme.textMedium]}>
            {t('edit_m')}
          </Text>
          <TouchableOpacity onPress={() => { setOwnerModif(false) }}>
            <Ionicons name="close" color={Colors.primary} size={30} />
          </TouchableOpacity>
        </View>
        <View style={{flex:1, marginTop:20}}>
          <View style={[s.dir]}>
            <Text style={[Theme.textMedium]}>
              {t('edit_name')} <Text style={{fontWeight:'800'}}>{eName}</Text>
            </Text>
            <TextInput numberOfLines={1} style={[s.input]} placeholder="..." placeholderTextColor={'gray'}
              onChangeText={(t) => { setName(t) }} value={eName} />
          </View>

          <View style={[s.dir, {flex:1, marginTop:20}]}>
            <Text style={[Theme.textMedium]}>
              {t('edit_max')} 
            </Text>

            <Picker onValueChange={(v) => { setMax(v) }} mode="dialog" selectedValue={eMax} style={{height:150, width:'100%'}}>
              {new Array(pl == 0 ? 9 :  10 - pl).fill(null).map((_, i) => {
                const v = i + (pl == 0 ? 2 : 1) + pl;
                if (v == 1) return <View key={"e"}></View>
                return <Picker.Item key={i} label={v.toString()} value={v} color="black" />
              })}
            </Picker>
          </View>
        </View>

        {oMax != eMax || eName != oName ? <View style={{width:'100%', paddingHorizontal:10, marginTop:15}}>
          <TouchableOpacity style={{
            backgroundColor: Colors.secondary.concat(updating.stat ? '40' : ''),
            padding: 10,
            borderRadius: 15,
            shadowColor: Colors.secondary.concat(updating.stat ? '40' : ''),
            shadowOffset: { width: 0, height: 0 },
            shadowRadius: 7,
            shadowOpacity: .7,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection:'row',
            gap:15,
            marginBottom:padding.bottom
          }} onPress={() => { handleUpdate() }}>
            {updating.stat ?<>
              <LottieView source={require('@/assets/lottie/loading.json')} autoPlay={true} loop={true}
                style={{width:30, height:30, transform : [{scale:3}]}} />
            </> : <>
              <Text style={[Theme.textMedium, { color: Colors.surface }]}>{t('done')}</Text>
              <Ionicons name="save" size={20} color={Colors.surface} style={{ marginTop: 5 }} />
            </>}
          </TouchableOpacity>
        </View> : <></>}
      </View>
    </Modal>
  }


  console.log(token)

  return <View style={{flex:1, width:width}}>
    <View style={{
      padding : 10,
      width:width,
      paddingTop:padding.top,
      backgroundColor:Colors.secondary,
    }}>
      <Text style={[Theme.textLarge, {textAlign : getAlign(meeting?.name!), color:Colors.surface}]}>
        {meeting?.name}
      </Text>
    </View>

    <ScrollView style={{flex:1}}>
      <PersonsView />
      <DotsView />
      <TagsView />
      <PlaceInfoView />
      <DateView />
      <PeopleListView />
      <SpecialMapView />
      <BottomBar />
      <View style={{height:padding.bottom * 2}} />
    </ScrollView>


    <AdminPanel />
  </View>
} 