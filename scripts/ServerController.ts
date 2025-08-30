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

async function getToken() : Promise<string|null> {
  return AsyncStorage.getItem('key');
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
type Place = {
  cat   : string,
  name  : string,
  latlng: string,
  rating: string,
  id : string,
}

interface Meeting {
  name          : string,
  city          : string,
  lat           : number,
  lng           : number,
  pname         : string,
  cat           : string,
  max           : number,
  pid           : string,
  time          : Date,
  people        : string[],
  hobbies       : string[],
  _id?          : string,
  author?       : string,
  author_name?  : string,
  code?         : string,
};

class ServerUtils {
  static async  getHobbies () : Promise<HobbiesList|'error'> {
    try {
      const currentVersion = Number.parseInt((await AsyncStorage.getItem('hv')) ?? '0')
      const serverVersion = Number.parseInt(await (await fetch(`${SERVER_URL}/hv`)).text());
      var result:HobbiesList|undefined = undefined; 

      if(serverVersion != currentVersion)
      {
        const values = await fetch(`${SERVER_URL}/api/hobbies`);
        result = await values.json()
        AsyncStorage.setItem('hv', serverVersion.toString())
        AsyncStorage.setItem('hobbies', JSON.stringify(result));
      } else
      {
        result = JSON.parse(await AsyncStorage.getItem('hobbies') ?? '');
      }

      return result!;
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

  static async getCities() : Promise<[{en:string, ar:string, lat:number, lng:number}]|"error"> {
    try {
      const values = await fetch(`${SERVER_URL}/api/cities`);
      const result = await values.json()
      return result;
    } catch (err) {
      alert(`ERR : ${err}`)
      return 'error';
    }
  }

  static async getPlaces(city:string) : Promise<Place[]|"error"> {
    try {
      const values = await fetch(`${SERVER_URL}/places/${city}`);
      const result = await values.json()
      if (!result.status) throw "Err"
      return result.data;
    } catch (err) {
      alert(`ERR : ${err}`)
      return 'error';
    }
  }

  static async createMeeting(request:any, token:string) : Promise<boolean> {
    
    try {
      const response = await fetch(`${SERVER_URL}/meetings/create`, {
        method: 'POST',
        headers : {
          'Authorization' : `Bearer ${token}`,
          'Content-type' : 'application/json'
        },

        body : JSON.stringify(request)
      });

      // alert(JSON.stringify(request))

      const { status } = await response.json();
      if (! status) throw "Error"; 
      return true;
    } catch (err)
    {
      alert(`Error : ${err}`)
      return false;
    }
  }

  static async getMeetings(token:string, type:"mine_live"|"engaged_live"|"mine_done"|"engaged_done") : Promise<Meeting[]> {
    const r = await fetch(`${SERVER_URL}/user/meetings`, {
      method:'POST',
      headers: {
        'Authorization' : `Bearer ${token}`,
        'Content-type' : 'application/json',
      },

      body : JSON.stringify({type : type})
    })

    const jR = await r.json();
    if (! jR.status) throw "Error";
    console.log(jR.data[0])
    return jR.data
  }

  static async getMeeting(token:string, id : string) : Promise<Meeting> {
    const r = await fetch(`${SERVER_URL}/meeting/${id}`, {
      method:'GET',
      headers: {
        'Authorization' : `Bearer ${token}`,
        'Content-type' : 'application/json',
      },
    })

    if (r.status != 200) {
      throw r.status;
    }

    return await r.json()
  }

  static async getUser(token:string, email:string) : Promise<User> {
    const r = await fetch(`${SERVER_URL}/user/${email}/info`, {
      method:'POST',
      headers: {
        'Authorization' : `Bearer ${token}`,
        'Content-type' : 'application/json',
      },
    });

    if (r.status != 200) throw "Error";

    const {status, ...user} = await r.json();

    if (status != true) throw "Error 2"
    return user as User
  }

  static async updateMeeting(id:string, token:string, max:number, name:string)  {
    return fetch(`${SERVER_URL}/meeting/update`, {
      method:'POST',
      headers : {
        'Authorization' : `Bearer ${token}`,
        'Content-type' : 'application/json'
      },

      body : JSON.stringify({
        name : name,
        max : max,
        id : id
      })
    });
  }

  static async deleteMeeting(id:string, token:string) : Promise<boolean> {
    try {
      const r = await fetch(`${SERVER_URL}/meeting/delete`, {
        method:'POST',
        headers : {
          'Authorization' : `Bearer ${token}`,
          'Content-type' : 'application/json'
        },

        body : JSON.stringify({
          id : id
        })
      })

      if(r.status != 200) return false;
      return true;
    } catch (err) {
      return false;
    }
  }

  static setCity(city:string) {
    AsyncStorage.setItem("city", city)
  }

  static async getCity()  {
    return await AsyncStorage.getItem("city")
  }

  static async leaveMeeting(token:string, id:string) {
    try {
      const r = await fetch(`${SERVER_URL}/meeting/leave`, {
        method:'POST',
        headers : {
          'Authorization' : `Bearer ${token}`,
          'Content-type' : 'application/json'
        },

        body : JSON.stringify({
          id : id
        })
      })

      if (r.status != 200) throw "Server side error"
    } catch(err) {
      alert(`Failed to leave the meeting`)
    }
  }

  static async joinMeeting(token:string, id:string) : Promise<boolean>
  {
    try {
      const r = await fetch(`${SERVER_URL}/meeting/join`, {
        method:'POST',
        headers : {
          'Authorization' : `Bearer ${token}`,
          'Content-type' : 'application/json'
        },

        body : JSON.stringify({
          id : id
        })
      })

      if (r.status != 200) throw "Not OK"
      return true;
    } catch (err) {
      return false;
    }
  }
}


export {
  FullUser, getFullUser, getToken, HobbiesList, loadUserFromStorage, Meeting, Place,
  sendGoogleToken, SERVER_URL, ServerUtils, User, userFromString, userString
};

