import { Colors } from '@/constants/Theme';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface RootPosition 
{
  x : number,
  y : number,
  width : number,
  height : number,
}

interface DropdownButtonProps
{
  text : string,
  content : string[],
  icon? : any,
  textColor? : string,
  backgroundColor? : string,
  iconColor? : string,
  onSelected : (val:string) => void,
  width? : number,
  flex? : boolean,
  scrollable? : boolean,
  value? : string,
}

function DropdownButton({value, iconColor, scrollable, flex, width, text, content, 
    onSelected, icon, backgroundColor, textColor} : DropdownButtonProps) {
  const [showing, setShowing] = useState(false);
  const [position, setPosition] = useState<RootPosition>({x:0, y:0, width:0, height:0})
  // const [choice, setChoice] = useState<string>()
  const bgC = backgroundColor ? backgroundColor : Colors.onSurface;
  const tC  = textColor ?? Colors.primary
  const icC = iconColor ?? tC

  const s = StyleSheet.create({
    container : {
      backgroundColor: bgC,
      padding : 10,
      borderRadius:5,
      width:width ?? 'auto',
      flexDirection:'row',
      gap:8,
      alignItems:'center',
      shadowColor:bgC,
      shadowOffset:{width:0, height:0},
      shadowOpacity:0.75,
      shadowRadius:3,
      flex : flex?1:undefined
    }
  })

  const anchorRef = useRef<View>(null)

  useEffect(() => {
    if(showing) return;
    anchorRef.current?.measureInWindow((x, y, width, height) => {
      setPosition({width:width, height:height, x:x, y:y})
    })
  }, [showing])

  const IterableComponents = () => {
    return content.map(e => {
      return <TouchableOpacity style={{padding:5, width:'100%', paddingHorizontal:15, alignItems:'center'}} key={e} onPress={() => { setShowing(false); onSelected(e) }}>
        <Text style={{fontFamily:'Cairo', fontWeight:'700', fontSize:16, color : tC}}>{e}</Text>
      </TouchableOpacity>
    })
  }

  return <>
    <View ref={anchorRef} style={{flex:flex?1:undefined}}>
      <TouchableOpacity style={[s.container, {justifyContent:'space-between'}]} onPress={() => {setShowing(!showing)}}>
        <Ionicons name={showing ? "chevron-up" : "chevron-down"} style={{flex:1}} color={tC} size={16} />
        {icon ? <Ionicons name={icon} size={18} color={icC}/> : <></>}
        <Text style={{fontFamily:'Cairo', fontWeight:'800', fontSize:14, color:tC}}>{value ?? text}</Text>
      </TouchableOpacity>
    </View>
    <Modal visible={showing} transparent animationType='fade' onRequestClose={() => { setShowing(false) }}>
      <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.0)" }}
          onPress={() => setShowing(false)}
        />
      <View style={[s.container, {
        position:'absolute',
        top : position.y + position.height + 10,
        left : position.x,
        pointerEvents:'box-none',
        flexDirection:'column',
        // width: width,
        width:'auto',
        height:scrollable?325:'auto',
        padding:0,
        shadowColor:backgroundColor,
        shadowOffset:{width:0,height:0},
        shadowRadius:3,
        shadowOpacity:1.0
      }]}>
        {scrollable ? <ScrollView horizontal={false} style={{width:width}}>
          <IterableComponents />
        </ScrollView> : <IterableComponents />}
      </View>
    </Modal>
  </>
}

interface DropdownCheckboxProps
{
  text : string,
  content : {label:string, value:boolean}[],
  icon? : any,
  textColor? : string,
  backgroundColor? : string,
  iconColor? : string,
  width? : number,
  showing : boolean,
  onClose : () => void,
  onRequestShowing : () => void,
  onSelected : (name:string, val:boolean) => void,
}

function DropdownCheckbox({...props} : DropdownCheckboxProps) {
  const [position, setPosition] = useState<RootPosition>({x:0, y:0, width:0, height:0})
  const bgC = props.backgroundColor ? props.backgroundColor : Colors.onSurface;
  const tC  = props.textColor ?? Colors.primary
  const icC = props.iconColor ?? tC
  const { showing, onClose } = props

  useEffect(() => {
    
  }, [])

  const s = StyleSheet.create({
    container : {
      backgroundColor: bgC,
      padding : 10,
      borderRadius:5,
      width:props.width ?? 'auto',
      flexDirection:'row',
      gap:8,
      alignItems:'center',
      shadowColor:bgC,
      shadowOffset:{width:0, height:0},
      shadowOpacity:0.75,
      shadowRadius:3
    }
  })

  const anchorRef = useRef<View>(null)

  useEffect(() => {
    if(!showing) return;
    anchorRef.current?.measureInWindow((x, y, width, height) => {
      setPosition({width:width, height:height, x:x, y:y})
    })
  }, [showing])


  return <>
    <View ref={anchorRef}>
      <TouchableOpacity style={[s.container, {justifyContent:'space-between'}]} onPress={() => {(showing ? onClose : props.onRequestShowing)()}}>
        {props.icon ? <Ionicons name={props.icon} size={18} color={icC}/> : <></>}
        <Text style={{fontFamily:'Cairo', fontWeight:'800', fontSize:16, color:tC}}>{props.text}</Text>
        <Ionicons name={showing ? "chevron-up" : "chevron-down"} color={tC} size={16} />
        <Text>{showing ? 'S' : 'N'}</Text>
      </TouchableOpacity>
    </View>
    <Modal
      visible={showing}
      transparent
      animationType="fade"
      onRequestClose={() => onClose()}
    >
      <Pressable
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.0)" }}
        onPress={() => onClose()}
      />

      <View
        // pointerEvents="box-only"           // 👈 only handle touches on uncovered areas
        style={[
          s.container,
          {
            position: "absolute",
            top: position.y + position.height + 10,
            left: position.x,
            flexDirection: "column",
            width: props.width,
            zIndex: 2,
            elevation: 10,
            margin:0,
            padding:0,
            maxHeight: 300,
          },
        ]}
      >
        <ScrollView style={{width:'100%', padding:10}}>
          {props.content.map((e) => {
            return (
              <TouchableOpacity
                key={e.label}
                style={{ flexDirection: "row", width: "100%" }}
              >
                <Text
                  style={{
                    fontFamily: "Cairo",
                    fontWeight: "700",
                    fontSize: 17,
                    color: tC,
                  }}
                >
                  {e.label}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    props.onSelected(e.label, !e.value)
                  }}
                  style={{ flex: 1, alignItems: "flex-end" }}
                >
                  <Ionicons
                    name={e.value ? "checkbox" : "checkbox-outline"}
                    color={tC}
                    size={24}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  </>
}


export { DropdownButton, DropdownCheckbox };

