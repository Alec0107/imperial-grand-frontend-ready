import { userDashboard } from "../SPAJS/HtmlPages.js";

const LOCALHOST_BASE_URL = "http://localhost:8080";
//const LOCALHOST_BASE_URL2 = "https://imperialgrand-backend-ready-production.up.railway.app"
const LOCALHOST_BASE_URL2 = "http://127.0.0.1:8080"
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
        fetchAllProduct: `${LOCALHOST_BASE_URL2}/api/menu/categories/fetch_category`//in-use
    },
    setmenus: {
        fetchAll: `${LOCALHOST_BASE_URL2}/api/menu/set-menu/fetch_set_menu`//in-use
    },
    menuItems: { 
        fetchMenuItems: `${LOCALHOST_BASE_URL2}/api/menu/items`, //in-use
        fetchMenuById: `${LOCALHOST_BASE_URL2}/api/menu/fetch-item`
    }


}

export const NewAPI = {
    auth: {
        signup: `${LOCALHOST_BASE_URL2}/api/auth/signup`,
        verify: `${LOCALHOST_BASE_URL2}/api/auth/verify`,
        resend_otp: `${LOCALHOST_BASE_URL2}/api/auth/resend-otp`,
        login: `${LOCALHOST_BASE_URL}/api/auth/login`,
        me: `${LOCALHOST_BASE_URL}/api/auth/me`,
        refresh: `${LOCALHOST_BASE_URL}/api/auth/refresh-token`
    },
    reservations: {
        searchRequest: `${LOCALHOST_BASE_URL}/api/reservation/availability`,
        status: `${LOCALHOST_BASE_URL}/api/reservation/status`,
        submitSecondStep: `${LOCALHOST_BASE_URL}/api/reservation/submit`,
        submitAsGuest: `${LOCALHOST_BASE_URL}/api/reservation/guest/submit`
    },
    userDashboard: {
        upcomingReservations: `${LOCALHOST_BASE_URL}/api/user/dashboard/reservation/upcoming`,
        pastReservations: `${LOCALHOST_BASE_URL}/api/user/dashboard/reservation/past`,
        cancelReservation: `${LOCALHOST_BASE_URL}/api/user/dashboard/reservation/cancel`,
        viewDetails: `${LOCALHOST_BASE_URL}/api/user/dashboard/reservation/view-details`,
        account: `${LOCALHOST_BASE_URL}/api/auth/user/dashboard/account`,
        accountSetBirthday: `${LOCALHOST_BASE_URL}/api/auth/user/dashboard/account/birthday`
    },

    admin:{
        login: `${LOCALHOST_BASE_URL}/api/auth/admin/login`,
        fetchCustomers: `${LOCALHOST_BASE_URL}/api/auth/admin/customers`,

        fetchReservations: `${LOCALHOST_BASE_URL}/api/auth/admin/reservations`,
        fetchReservationById: `${LOCALHOST_BASE_URL}/api/auth/admin/reservations`,  // same base, will append /{id}
        cancelReservation: `${LOCALHOST_BASE_URL}/api/auth/admin/reservations/cancel`, // or whatever your endpoint is

        menu: {
            menuItems: `${LOCALHOST_BASE_URL}/api/auth/admin/menu-items`,
            categories: `${LOCALHOST_BASE_URL}/api/auth/admin/menu-categories`,
            subcategoriesByCat: `${LOCALHOST_BASE_URL}/api/auth/admin/menu-subcategories`,
            updateMenuItem: `${LOCALHOST_BASE_URL}/api/auth/admin/menu-item-update`,
            createMenuItem: `${LOCALHOST_BASE_URL}/api/auth/admin/menu-item-create`
        },
        catsub: {
            // categories CRUD
            categories: `${LOCALHOST_BASE_URL}/api/admin/dashboard/menu-categories`,
            // subcategories grouped by category (uses ?categoryId=)
            subcategoriesByCat: `${LOCALHOST_BASE_URL}/api/admin/dashboard/menu-subcategories`
         },
         setMenus: `${LOCALHOST_BASE_URL}/api/admin/dashboard/set-menus`
    }
}


export function getDeviceIdFromCookie(){
    const prefix = `device-id=`
    const cookies = document.cookie.split(";");

    for(let cookie of cookies){
        cookie = cookie.trim();
        if(cookie.startsWith(prefix)){
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