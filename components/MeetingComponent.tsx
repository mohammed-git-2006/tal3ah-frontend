import { Colors, Theme } from "@/constants/Theme";
import { HobbiesList, Meeting } from "@/scripts/ServerController";
import { Ionicons } from "@expo/vector-icons";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { HTag, IconsMap } from "./Tag";

const ICM = new Map<string, string>([
  ["Cars", "red"],
  ["Movies", "black"],
  ["Photography", "lightblue"],
  ["Cooking", "orange"],
  ["Gardening", "green"],
  ["Reading", "brown"],
  ["Traveling", "deepskyblue"],
  ["Hiking", "forestgreen"],
  ["Painting", "purple"],
  ["Music", "gold"],
  ["Dancing", "hotpink"],
  ["Fishing", "teal"],
  ["Cycling", "dodgerblue"],
  ["Swimming", "aqua"],
  ["Chess", "gray"],
  ["Camping", "saddlebrown"],
  ["Collecting Stamp", "navy"],
  ["Bird Watchin", "olive"],
  ["Writing", "darkslategray"],
  ["Cards", "crimson"],
])

export function MeetingComponent({meeting, onPressed, content} : 
  {content:string, meeting:Meeting, onPressed:() => void}) {
  const { width, height } = Dimensions.get('window')

  const  isArabic = (text:string) => {
    return /[\u0600-\u06FF]/.test(text);
  }

  return <View style={{
    margin: 15,
    width:width * .85,
    height : 'auto',
    backgroundColor:Colors.surface,
    shadowColor:Colors.primary,
    shadowOffset : {width:0,height:0},
    shadowRadius:5,
    shadowOpacity:.3,
    borderRadius:15,
  }}>
    <View style={{
      width:'100%',
      backgroundColor:Colors.secondary,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
    }}>
      <View style={{
        width:'100%', 
        flex:1,
        opacity : .4,
        position:'absolute'
      }}>
        {new Array(20).fill(null).map((e, i) => {
          const [hs, vs] = [5, 4]
          const hu = width * .85 / hs;
          const vu = 150 * .6 / vs;
          const xo = (i % (hs)) * hu + 0;
          const yo = Math.floor(i / (hs)) * vu;
          const hr = Math.random() * .5 * hu;
          const vr = Math.random() * .5 * vu;
          const hi = meeting.hobbies.length == 2 ? 
            Math.floor(Math.random() * 2) : 
            Math.ceil(Math.random() * (meeting.hobbies.length - 1))
          const hobby = meeting.hobbies[hi];
          return <View style={{
            position:'absolute',
            left : xo + hr,
            top : yo + vr
          }} key={i}>
            <Ionicons name={IconsMap.get(hobby) as any} color={ICM.get(hobby as string)} size={18} />
          </View>
        })}
      </View>

      <View style={{flex:1, margin:15, direction:isArabic(meeting.name) ? 'rtl' : 'ltr', alignItems:'flex-start'}}>
        <Text style={[Theme.textLarge, {color:Colors.surface, fontSize:20}]} ellipsizeMode="tail" numberOfLines={1}>
          {meeting.name}
        </Text>
        <View style={{flex:1}}></View>
        <Text style={[Theme.textMedium, {fontWeight:'600', color:Colors.surface}]}>
          {meeting.pname} - {meeting.city}
        </Text>
        <Text style={[Theme.textMedium, {fontWeight:'800', color:Colors.surface}]}>
          {meeting.cat.split('').map((e, i) => { return i == 0 ? e.toUpperCase() : e }).join('')}
        </Text>
      </View>
    </View>
    <View style={{
      padding: 10,
      flex:1
    }}>
      <View style={{flexDirection:'row', gap:7, flex:1, alignItems:'center', marginBottom:10}}>
        {new Array(meeting.max).fill(null).map((_, i) => {
          const s = (width *.5 / 10.0)
          return <View key={i} style={{
            width:s,
            height:s,
            borderRadius:s * .15,
            backgroundColor:'green',
            opacity : (i < meeting.people.length+1 ? 1.0 : 0.35)
          }}>
          </View>
        })}
        <View style={{flex:1}} />
        <Text style={{fontFamily:'Cairo', fontWeight:'800'}}>
          {meeting.people.length + 1} / {meeting.max}
        </Text>
      </View>

      <TouchableOpacity style={{
        backgroundColor:Colors.secondary,
        flexDirection:'row',
        width:'100%',
        // padding:5,
        height:40,
        borderRadius:12,
        opacity:.85,
        alignItems:'center',
        justifyContent:'space-between',
        paddingHorizontal:10,
        direction:isArabic(content) ? 'rtl' : 'ltr'
      }} onPress={onPressed}>
        <Text style={[Theme.textMedium, {color:Colors.surface, fontWeight:'800', fontSize:15}]}>
          {content}
        </Text>
        <Ionicons name="information-circle-outline" size={24} color={Colors.surface} />
      </TouchableOpacity>
    </View>
  </View>
}

