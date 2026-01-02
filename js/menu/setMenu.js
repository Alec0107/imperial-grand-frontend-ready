import { API } from "../APIurl/api.js";
import { openContentLoader, closeContentLoader } from "./categories.js";

let cacheBySlug = new Map();
let currentPage = 0;


export async function loadSetMenus(page = 0){
    openContentLoader();
    const url = API.setmenus.fetchAll;
    const payload = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
      }
   
    try{
        const response = await fetch(`${url}?page=${page}&size=6`, payload);
        const result = await response.json();

        if(!response.ok){
          console.log(response.status);
          throw new Error("error fetching set menus.");
        }

        console.log("Result for set menu:")
        console.log(response)
        console.log(result)
        
        // cache the page's items
        result.content.forEach(it => cacheBySlug.set(it.slug, it));

        closeContentLoader();

        renderSetMenuCard(result.content)
        renderPager(result.number, result.totalPages);

        // attach listener to grid
        const grid = document.getElementById("content-grid");
        grid.addEventListener("click", (e) => {
            const viewDetailsBtn = e.target.closest(".view-details-btn");
            if(!viewDetailsBtn) return;
            openSetDetail(viewDetailsBtn.dataset.slug);
            closeModalXBtn();
        });


    }catch(err){
        console.log("Error " + err);
        closeContentLoader();
    }
}


function renderSetMenuCard(items){

    const grid = document.getElementById("content-grid");
    grid.innerHTML = "";

    items.forEach(item => {
        const price = (item.basePriceCents / 100).toFixed(2);
        const img = item.imageUrl || "/img/setMenu/TESTSET.PNG"; //fallback in dev 

        const cardHTML = `
            <div class="card">
            
                <div class="img-div">
                    <img src="${img}" alt="menu image" class="img">
                </div>

                <div class="txt-details-div">
                    <h4>${item.nameEn} (${price}${item.priceSuffix || "++"})</h4>
                    <p class="meta">${truncate(item.blurbEn)}</p>
                    <button class="view-details-btn" data-slug="${item.slug}">View details</button>
                </div>

            </div>
        `;
        grid.innerHTML += cardHTML;
    });
}



function renderPager(page, totalPages){
    const el = document.getElementById("pager");
    el.innerHTML = `
        <button id="prev-page" type="button" ${page <= 0 ? "disabled" : ""} aria-label="Previous page">Prev</button>
        <span class="pager-font" >Page ${totalPages ? page + 1 : 0} of ${totalPages}</span>
        <button id="next-page" type="button" ${page >= totalPages - 1 ? "disabled" : ""} aria-label="Next page">Next</button>
    `;
    const prevBtn = document.getElementById("prev-page");
    const nextBtn = document.getElementById("next-page");

    if(prevBtn) prevBtn.addEventListener("click", () => {
        loadSetMenus(page - 1);
    });

    if(nextBtn) nextBtn.addEventListener("click", () => {
        loadSetMenus(page + 1);
    });


}







export function truncate(text, maxLength = 40){
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}













function closeModalXBtn(){
    const closeBtn = document.getElementById("modal-close");
    closeBtn.addEventListener("click", closeModal);
}



function openModal(){
    document.querySelector(".modal").classList.add("open");
}


function closeModal(){
 document.querySelector(".modal").classList.remove("open");
}




function openSetDetail(slug){
    console.log(slug);
    const item = cacheBySlug.get(slug);
    if(!item) return;

    const modalTitle = `${item.nameEn}(${(item.basePriceCents/100).toFixed(2)}${item.priceSuffix || "++"})`
    document.getElementById("setModalTitle").textContent = modalTitle;
    console.log(modalTitle);

    const modalCourses = document.querySelector(".courses");
    const listFood = JSON.parse(item.coursesJson || "[]");

    modalCourses.innerHTML = listFood.map(line => {
        const parts = line.split(" / ");
        if(parts.length === 2){
            const [cn, en] = parts;
            return  `<li class="course">
                    <div class="cn">${cn}</div>
                    <div class="en" >${en}</div>
                    </li>`
        }else{
            return `<li class="course">
                        <div class="en">${line}</div>
                    </li>`
        }
    }).join("");
    
    openModal();
}












            // <div class="content">

            //     <!-- grid container for cards -->
            //     <div id="content-grid">

            //         <!-- Example of one card (hardcoded for now) -->
            //         <div class="card">

            //             <div class="img-div">
            //                 <img src="/img/setMenu/TESTSET.PNG" alt="menu image" class="img">
            //             </div>

            //             <div class="txt-details-div">
            //                 <h4>4 Pax Set ($138++)</h4>
            //                 <p class="meta">A well-balanced set menu for 4 persons.</p>
            //                 <button class="view-details-btn">View details</button>
            //             </div>

            //         </div>


                     

            //         <!-- Repeat more cards ... up to 6 per page -->

            //     </div>
                
            // </div>




