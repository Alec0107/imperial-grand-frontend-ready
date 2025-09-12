import { API } from "../APIurl/api.js";
import { loadSetMenus } from "../menu/setMenu.js"; 
import { loadMenuItems} from "../menu/MenuItem.js";

let categoriesState = []

// drawer for mobile
let backdrop;
let openBtn;

let contentLoader;

document.addEventListener("DOMContentLoaded", () => {
    console.log("Fetching Categories...");
    initGlobalVar();
    initMobileDrawerAndBackdrop(); /// init sidebar this is for mobile
    fetchAllCategories();
    loadSetMenus(0);
    initSideBarButons();
});


function initGlobalVar(){
    backdrop = document.querySelector(".backdrop");
    openBtn = document.getElementById("filter-open");
    contentLoader = document.querySelector(".content-loader");
}



async function fetchAllCategories(){

      const url = API.categories.fetchAllProduct;
      const payload = {
        method: "GET",
        headers: {
                "Content-Type": "application/json",
            },
      }

    try{
        const response = await fetch(url, payload);
        const result = await response.json();

        if(!response.ok){
          console.log(response.status);
        }

        // populate the sidebar list

        categoriesState = result;
        renderSideBar(result);

        console.log(response);
        console.log(result);

    }catch(err){
        console.log("Error " + err);
    }

}



function renderSideBar(parsedCategories){
    const sideBarUl = document.getElementById("parent-container");

    sideBarUl.innerHTML = parsedCategories.map(cat => {
        const hasSubs = cat.subcategories && cat.subcategories.length > 0;

        // render subcategories if present
        let subList = "";
        if(hasSubs){
            subList = `
                    ${cat.subcategories.map(sub => `
                            <button class="subcat-btns-style" data-cat-slug="${cat.catSlug}" data-sub-slug="${sub.slug}">${sub.name}</button>
                    `).join("")}`
        }


        return `
            <div class="cat-parent-div" data-cat-slug="${cat.catSlug}">

                <button class="sub-menu-btn buttons-side">${cat.catName}</button>
               
                ${hasSubs ? ` 
                <svg class="dropdown-arrow" width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12.7071 14.7071C12.3166 15.0976 11.6834 15.0976 11.2929 14.7071L6.29289 9.70711C5.90237 9.31658 5.90237 8.68342 6.29289 8.29289C6.68342 7.90237 7.31658 7.90237 7.70711 8.29289L12 12.5858L16.2929 8.29289C16.6834 7.90237 17.3166 7.90237 17.7071 8.29289C18.0976 8.68342 18.0976 9.31658 17.7071 9.70711L12.7071 14.7071Z" fill="#000000"></path> </g>
                </svg>` : ""}

                <ul class="sub-ul">
                    <div>
                        <li class="sub-li">${subList}</li>
                    </div>
                </ul>

            </div>
        `
    }).join("");
    //     // render subcategories if present
    //     let subList = "";
    //     if(cat.subcategories && cat.subcategories.length > 0){
    //         subList = 
    //         `<ul class="sub-ul">
    //             ${cat.subcategories.map(sub => `
    //                 <li class="sub-li">
    //                 <span>${sub.name}</span>
    //                 </li>
    //             `).join("")}
    //         </ul>`
    //     }

    //     return `
    //         <li class="cat-li">
    //         <span class="cat-name">${cat.catName}</span>
    //         ${subList}
    //         </li>
    //     `;
    // }).join("");
    initToggleSubMenu();    // binds once to the parent container
    // initSubClicks();        // listens for subcategory clicks}

}

function initToggleSubMenu(){

    const buttonContainer = document.getElementById("parent-container");
   
    buttonContainer.addEventListener("click", (e) => {
        const subMenuBtn = e.target.closest(".sub-menu-btn, .dropdown-arrow");
        if(!subMenuBtn) return;

        const parent = subMenuBtn.closest(".cat-parent-div");
        const subUlDiv = parent.querySelector(".sub-ul");
        const arrow = parent.querySelector(".dropdown-arrow"); 

        const isOpen = subUlDiv.classList.contains("show");
        subUlDiv.classList.toggle("show", !isOpen);
        if(arrow) arrow.classList.toggle("rotate", !isOpen);
    })

}
   


function initSubClicks(){
    const container = document.getElementById("parent-container");

    container.addEventListener("click", (e) => {
        const subBtn = e.target.closest(".subcat-btns-style")
        if(!subBtn) return;

        const catSlug = subBtn.dataset.catSlug;
        const subSlug = subBtn.dataset.subSlug;

        console.log("Subcategory clicked:", {catSlug,subSlug});
    })


}



function initSideBarButons(){
    const sideBar = document.getElementById("parent-container");

    sideBar.addEventListener("click", (e)=>{
        // subcategory click → always fetch
        const subBtn = e.target.closest(".subcat-btns-style");
        if(subBtn){
            const catSlug = subBtn.dataset.catSlug;
            const subSlug = subBtn.dataset.subSlug;

            console.log(`${catSlug} : ${subSlug}`);
            const { categoryId, subcategoryId } = mapSlugsToIds(catSlug, subSlug);
            closeDrawer();
            loadMenuItems(categoryId, subcategoryId, 0, 12);
            return;
        }

        // category click
        const catBtn = e.target.closest(".sub-menu-btn, .dropdown-arrow");
            if (catBtn) {
            const catSlug = catBtn.parentElement.dataset.catSlug;

            if (catSlug === "set-menus") {
            closeDrawer();
            
            loadSetMenus(0);
            return;
            }

            // ⬇️ only fetch if NO subcategories
            const cat = categoriesState.find(c => c.catSlug === catSlug);
            if (!cat) return;

            const hasSubs = Array.isArray(cat.subcategories) && cat.subcategories.length > 0;
            if (hasSubs) return; // let your toggle handler just open/close

            const { categoryId } = mapSlugsToIds(catSlug, null);
            closeDrawer();

            loadMenuItems(categoryId, null, 0, 12);
        }

    });

}




function mapSlugsToIds(catSlug, subSlug) {
  const cat = categoriesState.find(c => c.catSlug === catSlug);
  if (!cat) return { categoryId: null, subcategoryId: null };

  const categoryId = cat.catId; // change to cat.categoryId if that’s your field

  let subcategoryId = null;
  if (subSlug && cat.subcategories) {
    const sub = cat.subcategories.find(s => s.slug === subSlug);
    if (sub) subcategoryId = sub.id; // change to sub.subcategoryId if needed
  }

  return { categoryId, subcategoryId };
}

function initMobileDrawerAndBackdrop(){
    openBtn.addEventListener("click", ()=>{
        const isOpen = document.body.classList.contains('filter-open');
        if(isOpen) closeDrawer(); else openDrawer();
    });

    backdrop.addEventListener("click", ()=> closeDrawer());
}


function openDrawer(){
    document.body.classList.add('filter-open');
}

function closeDrawer(){
    document.body.classList.remove('filter-open');
}






export function openContentLoader(){
    console.log("Loading..")
    contentLoader.classList.add("show");
}

export function closeContentLoader(){
    console.log("CLosing laoding screen...")
    contentLoader.classList.remove("show");
}