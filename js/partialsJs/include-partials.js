document.addEventListener("DOMContentLoaded", async ()=>{
    const placeHolders = document.querySelectorAll("[data-include]")

    for(const el of placeHolders){
        try{
            const filePath = el.getAttribute("data-include");
            const response = await fetch(filePath);
            const content = await response.text();
            el.innerHTML = content;
        }catch(err){
            console.log(`Error fetching navbar: ${err}`);
        }
    }

    console.log("Includes finished loading");
    window.dispatchEvent(new Event ("includes-loaded")); //custom event, fires later when you decide (after you finish injecting HTML).

})
