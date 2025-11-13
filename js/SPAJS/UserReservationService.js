import { fetchUpcomingApi, cancelReservation, viewDetailsReservation, fetchPastApi} from "./ReservationController.js";

let type = "Upcoming"
let page = 0;
let isUpcoming = true;

export async function fetchUserPastReservations(page = 0){
    try{
        const result = await fetchPastApi(page);
        type = "Past"
        console.log(result);
        populateUpcomingCards(result.data);
        document.querySelectorAll(".cancel-buttons").forEach((button)=>{
            button.style.display = 'none'
        });
        initViewDetailsButtons(result.data);
    }catch(err){
        console.log(err);
    }
}

export async function fetchUserUpcomingReservations(page = 0){

    try{
        const result = await fetchUpcomingApi(page);
        type = "Upcoming"
        console.log(result);
        populateUpcomingCards(result.data);
        initCancelButtons(result.data);
        initViewDetailsButtons(result.data);
    }catch(err){
        console.log(err);
    }

}

function populateUpcomingCards(reservations){

    // 2. Select container
    const container = document.querySelector(".reservation-container");
    container.innerHTML = ""; // Clear first

    // 3. Loop over backend data → generate HTML for each
    reservations.forEach(res =>{
        container.innerHTML += 
        `<div class="reservation-card">  

                <div class="title row">
                    <svg class="svg-calendar" fill="#dbd15c" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64px" height="64px" viewBox="0 0 612 612" xml:space="preserve" stroke="#dbd15c"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M612,463.781c0-70.342-49.018-129.199-114.75-144.379c-10.763-2.482-21.951-3.84-33.469-3.84 c-3.218,0-6.397,0.139-9.562,0.34c-71.829,4.58-129.725,60.291-137.69,131.145c-0.617,5.494-0.966,11.073-0.966,16.734 c0,10.662,1.152,21.052,3.289,31.078C333.139,561.792,392.584,612,463.781,612C545.641,612,612,545.641,612,463.781z M463.781,561.797c-54.133,0-98.016-43.883-98.016-98.016s43.883-98.016,98.016-98.016s98.016,43.883,98.016,98.016 S517.914,561.797,463.781,561.797z"></path> <polygon points="482.906,396.844 449.438,396.844 449.438,449.438 396.844,449.438 396.844,482.906 482.906,482.906 482.906,449.438 482.906,449.438 "></polygon> <path d="M109.969,0c-9.228,0-16.734,7.507-16.734,16.734v38.25v40.641c0,9.228,7.506,16.734,16.734,16.734h14.344 c9.228,0,16.734-7.507,16.734-16.734V54.984v-38.25C141.047,7.507,133.541,0,124.312,0H109.969z"></path> <path d="M372.938,0c-9.228,0-16.734,7.507-16.734,16.734v38.25v40.641c0,9.228,7.507,16.734,16.734,16.734h14.344 c9.228,0,16.734-7.507,16.734-16.734V54.984v-38.25C404.016,7.507,396.509,0,387.281,0H372.938z"></path> <path d="M38.25,494.859h236.672c-2.333-11.6-3.572-23.586-3.572-35.859c0-4.021,0.177-7.999,0.435-11.953H71.719 c-15.845,0-28.688-12.843-28.688-28.688v-229.5h411.188v88.707c3.165-0.163,6.354-0.253,9.562-0.253 c11.437,0,22.61,1.109,33.469,3.141V93.234c0-21.124-17.126-38.25-38.25-38.25h-31.078v40.641c0,22.41-18.23,40.641-40.641,40.641 h-14.344c-22.41,0-40.641-18.231-40.641-40.641V54.984H164.953v40.641c0,22.41-18.231,40.641-40.641,40.641h-14.344 c-22.41,0-40.641-18.231-40.641-40.641V54.984H38.25C17.126,54.984,0,72.111,0,93.234v363.375 C0,477.733,17.126,494.859,38.25,494.859z"></path> <circle cx="134.774" cy="260.578" r="37.954"></circle> <circle cx="248.625" cy="260.578" r="37.954"></circle> <circle cx="362.477" cy="260.578" r="37.954"></circle> <circle cx="248.625" cy="375.328" r="37.953"></circle> <circle cx="134.774" cy="375.328" r="37.953"></circle> </g> </g> </g></svg>
                    <h2>Reservation</h2>
                    <p>${type}</p>
                </div>

                <div class="partition"></div>

                <div class="row">
                    <svg  class="mini-svg"  viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M7 1.75C7.41421 1.75 7.75 2.08579 7.75 2.5V3.26272C8.41203 3.24999 9.1414 3.24999 9.94358 3.25H14.0564C14.8586 3.24999 15.588 3.24999 16.25 3.26272V2.5C16.25 2.08579 16.5858 1.75 17 1.75C17.4142 1.75 17.75 2.08579 17.75 2.5V3.32709C18.0099 3.34691 18.2561 3.37182 18.489 3.40313C19.6614 3.56076 20.6104 3.89288 21.3588 4.64124C22.1071 5.38961 22.4392 6.33855 22.5969 7.51098C22.6472 7.88567 22.681 8.29459 22.7037 8.74007C22.7337 8.82106 22.75 8.90861 22.75 9C22.75 9.06932 22.7406 9.13644 22.723 9.20016C22.75 10.0021 22.75 10.9128 22.75 11.9436V14.0564C22.75 15.8942 22.75 17.3498 22.5969 18.489C22.4392 19.6614 22.1071 20.6104 21.3588 21.3588C20.6104 22.1071 19.6614 22.4392 18.489 22.5969C17.3498 22.75 15.8942 22.75 14.0564 22.75H9.94359C8.10583 22.75 6.65019 22.75 5.51098 22.5969C4.33856 22.4392 3.38961 22.1071 2.64124 21.3588C1.89288 20.6104 1.56076 19.6614 1.40314 18.489C1.24997 17.3498 1.24998 15.8942 1.25 14.0564V11.9436C1.24999 10.9127 1.24998 10.0021 1.27701 9.20017C1.25941 9.13645 1.25 9.06932 1.25 9C1.25 8.90862 1.26634 8.82105 1.29627 8.74006C1.31895 8.29458 1.35276 7.88566 1.40314 7.51098C1.56076 6.33856 1.89288 5.38961 2.64124 4.64124C3.38961 3.89288 4.33856 3.56076 5.51098 3.40313C5.7439 3.37182 5.99006 3.34691 6.25 3.32709V2.5C6.25 2.08579 6.58579 1.75 7 1.75ZM2.76309 9.75C2.75032 10.4027 2.75 11.146 2.75 12V14C2.75 15.9068 2.75159 17.2615 2.88976 18.2892C3.02502 19.2952 3.27869 19.8749 3.7019 20.2981C4.12511 20.7213 4.70476 20.975 5.71085 21.1102C6.73851 21.2484 8.09318 21.25 10 21.25H14C15.9068 21.25 17.2615 21.2484 18.2892 21.1102C19.2952 20.975 19.8749 20.7213 20.2981 20.2981C20.7213 19.8749 20.975 19.2952 21.1102 18.2892C21.2484 17.2615 21.25 15.9068 21.25 14V12C21.25 11.146 21.2497 10.4027 21.2369 9.75H2.76309ZM21.1683 8.25H2.83168C2.8477 8.06061 2.86685 7.88123 2.88976 7.71085C3.02502 6.70476 3.27869 6.12511 3.7019 5.7019C4.12511 5.27869 4.70476 5.02502 5.71085 4.88976C6.73851 4.75159 8.09318 4.75 10 4.75H14C15.9068 4.75 17.2615 4.75159 18.2892 4.88976C19.2952 5.02502 19.8749 5.27869 20.2981 5.7019C20.7213 6.12511 20.975 6.70476 21.1102 7.71085C21.1331 7.88123 21.1523 8.06061 21.1683 8.25Z" fill="#808080"></path> </g></svg>
                    <h3>${formatLongDate(res.date, res.time)}</h3>
                </div>

                <div class="row">
                    <svg class="mini-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 7V12H15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#808080" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                    <h3>${format12hTime(res.date, res.time)}</h3>
                </div>

                <div class="row">
                    <svg class="mini-svg" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#808080"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>profile [#808080]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-380.000000, -2159.000000)" fill="#808080"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M334,2011 C337.785,2011 340.958,2013.214 341.784,2017 L326.216,2017 C327.042,2013.214 330.215,2011 334,2011 M330,2005 C330,2002.794 331.794,2001 334,2001 C336.206,2001 338,2002.794 338,2005 C338,2007.206 336.206,2009 334,2009 C331.794,2009 330,2007.206 330,2005 M337.758,2009.673 C339.124,2008.574 340,2006.89 340,2005 C340,2001.686 337.314,1999 334,1999 C330.686,1999 328,2001.686 328,2005 C328,2006.89 328.876,2008.574 330.242,2009.673 C326.583,2011.048 324,2014.445 324,2019 L344,2019 C344,2014.445 341.417,2011.048 337.758,2009.673" id="profile-[#808080]"> </path> </g> </g> </g> </g></svg>
                    <h3>${res.guestCount} Guests</h3>
                </div>

                <div class="row">
                    <svg class="mini-svg" viewBox="0 0 24 24" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><defs><style>.cls-1{fill:none;stroke:#808080;stroke-miterlimit:10;stroke-width:1.92px;}</style></defs><rect class="cls-1" x="3.38" y="4.35" width="17.25" height="3.83"></rect><line class="cls-1" x1="23.5" y1="4.35" x2="0.5" y2="4.35"></line><line class="cls-1" x1="3.38" y1="20.65" x2="3.38" y2="8.19"></line><line class="cls-1" x1="20.63" y1="20.65" x2="20.63" y2="8.19"></line></g></svg>
                    <h3>Table ${res.tableCode} - ${res.zone} Seat</h3>
                </div>

                <div class="partition"></div>


                <div class="row">
                    <button id="cancel" class="cancel-buttons">Cancel</button>
                    <button id="view-details" class="viewDetails-buttons">View Details</button>
                </div>

            </div>
            `
    })


}

