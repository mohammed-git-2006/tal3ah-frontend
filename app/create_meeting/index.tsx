import i18n from "@/constants/i18n";
import { Colors, Theme } from "@/constants/Theme";
import * as Localization from 'expo-localization';
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CreateMeeting() {
  const padding = useSafeAreaInsets();
  const { t } = useTranslation();

  const locales = Localization.getLocales();
  const [langCode, setLangCode] = useState<'en'|'ar'>()
  const [dirMode, setDirMode] = useState<'ltr'|'rtl'>()
  const [loading, setLoading] = useState(true);
  const [connectionErr, setConnectionErr] = useState();

  useEffect(() => {
    setLangCode(locales[0].languageCode == 'en' ? 'en' : 'ar');
    setDirMode(langCode == 'ar' ? 'rtl' : 'ltr');
    i18n.changeLanguage(langCode)
  }, [])

  return <> 
  <View style={{flex:1}}>
    <View style={{
      padding : 10,
      paddingTop: padding.top,
      backgroundColor:Colors.secondary,
    }}>
      <Text style={[Theme.textMedium, {fontWeight:'800', color:Colors.surface}]}> {t('create_meeting')} </Text>
    </View>

    
  </View>
  </>
}