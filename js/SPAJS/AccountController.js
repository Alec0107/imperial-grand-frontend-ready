import { getDeviceIdFromCookie, NewAPI,} from "../APIurl/api.js";
import { throwError } from "./AuthController.js";


export async function fetchMyAccount(){
    const url = NewAPI.userDashboard.account;

    const object = {
      method: 'GET',
      credentials: 'include'
    }


    const response = await fetch(url, object);
    const result = await response.json();
    console.log(response);
    console.log(result);

    throwError(response, result);

    return result.data;
}

export async function updateBirthday(birthday){
    const url = NewAPI.userDashboard.accountSetBirthday;

    const object = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ birthday })
    }

    const response = await fetch(url, object);
    const result = await response.json();
    console.log(response);
    console.log(result);

    throwError(response, result);

    return result.data;
}