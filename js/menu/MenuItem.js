import { API } from "../APIurl/api.js";
import { truncate } from "./setMenu.js";



export async function loadMenuItems(categoryId, subcategoryId = null, page = 0, size = 12){

    const url = "https://imperialgrand-backend-ready-production.up.railway.app"; // <-- items endpoint
    const qs = new URLSearchParams({ categoryId, page, size });
    if (subcategoryId) qs.append("subcategoryId", subcategoryId);
    const payload = {
        method: "GET",
        headers: {
            "Accept": "application/json",
        },
    }



    try{
        const res = await fetch(`${url}?${qs.toString()}`, { headers: { Accept: "application/json" } });
        if (!res.ok) {
           
             return; 
            }

        const data = await res.json();


        renderMenuItemsCard(data.content || []);
        renderMenuItemsPager(data.number ?? 0, data.totalPages ?? 1, categoryId, subcategoryId, size);
    }catch(err){
        console.log("err fetching menu item: " + err);
    }


}



function renderMenuItemsCard(items){
    const grid = document.getElementById("content-grid");
    grid.innerHTML = "";

     items.forEach(item => {
        const price = (item.priceCents / 100).toFixed(2);
        const img = item.imageUrl || ""; //fallback in dev 
        
        const cardHTML = `
            <div class="card">
            
                <div class="img-div">
                    <img src="${img}" alt="menu image" class="img">
                </div>

                <div class="txt-details-div">
                    <h4>${item.nameEn}</h4>
                    <p class="meta">${price ? ` S$ ${price}` : ""}</p>
                    <p class="meta">${item.blurbEn}</p>
                    
                </div>

            </div>
        `;
        grid.innerHTML += cardHTML;

     });


}

{/* <button class="view-details-btn" data-slug="${item.slug}">View details</button> */}

function renderMenuItemsPager(page, totalPages, catId, subCat, size){
    const el = document.getElementById("pager");
    el.innerHTML = `
        <button id="prev-page" type="button" ${page <= 0 ? "disabled" : ""} aria-label="Previous page">Prev</button>
        <span>Page ${totalPages ? page + 1 : 0} of ${totalPages}</span>
        <button id="next-page" type="button" ${page >= totalPages - 1 ? "disabled" : ""} aria-label="Next page">Next</button>
    `;
    const prevBtn = el.querySelector("#prev-page");
    const nextBtn = el.querySelector("#next-page");

    if(prevBtn) prevBtn.addEventListener("click", () => {
        loadMenuItems(catId, subCat, page - 1, size);
    });

    if(nextBtn) nextBtn.addEventListener("click", () => {
        loadMenuItems(catId, subCat, page + 1, size);
    });
}


