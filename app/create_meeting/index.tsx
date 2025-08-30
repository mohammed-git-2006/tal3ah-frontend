import LoadingComponent from "@/components/LoadingComponent";
import NoInternetComponent from "@/components/NoInternetComponent";
import i18n from "@/constants/i18n";
import { Colors, Theme } from "@/constants/Theme";
import { HobbiesList, loadUserFromStorage, Meeting, Place, ServerUtils } from "@/scripts/ServerController";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from '@react-native-picker/picker';
import * as Localization from 'expo-localization';
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Modal from 'react-native-modal';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import PagerView from 'react-native-pager-view';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppState } from "../contexts/AppState";
// import { usePagesState } from "../contexts/AppState";

export default function CreateMeeting() {
  const padding = useSafeAreaInsets();
  const { t } = useTranslation();
  const locales = Localization.getLocales();
  const [langCode, setLangCode] = useState<'en'|'ar'>()
  const [dirMode, setDirMode] = useState<'ltr'|'rtl'>()
  const pagerRef = useRef<PagerView>(null)
  const nameInputRef = useRef<TextInput>(null);
  const { width, height } = Dimensions.get('window')
  const maxPages = useRef(2).current
  const [name, setName] = useState("");
  const maxChars = useRef(30).current;
  const today = useRef(new Date(Date.now() + (1000 * 60 * 5))); // now + 10m a head
  const [loadingHobbies, setLoadingHobbies] = useState({loading:true, err:false});
  // const [loadingCities, setLoadingCities] = useState({loading:true, err:false});
  const [citiesList, setCitiesList] = useState<{en:string, ar:string, lat:number, lng:number}[]>()
  const [hobbiesList, setHobbiesList] = useState<HobbiesList>()
  const [hobbiesSet, setHobbiesSet] = useState<Map<string, boolean>>()
  const [selectedHobbies, setSelectedHobbies] = useState(0);
  const [selectedCity, setSelectedCity] = useState("Aqaba");
  const [markers, setMarkers] = useState<Map<string, Place[]>>()
  const [city, setCity] = useState<{en:string, ar:string, lat:number, lng:number}>({ en: "Amman", ar: "عمان", lat: 31.9539, lng: 35.9106 })
  const [place, setPlace] = useState<Place>()
  const [namingPlace, setNamingPlace] = useState(false);
  const [optionalName, setOptionalName] = useState("")
  const [peopleCount, setPeopleCount]   = useState(3);
  const [uploading, setUploading] = useState({loading:true, err:false});
  const maxPeople = useRef(10)
  const mapRef = useRef<MapView>(null)
  const setCreatedMeet = useAppState((s) => s.setCrMeet)
  const [timeDateModal, setTimeDateModal] = useState(false);

  const handleNameChange = (tex : string) => {
    setName(tex);
  }

  const handleLoadingHobbies = async () => {
    try {
      setLoadingHobbies({loading:true, err:false});
      const hobbies = await ServerUtils.getHobbies()
      if (hobbies == 'error') throw "Err";
      setHobbiesList(hobbies)
      setLoadingHobbies({loading:false, err:false})
      setHobbiesSet(new Map(hobbies.map(e => ([e.en, false]))))
    } catch (err)
    {
      setLoadingHobbies({loading:false, err:true});
    }
  };

  const handleLoadingCities = async () => {
    try {
      // setLoadingCities({loading:true, err:false});
      const cities = await ServerUtils.getCities()
      if (cities == 'error') throw "Err";
      setCitiesList(cities)
      // setLoadingCities({loading:false, err:false})
    } catch (err)
    {
      // setLoadingCities({loading:false, err:true});
    }
  }

  const handleLoadData = async () => {
    try {
      const token = await AsyncStorage.getItem('key') as string;
      const userProfile = await loadUserFromStorage()

      const router = useRouter();

      if (userProfile == 'login') {
        router.replace('/login');
        return;
      }

      const latlng : number[] = place?.latlng.split(',').map(e => Number.parseFloat(e))!        

      const request : Meeting = {
        name : name,
        city : city.en,
        pname : place?.name!,
        pid : place?.id!,
        lat : latlng[0],
        lng : latlng[1],
        cat : place?.cat!,
        max : peopleCount,
        time : meetDate!,
        people : [],
        hobbies : Array.from(hobbiesSet!).filter(e => e[1]).map(e => e[0]),
      };

      const uR = await ServerUtils.createMeeting(request, token);

      if (!uR) {
        setUploading({loading:false, err:true})
      } else {
        setCreatedMeet(true);
        router.back();
      }
    } catch (err) {
      alert(`Error happend : ${err}`)
      console.log(err)
    }
  }

  const changeMapLocation = () => {
    if (! mapRef.current) alert('Problem');

    mapRef.current?.animateCamera(
    {
      center: {
        latitude: city.lat,
        longitude: city.lng,
      },
      zoom: 12,
    },
    { duration: 1000 }
  );

  }

  useEffect(() => {
    setLangCode(locales[0].languageCode == 'en' ? 'en' : 'ar');
    setDirMode(langCode == 'ar' ? 'rtl' : 'ltr');
    i18n.changeLanguage(langCode)
    handleLoadingCities();
    changeMapLocation()
  }, [])

  const NavigationBar = ( {page, validator, absolute} : {page:number, validator: () => boolean, absolute?:boolean}) => {
    const _style = StyleSheet.create(absolute ? {
      style : {
        width:width,
        position:'absolute',
        bottom:0,
        right : 0
      }
    } : {style:{}})
    return <View style={{
      // width : width,
      width:'100%',
      justifyContent:'space-between',
      alignItems:'center',
      marginBottom:padding.bottom,
      marginTop:15,
      flexDirection:'row',
      ... _style.style
    }}>
      {page == 0 ? <View></View> : <TouchableOpacity style={{
        backgroundColor:Colors.secondary,
        borderRadius:15,
        padding : 10,
        width : width * .25,
        justifyContent:'space-evenly',
        alignItems:'center',
        height : 50,
        marginHorizontal:15,
        flexDirection:'row',
        shadowRadius:5,
        shadowOpacity:.5,
        shadowOffset: {width:0, height:0}

      }} onPress={() => { pagerRef.current!.setPage(page-1) }}>
        <Ionicons name="chevron-back" color={Colors.surface} size={30} />
        <Text style={[Theme.textSmall, {fontWeight:'800', color:Colors.surface}]}>
          {t('previous')}
        </Text>
      </TouchableOpacity>}
      <TouchableOpacity style={{
        backgroundColor:Colors.secondary,
        borderRadius:15,
        width : width * .25,
        justifyContent:'space-evenly',
        alignItems:'center',
        height : 50,
        paddingHorizontal:10,
        flexDirection:'row',
        marginHorizontal:15,
        shadowRadius:5,
        shadowOpacity:.5,
        shadowOffset: {width:0, height:0}
      }} onPress={() => { 
        if (page != maxPages) {
          if (validator()) pagerRef.current!.setPage(page+1);
        } else {
          validator()
        } }}>
        <Text style={[Theme.textSmall, {fontWeight:'800', color:Colors.surface}]}>
          {t(page == maxPages ? 'done' : 'next')}
        </Text>
        <Ionicons name="chevron-forward" color={Colors.surface} size={30} />
      </TouchableOpacity>
    </View>
  };

  const router = useRouter();

  const ConnectionErrComponent = () => {
    return <Text>Place holder</Text>
  }

  const HobbiesPage = () => {
    if (loadingHobbies.loading) 
    {
      return <View style={{flex:1, justifyContent:'center'}}>
        <LoadingComponent />
      </View>
    } else if (loadingHobbies.err)
    {
      return <ConnectionErrComponent/>
    }

    return <ScrollView style={{
      flex:1,
      direction:dirMode,
      paddingBottom:100,
    }}>

      <Text style={[Theme.textMedium, {fontWeight:'800', marginHorizontal:15}]}>
        {selectedHobbies} / 5
      </Text>

      <View style={{
        flexWrap:'wrap',
        flexDirection:'row',
        gap:10,
        alignItems:'center',
        justifyContent:'center',
        marginTop:15,
        marginHorizontal:15 
      }}>
        {hobbiesList?.map((e, i) => {
          if (hobbiesSet == undefined) return;
          const selected = hobbiesSet.get(e.en); 
          const color =  !selected ? Colors.secondary : '#00C853';
          return <TouchableOpacity key={e.en} onPress={() => {
            if (selectedHobbies == 5 && !selected)
            {
              return;
            }

            setHobbiesSet(new Map(hobbiesSet).set(e.en, !selected));
            setSelectedHobbies(selectedHobbies - (selected ? 1 : -1))
          }}>
            <View style={{
              backgroundColor:color,
              borderRadius:15,
              padding:12,
              shadowColor:color,
              shadowRadius:5,
              shadowOpacity:.7,
              flexDirection:'row',
              justifyContent:'space-between',
              alignItems:'center',
              gap:15,
            }}>
              <Text style={[Theme.textMedium, {fontWeight:'800', fontSize:15, color:Colors.surface}]}>
                {langCode == 'ar' ? e.ar : e.en}
              </Text>
              <Ionicons name={e.icon as any} color={Colors.surface} size={25} />
            </View>
          </TouchableOpacity>
        })}
      </View>
    </ScrollView>
    
  }

  const CitiesPage = () => {
    return <View style={{flex:1}}>
      <Picker mode="dialog"  itemStyle={{fontFamily:'Cairo', fontWeight:'800'}} onValueChange={(value:string) => {
        setSelectedCity(value)
        setCity(citiesList?.find(e => e.en == value)!)
        setPlace(undefined)
        changeMapLocation();
        
        if(! markers?.has(value)) ServerUtils.getPlaces(value).then(val => {
          if (val == 'error') return;
          setMarkers(new Map(markers).set(value, val))
        })
      }} selectedValue={selectedCity} style={{height:175}} >
        {citiesList?.map(e => {
          return <Picker.Item key={e.en} label={langCode == 'ar' ? e.ar : e.en} value={e.en}
            color={Colors.primary}  />
        })}
      </Picker>
      <View style={{flex:1}}>
        <View style={{marginHorizontal:20, flexDirection:'row', alignItems:'center', gap:5, marginBottom:5}}>
          <Text style={[Theme.textMedium]}>{selectedCity} {place ? ' - ' + place.name : ''}</Text>
          <Ionicons name="map" color={Colors.secondary} size={22} />
        </View>
        <MapView
          ref={mapRef}

          style={{
            flex:1, 
            marginHorizontal:15, 
            borderRadius:10,
            shadowColor:'gray',
            shadowRadius:5,
            shadowOpacity:.8,
            shadowOffset:{width:0, height:0}
          }}

          initialRegion={ place ? {
            latitude : Number.parseFloat(place.latlng.split(',')[0]),
            longitude : Number.parseFloat(place.latlng.split(',')[1]),
            latitudeDelta:.005,
            longitudeDelta:.005
          } : {
            latitude : city.lat,
            longitude : city.lng,
            latitudeDelta : .05,
            longitudeDelta: .05
          }}

          onPress={(e) => {
            if (e.nativeEvent.action == 'marker-press') return;
            const coords = e.nativeEvent.coordinate
            setPlace({cat:'', latlng:`${coords.latitude},${coords.longitude}`, name:'', rating:'.0'} as Place)
            setNamingPlace(true)
          }}

          provider={PROVIDER_GOOGLE}
      >

        {markers == undefined  ? <></> : markers.get(selectedCity)?.map((e, i) => {
          const sp = e.latlng.split(',')
          const lat = Number.parseFloat(sp[0]), lng = Number.parseFloat(sp[1]);
          return <Marker key={i} coordinate={{
            latitude : lat,
            longitude : lng
          }} title={e.name} description={e.cat} onPress={() => {
            setPlace(e)
            alert(`You choose : ${e.name}`)
          }} pinColor={e.name === place?.name ? '#00C853' : undefined} />
        })}

        {place ? <Marker key={'USER'} title={place.name} coordinate={{
          latitude : Number.parseFloat(place.latlng.split(',')[0]),
          longitude : Number.parseFloat(place.latlng.split(',')[1]),
        }} pinColor={'#00C853'}  /> : <></>}
        
      </MapView>
      </View>
    </View>
  }

  const SubmittingPage = () => {    
    if(uploading.loading)
    {
      return <View style={{
        flex:1,
        justifyContent:'space-evenly',
        alignItems:'center',

      }}>
        <LoadingComponent />
        <Text style={[Theme.textLarge]}>{t('uploading')}</Text>
      </View>
    } else if (uploading.err)
    {
      return <NoInternetComponent content={[t('conn_err'), t('retry')]} callback={() => {
        setUploading({loading:true, err:false})
      }} />
    }

    return <View>

    </View>
  }


  const [meetDate, setMeetDate] = useState<Date>()

  return <> 
  <View style={{flex:1}}>
    <Image source={require('@/assets/images/bg1.png')} style={{
      width:width,
      height:height * .65,
      position:'absolute',
      opacity:.1
    }} resizeMode='cover' />

    <View style={{
      padding : 10,
      paddingTop: padding.top,
      backgroundColor:Colors.secondary,
      flexDirection:'row',
      justifyContent:'space-between'
    }}>
      <TouchableOpacity onPress={() => { router.back() }}>
        <Ionicons name="chevron-back" color={Colors.surface} size={30} />
      </TouchableOpacity>
      <Text style={[Theme.textMedium, {fontWeight:'800', color:Colors.surface}]}> {t('create_meeting')} </Text>
    </View>

    <PagerView scrollEnabled={false} ref={pagerRef} initialPage={0} style={{flex:1}}>
      <View style={{flex:1}}>
        <ScrollView style={{flex:1, gap:5, padding : 0, direction:'rtl', width:width}}>
          <View style={{width:width, padding : 15, direction:'ltr', gap:10}}>
            <Text style={[Theme.textSmall, {textAlign:dirMode == 'rtl' ?'right' : 'left'}]}>{t('enter_name')}</Text>
            <TextInput style={{
              width:'100%',
              padding : 10,
              borderColor:Colors.secondary,
              borderRadius:15,
              height:50,
              borderWidth:2,
              backgroundColor:Colors.onSurface,
              fontFamily:'Cairo',
              fontWeight:'800',
              shadowColor:Colors.secondary,
              shadowRadius:5,
              shadowOpacity:.2,
              shadowOffset: {width:0, height:0}
            }} placeholder="Hello" cursorColor={Colors.secondary} selectionColor={Colors.secondary} maxLength={maxChars}
              onChangeText={handleNameChange} ref={nameInputRef} />
            
            <Text style={[Theme.textSmall, {fontWeight:'800', textAlign:dirMode == 'rtl' ?'right' : 'left'}]}>{name.length}/{maxChars}</Text>
            <Text style={[Theme.textMedium, {textAlign:dirMode == 'rtl' ?'right' : 'left'}]}>{t('enter_mp')}</Text>
            <Picker itemStyle={{fontFamily:'Cairo'}} onValueChange={(value:string) => {
              setPeopleCount(Number.parseInt(value))
            }} selectedValue={peopleCount.toString()} style={{height:175}} enabled={true} selectionColor={Colors.secondary}>
              {new Array(maxPeople.current - 1).fill(null)?.map((_, i) => {
                const v = `${i + 2}`
                return <Picker.Item key={i} label={v} value={v} color={Colors.primary} enabled={true} />
              })}
            </Picker>

            {/* <View style={{justifyContent:'center', alignItems:'center', width:'100%', marginTop:15}}>
              <Text style={[Theme.textMedium, {fontWeight:'800'}]}>{daySelected}</Text>
            </View> */}

            {/* <Calendar
            minDate={today}
            
            style={{
              width:width - 30,
              backgroundColor:'#F0F0F0'
            }} theme={{
              backgroundColor: Colors.secondary,
              calendarBackground: '#00000',
              textSectionTitleColor: '#b6c1cd',
              selectedDayBackgroundColor: Colors.secondary,
              selectedDayTextColor: '#ffffff',
              todayTextColor: Colors.secondary,
              dayTextColor: '#2d4150',
              textDisabledColor: '#c0c0c0ff'
            }}
            
            onDayPress={(day) => { setDaySelected(day.dateString) }}
            markedDates={{
              [daySelected] : {
                selectedColor:Colors.secondary, textColor:Colors.surface, color:Colors.secondary,
                selected: true,
              }
            }}
            /> */}
            {/* <DateTimePicker
              value={meetDate}
              mode="datetime"
              minimumDate={today}
              textColor={Colors.secondary}
              // is24Hour={true}              // Android 24h; iOS uses locale
              minuteInterval={1}           // iOS only
              onChange={(e) => {
                setMeetDate(new Date(e.nativeEvent.timestamp))
              }}
              display={"default"}
            /> */}
            <View style={{flexDirection:'row', marginHorizontal:10, alignItems:'flex-start', direction:dirMode}}>
              <TouchableOpacity style={{
                backgroundColor:Colors.secondary,
                borderRadius:15,
                padding : 10,
                justifyContent:'space-evenly',
                alignItems:'center',
                height : 50,
                flexDirection:'row',
                shadowRadius:5,
                shadowOpacity:.5,
                shadowOffset: {width:0, height:0}
              }} onPress={() => { setTimeDateModal(true) }}>
                <Text style={{color:Colors.surface, fontFamily:'Cairo', fontWeight:'800'}}> {t('choose_date')}</Text>
              </TouchableOpacity>
              <View style={{flex:1, alignItems:'center', height:50, justifyContent:'flex-end', flexDirection:'row'}}>
                <Text style={{fontFamily:'Cairo', fontSize:16, fontWeight:'800', color:Colors.primary}}
                  ellipsizeMode="tail" numberOfLines={1}>
                  {meetDate ? meetDate.toLocaleDateString() :  "--"} -
                  {meetDate ? ' ' + meetDate.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : ''}
                </Text>
              </View>
            </View>
            <DateTimePickerModal
              isVisible={timeDateModal}
              mode="datetime"
              date={meetDate ?? new Date()}
              minuteInterval={15}
              onConfirm={(e) => { setMeetDate(e);setTimeDateModal(false); }}
              onCancel={() => setTimeDateModal(false)}
              minimumDate={today.current}
            />


            <View style={{height:100}} />
          </View>
        </ScrollView>
        <NavigationBar absolute={true} page={0} validator={ () => {
          if (name.trim().length < 5)
          {
            alert(`name should be 5-${maxChars} characters`);
            nameInputRef.current?.focus();
            return false;
          } if (!meetDate) {
            setTimeDateModal(true);
            return false;
          }

          handleLoadingHobbies();

          return true;
        }}/>
      </View>

      <View style={{flex:1}}>
        <HobbiesPage />
        <NavigationBar absolute page={1} validator={ () => {
          if (selectedHobbies == 0)
          {
            alert(`Choose 1-5 hobbies`);
            return false;
          }

          setMarkers(new Map<string, Place[]>())

          // handleLoadingCities();

          return true;
        }}/>
      </View>
      
      <View style={{flex:1}}>
        <CitiesPage />
        <NavigationBar page={2} validator={ () => {
          if (place == null)
          {
            alert(`Choose place`);
            return false;
          }

          Alert.alert(t('confirm'), `${t('rus')}\n${langCode == 'ar' ? city.ar : city.en} - ${place.name} - ${meetDate?.toLocaleString()}`, [
            {text:t('decline'), isPreferred:false, onPress:(v) => {}},
            {text:t('accept'), isPreferred:true, onPress:(v) => {
              pagerRef.current?.setPage(3);
              handleLoadData();
            }},
          ], {cancelable : false})

          return false;
        }}/>
      </View>

      <View style={{flex:1}}>
        <SubmittingPage />
      </View>
    </PagerView>


    <Modal isVisible={namingPlace} style={{justifyContent:'center', alignItems:'center'}}>
      <View style={{
        width:width * .75,
        backgroundColor:Colors.surface,
        borderRadius:15,
        padding : 15,
        gap:15
      }}>

        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          <Text style={[Theme.textMedium]}>{t('name_place')}</Text>
          <TouchableOpacity onPress={() => {
            setPlace(undefined)
            setNamingPlace(false);
          }}>
            <Ionicons name="close" color={Colors.primary} size={25} />
          </TouchableOpacity>
        </View>

        <TextInput style={{
          width:'100%',
          padding : 10,
          borderColor:Colors.secondary,
          borderRadius:15,
          height:50,
          borderWidth:2,
          backgroundColor:Colors.onSurface,
          fontFamily:'Cairo',
          fontWeight:'800',
          shadowColor:Colors.secondary,
          shadowRadius:5,
          shadowOpacity:.2,
          shadowOffset: {width:0, height:0}
        }} placeholder="Hello" cursorColor={Colors.secondary} selectionColor={Colors.secondary} maxLength={maxChars}
          onSubmitEditing={(e) => { setOptionalName(e.nativeEvent.text) }} />

        <TouchableOpacity style={{
          backgroundColor:optionalName.length >= 5 ? Colors.secondary : Colors.onSurface,
          borderRadius:10,
          padding:15,
          width:'100%',
          alignItems:'center'
        }} onPress={() => {
          if (optionalName.length < 5) {
            return;
          }

          setPlace({...place!, name: optionalName})
          setNamingPlace(false);
        }}>
          <Text style={[Theme.textMedium, { color:optionalName.length < 5 ? Colors.primary:Colors.surface }]}> {t('done')} </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  </View>

  </>
}