// helpers (keep near your file top)
const formatLongDate = (dateStr, timeStr) => {
  // assumes backend gives "YYYY-MM-DD" and "HH:mm" (24h, local)
  const dt = new Date(`${dateStr}T${timeStr}`);
  return dt.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

const format12hTime = (dateStr, timeStr) => {
  const dt = new Date(`${dateStr}T${timeStr}`);
  return dt.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};




function initCancelButtons(reservations){
    const buttons = document.querySelectorAll(".cancel-buttons");
    const cancelModal = document.querySelector(".cancel-modal");
    const backDrop = document.querySelector(".cancel-backdrop");
    const closeModal = document.getElementById("close-modal");

    buttons.forEach((btn, index) => {
        btn.addEventListener("click", async () => {

            cancelModal.classList.remove("hidden");
            backDrop.classList.remove("hidden");

            document.getElementById("confirm-cancel").addEventListener("click", async ()=>{
                  
                console.log("index" + index);
                const id = reservations[index].reservationId;
                try{
                    const result = await cancelReservation(id);
                    console.log(result)
                }catch(err){
                    console.log(err);
                }
               
            });
        });
    });


    closeModal.addEventListener("click", ()=>{
        cancelModal.classList.add("hidden");
        backDrop.classList.add("hidden");
    });


}

function initViewDetailsButtons(reservations){
    const buttons = document.querySelectorAll(".viewDetails-buttons");

    buttons.forEach((btn, index) => {
            btn.addEventListener("click", async () => {

                console.log(reservations[index]);
                const result = await viewDetailsReservation(reservations[index].reservationId);
                console.log(result)
                openDetailsModal(result);
               
            });
        });


}


function openDetailsModal(data) {
  document.getElementById("detailDate").innerText = formatLongDate(data.date, data.time);
  document.getElementById("detailTime").innerText = format12hTime(data.time, data.date);
  document.getElementById("detailGuests").innerText = data.guests + " Guests";
  document.getElementById("detailTable").innerText = data.tableCode + " - " + data.tableZone;
  document.getElementById("detailNotes").innerText = data.specialRequests || "None";

  // Occasions
  const occBox = document.getElementById("detailOccasions");
  occBox.innerHTML = "";
  data.occasions.forEach(o => {
    occBox.innerHTML += `<span class="tag">${o}</span>`;
  });

  // Dietary
  const dietBox = document.getElementById("detailDietary");
  dietBox.innerHTML = "";
  data.dietaryRestrictions.forEach(d => {
    dietBox.innerHTML += `<span class="tag">${d}</span>`;
  });

  document.getElementById("detailsModal").classList.remove("hidden");

  document.getElementById("closeDetailsBtn").addEventListener("click", () => {
     document.getElementById("detailsModal").classList.add("hidden");
  });

}




export function initUpcomingAndPastBtn(){
    const upcoming = document.getElementById("upcoming-res");
    const past = document.getElementById("past-res");


    upcoming.addEventListener("click", ()=>{
        console.log("upcoming")
        console.log(page)
        page = 0;
        isUpcoming = true;
        past.classList.remove("active");
        upcoming.classList.add("active");
        fetchUserUpcomingReservations();        
    })

    past.addEventListener("click", ()=>{
        console.log("past")
        console.log(page)
        page = 0;
        isUpcoming = false;
        upcoming.classList.remove("active");
        past.classList.add("active")
        fetchUserPastReservations();        
    })
}

export function initPaginationButton(){
    const add = document.querySelector(".add");
    const sub = document.querySelector(".sub");

    add.addEventListener("click", ()=>{
        if(isUpcoming){
            page += 1;
            console.log("upcoming");
            console.log(page);
            fetchUserUpcomingReservations(page)
        }else{
            page += 1;
            console.log("past");
            console.log(page);
        }
    });

    sub.addEventListener("click", ()=>{
            if(isUpcoming){
            if(page <= 0) return;
            page -= 1;
            console.log("upcoming");
            console.log(page);
            fetchUserUpcomingReservations(page)
        }else{
            page -= 1;
            if(page <= 0) return;
            console.log("past");
            console.log(page);
        }
    });
}