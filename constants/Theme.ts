import { StyleSheet } from "react-native";


export const Colors = {
  surface : '#ffffffff',      // creamy white background
  onSurface : '#d7d7d7',    // dark text on light background
  primary : '#000000',      // black primary text
  secondary : '#673AB7',    // accent (deep red stays the same)
  secondaryShade : '#cebfebff',    // accent (deep red stays the same)
  inputSurface : '#F3F3F3', // light gray for inputs
  primaryShade : '#6B6B6B', // medium gray for secondary text
}


export const Theme = StyleSheet.create({
  body : {
    flex:1,
    backgroundColor:Colors.surface,
  },

  text_ : {
    fontFamily:'Cairo',
    fontWeight:'500',
    color: Colors.primary
  },  

  textSmall : {
    fontSize:12,
    fontFamily:'Cairo',
    fontWeight:'500',
    color: Colors.primary,
  },

  textMedium : {
    fontFamily:'Cairo',
    fontWeight:'500',
    color: Colors.primary,
    fontSize:15,
  },

  textLarge : {
    fontFamily:'Cairo',
    fontWeight:'800',
    color: Colors.primary,
    fontSize:18,
  },

  genericShadow : {
    shadowColor:Colors.onSurface,
    shadowRadius:5,
    shadowOpacity:1
  }
})
