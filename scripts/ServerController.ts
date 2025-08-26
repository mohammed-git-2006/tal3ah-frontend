import AsyncStorage from "@react-native-async-storage/async-storage";


const SERVER_URL = `http://redcast.local:8080`

interface GoogleAuthResponse {
  status : boolean,
  name? : string,
  email? : string,
  jwtToken? : string,
  img? : string,
}

interface User {
  name : string,
  email : string,
  img : string,
}

interface FullUser extends User {
  hobbies : string[],
  joined : Date,
  meetingsJoined : number,
}

function userString(response : GoogleAuthResponse) : string {
  return JSON.stringify(<User>{
    ...response
  });
}

function userFromString(content : string) : User | undefined {
  try { return JSON.parse(content) } catch { return undefined }
}

async function sendGoogleToken(token : string) : Promise<GoogleAuthResponse> {
  try { 
    const response = await fetch(`${SERVER_URL}/auth/google`, {
      method:'POST',
      headers : {
        'Content-type' : 'application/json'
      },
      body : JSON.stringify({
        token : token
      }),
    })

    const jsonResponse : GoogleAuthResponse = await response.json()
    console.log(`Server response : ${JSON.stringify(jsonResponse)}`)

    return jsonResponse;
  } catch(err) {
    console.log(`Error : ${err}`)
    return {status: false};
  }
}

async function loadUserFromStorage() : Promise<{user:User, token:string} |'login'> {
  try {
    const jwtToken    = await AsyncStorage.getItem('key')
    const userString  = await AsyncStorage.getItem('user')

    if (jwtToken == null || userString == null) {
      alert(`Something is null! ${jwtToken} : ${userString}`)
      return 'login'
    }


    return {
      token : jwtToken,
      user : JSON.parse(userString)
    };
  } catch (err) {
    console.log(`Error : ${err}`)
    return 'login'
  }
}

async function getFullUser(email : string, token : string) : Promise<FullUser|'error'> {
  try {
    const response = await fetch(`${SERVER_URL}/user/${email}/info`, {
      method: "POST",
      headers : {
        'Content-type' : 'application/json',
        'Authorization' : `Bearer ${token}`
      },
    });


    const jsonResponse : {status:boolean} & FullUser = await response.json();
    // console.log(`Json Response : ${JSON.stringify(jsonResponse)}, args : [${email}, ${token}]`)
    if (!jsonResponse.status) return 'error'

    const {status, ...fullUser} = jsonResponse
    return fullUser
  } catch (err) {


    return 'error'
  }
}

type HobbiesList = [ {ar:string, en:string, icon:string} ]

class ServerUtils {
  static async  getHobbies () : Promise<HobbiesList|'error'> {
    try {
      const values = await fetch(`${SERVER_URL}/api/hobbies`);
      const result = await values.json()
      return result;
    } catch (err) {
      alert(`ERR : ${err}`)
      return 'error';
    }
  };

  static async updateHobbies(newHobbies : string[]) {
    try {
      const jwtToken = await AsyncStorage.getItem('key')
      await fetch(`${SERVER_URL}/user/update`, {
        method: 'POST',
        headers : {
          'Authorization' : `Bearer ${jwtToken}`,
          'Content-type' : 'application/json'
        },
        body: JSON.stringify({
          'hobbies' : newHobbies
        })
      })
    } finally {}
  }
}


export { FullUser, getFullUser, HobbiesList, loadUserFromStorage, sendGoogleToken, ServerUtils, User, userFromString, userString };

