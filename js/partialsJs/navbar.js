import { getAuthStatus } from "../SPAJS/AuthController.js";
import { NewAPI, getDeviceIdFromCookie} from "../APIurl/api.js";

const DropdownState= {
    out: `
        <div class="profile-menu">
            <ul class="profile-menu-ul">
                <li>
                    <a href="/pages/SPA/SPA.html#login">
                        <span>Sign In</span>
                    </a>
                </li>
                <li>
                    <a href="/pages/SPA/SPA.html#signup">
                        <span>Create Account</span>
                    </a>
                </li>
          
            </ul>
        </div>
    
    `,

    in: (initial)=>`
        <p>${initial}<p>

        <div class="profile-menu">
            <ul class="profile-menu-ul">
                <li>
                    <a href="/pages/SPA/SPA.html#my_account">
                        <span>My Account</span>
                    </a>
                </li>
                <li>
                    <a href="/pages/SPA/SPA.html#my_reservations">
                        <span>My Reservations</span>
                    </a>
                </li>
                <li>
                    <a href="/pages/SPA/SPA.html#my_rewards">
                        <span>Rewards</span>
                    </a>
                </li>   

                <li>
                    <a href="/pages/SPA/SPA.html#my_rewards">
                        <span style="color:red;">Log out</span>
                    </a>
                </li>   
            </ul>
        </div>

    `

    }


let circleDiv;

// ✅ Run after partials are injected
window.addEventListener("includes-loaded", ()=>{
    initHamburgerMenu();
    //initScrollNavbar();
    setAuthStatusNavBar();
    setProfileIconDropdown();
})


function initHamburgerMenu(){
    const hamMenu = document.querySelector(".ham-menu");
    const navLinks = document.querySelector(".nav-links");

    hamMenu.addEventListener("click", () => {
        hamMenu.classList.toggle("active")
        navLinks.classList.toggle("active");
    })

    // check width if mobile 
    if(window.innerWidth <= 768){
        const navLinks = document.querySelector(".nav-links");
        navLinks.addEventListener("click", (e)=>{
            if(e.target.closest("a")){
                hamMenu.classList.toggle("active")
                navLinks.classList.toggle("active");
            }
        })
    }

}


async function setAuthStatusNavBar(){
    circleDiv = document.querySelector(".auth-state-circle");
    const result = await getAuthStatus(NewAPI.auth.me, NewAPI.auth.refresh, getDeviceIdFromCookie());
    console.log(result)


    if(!result.success){ // show sign in /  sign up dropdown
        circleDiv.innerHTML = DropdownState.out;
    }else{
        const userInitial = result.data.name.split(" ").map(i => i[0]).join("");
        circleDiv.innerHTML = DropdownState.in(userInitial);
    }

}



function setProfileIconDropdown(){
    const trigger = document.querySelector(".auth-state-div");
    if (!trigger) return;

    // 1) Toggle when clicking the profile area
    trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        const menu = trigger.querySelector(".profile-menu"); // 🟢 scoped lookup each click
        if (menu) menu.classList.toggle("show");
    });


    document.addEventListener("click", () => {
        // 2) find open menu and close it
        const openMenu = document.querySelector('.profile-menu.show');
        if (openMenu) openMenu.classList.remove('show');
    });

}
