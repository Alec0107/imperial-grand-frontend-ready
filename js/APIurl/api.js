const LOCALHOST_BASE_URL = "http://localhost:8080";
const LOCALHOST_BASE_URL2 = "https://imperialgrand-backend-ready-production.up.railway.app"
// const LOCALHOST_BASE_URL2 = "http://127.0.0.1:8080"
export const API = {
    authentication: {
        login: `${LOCALHOST_BASE_URL}/api/v1/auth/login`,
        register: `${LOCALHOST_BASE_URL}/api/v1/auth/register`,
        resendVerificationEmail: (email) => { return`${LOCALHOST_BASE_URL}/api/v1/auth/resend-verification?email=${email}`},
        resendVerificationToken: (tokenId) => {return`${LOCALHOST_BASE_URL}/api/v1/auth/inbox-resend-verification?tokenId=${tokenId}`},
        forgotPassword: `${LOCALHOST_BASE_URL}/api/v1/auth/forgot-password`,
        resetPassword: `${LOCALHOST_BASE_URL}/api/v1/auth/reset-password`,
        validateResetToken: (token, tokenId) => { return `${LOCALHOST_BASE_URL}/api/v1/auth/reset-password/validate?token=${token}&tokenId=${tokenId}`},
        refreshToken: `${LOCALHOST_BASE_URL}/api/v1/auth/refresh-token`
    },
    reservations: {
        checkAvailability: `${LOCALHOST_BASE_URL}/api/v1/reservation/availability`,
        checkLockStatus: `${LOCALHOST_BASE_URL}/api/v1/reservation/lock_status`,
        submitReservation: `${LOCALHOST_BASE_URL}/api/v1/reservation/submit`
        /**
         *  TODO: 
         **/
    }, 
    contactUs: {
        sendMsg: `${LOCALHOST_BASE_URL}/api/v1/contact`
    },
    user: {
        profile: `${LOCALHOST_BASE_URL}/api/v1/auth/profile`
        /**
         *  TODO: 
         **/
    },
    categories:{
        fetchAllProduct: `${LOCALHOST_BASE_URL2}/api/menu/categories/fetch_category`
    },
    setmenus: {
         fetchAll: `${LOCALHOST_BASE_URL2}/api/menu/set-menu/fetch_set_menu`
    },
    menuItems: { 
        fetchMenuItems: `${LOCALHOST_BASE_URL2}/api/menu/items`,
        fetchMenuById: `${LOCALHOST_BASE_URL2}/api/menu/fetch-item`
    }


}

export function getDeviceIdFromCookie(){
    const prefix = `device-id=`
    const cookies = document.cookie.split(";");

    for(let cookie of cookies){
        cookie = cookie.trim();
        if(cookie.startsWith(prefix)){
            console.log("hi")
            console.log(cookie.substring(prefix.length));
            return cookie.substring(prefix.length);
        }
    }
    return null;
}


export async function authApi(url, options = {}) {
    const defaultOptions = {
        credentials: "include",
        ...options
    };

    console.log("Executing original request...");
    console.log(defaultOptions);
    let response = await fetch (url, defaultOptions);

    if(!response.ok && response.status === 401){
        console.log("Executing refresh request...");
        const refreshResponse = await fetch(API.authentication.refreshToken,{
            method: "POST",
            credentials: "include",
            headers: {
                "Content-type" : "application/json",
                "x-device-id" : getDeviceIdFromCookie()
            }
        });
 
        if(refreshResponse.ok){
               console.log("✅ Refresh succeeded. Waiting for cookie sync...");
    
                // 🛠️ Let the browser apply the new cookie (AT + RT)
                await new Promise((res) => setTimeout(res, 2000));

                console.log("🔁 Retrying original request...");
                response = await fetch(url, defaultOptions);
        }else{
            console.log("login redirect");
           // window.location.replace("../../pages/authentication/auth.html?authType=login");
        }
    }

    return response;
}