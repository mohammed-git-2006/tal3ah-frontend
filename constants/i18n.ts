import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';


const resources = {
  en : {
    translation : {
      login_signup : 'Login / Sign up',
      ls_google : 'Continue using Google',
      ls_message : 'Tal3ah connects people in your city through shared hobbies. Discover local events, join gatherings, and meet new friends with similar interests',
      ls_error: 'Failed to login',
      edit_hobbies : 'Edit Hobbies',
      create_meeting : 'Create meeting',
      welcome : 'Welcome '
    },
  },

  ar : {
    translation : {
      login_signup : 'تسجيل الدّخول / إنشاء حساب',
      ls_google : 'المتابعة مع غوغل',
      ls_message : 'تطبيـق طلعة يربطك بأشخاص في مدينتك من خلال هوايات مشتركة. اكتشف الفعاليات المحلية، وانضم إلى التجمعات، وتعرّف على أصدقاء جدد يشاركونك الاهتمامات',
      ls_error : 'فشلت عملية تسجيل الدخول',
      edit_hobbies : 'تعديل الهوايات',
      create_meeting : 'أنشئ لقاء',
      welcome : 'مرحبا'
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  // fallbackLng : 'en',
  // interpolate : false,
})


export default i18n