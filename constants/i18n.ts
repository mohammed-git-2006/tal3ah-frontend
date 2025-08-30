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
      welcome : 'Welcome ',
      next : 'next',
      previous : 'previous',
      done : 'done',
      enter_name : 'Enter the meeting name',
      name_place : 'Enter the place\'s name',
      confirm : 'Confirm',
      rus : 'Are you sure you want to submit this meeting ?',
      accept : 'Accept',
      decline : 'Decline',
      uploading : 'Creating the meeting for you ...',
      conn_err : 'Conection error was triggered',
      retry : 'Retry',
      enter_mp : 'Number of people: ',
      more_info : 'More info',
      join : 'Join meeting',
      meeting_full:'The meeting is full',
      edit_m : 'Edit meeting',
      edit_name : 'Meeting name : ',
      edit_max : 'Max people : ',
      mts_live : "Live meetings you created : ",
      mts_done : "Previous meetings you created : ",
      mts_e_live : "Live meetings you engaged in",
      mts_e_done : "Done meetings you engaged in",
      choose_date : "Choose Date",
      city : 'City',
      hobbies : 'Hobbies',
      all_cities : 'All cities',
      leave : 'Leave meeting',
      rusleave : 'Are you sure you want to leave the meeting?',
      next_page : 'Next page',
      prev_page : 'Previous page',
      page : 'Page'
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
      welcome : 'مرحبا',
      next : 'التالي',
      previous : 'السابق',
      done : 'إنهاء',
      enter_name : 'أدخل اسم اللقاء',
      name_place : 'ما اسم المكان؟',
      confirm : 'تأكيد',
      rus : 'هل أنت متأكد من بيانات اللقاء؟',
      accept : 'موافق',
      decline : 'إلغاء',
      uploading : 'جار إنشاء اللّقائ ...',
      conn_err : 'حدثت مشكلة أثناء محاولة الإتصال',
      retry : 'إعادة المحاولة',
      enter_mp : 'عدد الأشخاص : ',
      more_info : 'عرض المزيد',
      join : 'أنضمام',
      meeting_full : 'ممتلئ',
      edit_m : 'تعديل اللقاء',
      edit_name : 'اسم اللقاء : ',
      edit_max : 'عدد الأشخاص : ',
      mts_live : 'لقائات انشأتهـا فعّالة : ',
      mts_done : 'لقائات انشأتهـا سابقا : ',
      mts_e_live : 'لقائات شاركت بها فعّالة : ',
      mts_e_done : 'لقائات شاركت بها سابقا : ',
      choose_date : "حدد التاريخ",
      city : 'المدينة',
      hobbies : 'الهوايات',
      all_cities : 'كل المدن',
      leave : 'غادر',
      rusleave : 'هل تريد مغادرة اللّقاء؟',
      next_page : 'الصفحة التالية',
      prev_page : 'الصفحة السابقة',
      page : 'الصفحة'

    },
  },
};

i18n.use(initReactI18next).init({
  resources,
})


export default i18n