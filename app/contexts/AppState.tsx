import { create } from 'zustand';

type AppState = {
  crMeet : boolean,
  meetChange : boolean,
  setCrMeet : (v:boolean) => void,
  setMeetChange : (v:boolean) => void;
}


export const useAppState = create<AppState>((set) => {
  return {
    crMeet : false,
    setCrMeet : (v) => set({crMeet : v}),
    meetChange : false,
    setMeetChange : (v) => set({meetChange : v})
  };
})