const formatDate = (d:Date) => {
  return `${d.getDay()}/${d.getMonth()} - ${d.getHours()}:${d.getMinutes()}`
}


export function MeetingComponentLarge({meeting, onPressed, content, hobbies, langCode} : 
  {content:string, meeting:Meeting, onPressed:() => void, hobbies : HobbiesList, langCode:'ar'|'en'}) {
  const { width, height } = Dimensions.get('window')

  const  isArabic = (text:string) => {
    return /[\u0600-\u06FF]/.test(text);
  }

  return <View style={{
    margin: 15,
    width: width - 30,
    height : 'auto',
    backgroundColor:Colors.surface,
    shadowColor:Colors.primary,
    shadowOffset : {width:0,height:0},
    shadowRadius:5,
    shadowOpacity:.3,
    borderRadius:15,
  }}>
    <View style={{
      width:'100%',
      backgroundColor:Colors.secondary,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
    }}>
      <View style={{flex:1, margin:15, direction:isArabic(meeting.name) ? 'rtl' : 'ltr', alignItems:'flex-start'}}>
        <Text style={[Theme.textLarge, {color:Colors.surface, fontSize:17}]} ellipsizeMode="tail" numberOfLines={1}>
          {meeting.name}
        </Text>
        <View style={{flex:1}}></View>
        <Text style={[Theme.textMedium, {fontWeight:'600', color:Colors.surface}]}>
          {meeting.pname} - {meeting.city}
        </Text>
        <Text style={[Theme.textMedium, {fontWeight:'800', color:Colors.surface}]}>
          {meeting.cat.split('').map((e, i) => { return i == 0 ? e.toUpperCase() : e }).join('')}
        </Text>
      </View>
    </View>
    <View style={{
      padding: 10,
      flex:1
    }}>
      <View style={{marginBottom:10, flexDirection:'row', flexWrap:'wrap', gap:10}}>
        { meeting.hobbies.map((e, i) => {
          const hobby = hobbies?.find(x => x['en'] === e)
          if (!hobby) return <View key={i}></View>
          return <HTag content={hobby[langCode]} index={i} key={i} iconName={hobby.icon} />
        })} 
      </View>
      <View style={{flexDirection:'row', gap:10, alignItems:'center'}}>
        <Ionicons name="person" color={Colors.secondary} size={15} />
        <Text style={{fontFamily:'Cairo', fontWeight:'800'}}>
          {meeting.author_name}
        </Text>
      </View>
      <Text style={{fontFamily:'cairo', fontWeight:'700'}}>
        {new Date(meeting.time).toLocaleDateString()} - 
        {new Date(meeting.time).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
      </Text>
      <View style={{flexDirection:'row', gap:7, flex:1, alignItems:'center', marginBottom:10}}>
        {new Array(meeting.max).fill(null).map((_, i) => {
          const s = (width *.5 / 10.0)
          return <View key={i} style={{
            width:s,
            height:s,
            borderRadius:s * .15,
            backgroundColor:'green',
            opacity : (i < meeting.people.length+1 ? 1.0 : 0.35)
          }}>
          </View>
        })}
        <View style={{flex:1}} />
        <Text style={{fontFamily:'Cairo', fontWeight:'800'}}>
          {meeting.people.length + 1} / {meeting.max}
        </Text>
      </View>

      <TouchableOpacity style={{
        backgroundColor:Colors.secondary,
        flexDirection:'row',
        width:'100%',
        height:40,
        borderRadius:12,
        opacity:.85,
        alignItems:'center',
        justifyContent:'space-between',
        paddingHorizontal:10,
        direction:isArabic(content) ? 'rtl' : 'ltr'
      }} onPress={onPressed}>
        <Text style={[Theme.textMedium, {color:Colors.surface, fontWeight:'800', fontSize:15}]}>
          {content}
        </Text>
        <Ionicons name="information-circle-outline" size={24} color={Colors.surface} />
      </TouchableOpacity>
    </View>
  </View>
}