export async function loadCny2026Promotions(page = 0){
    openContentLoader();
    const url = API.setmenus.fetchCny2026;
    const payload = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
      }
   
    try{
        const response = await fetch(`${url}?page=${page}&size=6`, payload);
        const result = await response.json();

        if(!response.ok){
          console.log(response.status);
          throw new Error("error fetching CNY set menus.");
        }

        console.log("Result for set menu:")
        console.log(response)
        console.log(result)
        
        // cache the page's items
        result.content.forEach(it => cacheBySlug.set(`cny-${it.id}`, it));

        closeContentLoader();

        renderCnyMenuCard(result.content);
        renderCnyPager(result.number, result.totalPages);


    }catch(err){
        console.log("Error " + err);
        closeContentLoader();
    }
}



function renderCnyMenuCard(items) {
  const grid = document.getElementById("content-grid");
  grid.innerHTML = "";

  items.forEach(menu => {
    // take first active option (you can enhance later)
    const option = menu.options?.[0];
    if (!option || option.priceCents == null) return;


    const price = (option.priceCents / 100).toFixed(2);
    const suffix = option.priceSuffix || "++";

    const cardHTML = `
      <div class="card cny-card">

        <div class="img-div">
          <img src="/${menu.imageUrl}" alt="CNY Menu" class="img">
        </div>

        <div class="txt-details-div">
          <h4>
            ${menu.nameEn}<br/>
            <span class="cn">${menu.nameCn}</span>
          </h4>

          <p class="price">$${price}${suffix}</p>

          <button class="view-cny-btn" data-id="${menu.id}">
            View details
          </button>

        </div>

      </div>
    `;

    grid.innerHTML += cardHTML;
  });
}


const grid = document.getElementById("content-grid");

grid.addEventListener("click", (e) => {



  // CNY Menu
  const cnyBtn = e.target.closest(".view-cny-btn");
  if (cnyBtn) {
    openCnyDetail(Number(cnyBtn.dataset.id));
    closeModalXBtn();
    return;
  }

});

function openCnyDetail(id) {
  const menu = cacheBySlug.get(`cny-${id}`);
  if (!menu) return;

  const options = menu.options || [];
  if (!options.length) return;

  // ✅ BUILD PRICING LINES (supports PER_PAX + FIXED_PAX, multiple options)
  const pricingLine = options.map(option => {
    const price = (option.priceCents / 100).toFixed(2);
    const suffix = option.priceSuffix || "++";

    if (option.pricingModel === "PER_PAX") {
      return `
        <div class="pricing-line">
          Per Pax S$${price}${suffix}
          ${option.minPax ? `<br/><small>Min. ${option.minPax} pax</small>` : ""}
        </div>
      `;
    }

    if (option.pricingModel === "FIXED_PAX") {
      return `
        <div class="pricing-line">
          ${option.pax} Pax S$${price}${suffix}
        </div>
      `;
    }

    return "";
  }).join("");

  // ✅ TITLE
  document.getElementById("setModalTitle").innerHTML = `
    ${menu.nameEn}<br/>
    <small>${menu.nameCn}</small>
    ${pricingLine}
  `;

  // ✅ COURSES
  const courses = JSON.parse(menu.coursesJson || "[]");
  const modalCourses = document.querySelector(".courses");

  modalCourses.innerHTML = courses.map(line => {
    const parts = line.split(" / ");
    if (parts.length === 2) {
      const [cn, en] = parts;
      return `
        <li class="course">
          <div class="cn">${cn}</div>
          <div class="en">${en}</div>
        </li>
      `;
    }
    return `<li class="course"><div class="en">${line}</div></li>`;
  }).join("");

  openModal();
}


function renderCnyPager(page, totalPages){
    const el = document.getElementById("pager");
    el.innerHTML = `
        <button id="prev-page" type="button" ${page <= 0 ? "disabled" : ""}>
            Prev
        </button>

        <span class="pager-font">
            Page ${totalPages ? page + 1 : 0} of ${totalPages}
        </span>

        <button id="next-page" type="button" ${page >= totalPages - 1 ? "disabled" : ""}>
            Next
        </button>
    `;

    const prevBtn = document.getElementById("prev-page");
    const nextBtn = document.getElementById("next-page");

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            loadCny2026Promotions(page - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            loadCny2026Promotions(page + 1);
        });
    }
}
