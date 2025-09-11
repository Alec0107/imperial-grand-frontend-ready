// ✅ Run after partials are injected
window.addEventListener("includes-loaded", ()=>{
    initHamburgerMenu();
    //initScrollNavbar();
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

