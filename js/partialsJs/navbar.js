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

}