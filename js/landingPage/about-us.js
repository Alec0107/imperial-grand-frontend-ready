
const menuFeaturedImages = [
    "/img/menu-image-feature/signature1.jpg",
    "/img/menu-image-feature/signature2.jpg",
    "/img/menu-image-feature/signature3.jpg",
    "/img/menu-image-feature/signature4.jpg",
    "/img/menu-image-feature/signature5.jpg",
    "/img/menu-image-feature/signature6.jpg",
]

document.addEventListener("DOMContentLoaded", function(){
    initMenuFeaturedImages();
})

function initMenuFeaturedImages(){

    const gridContainer = document.querySelector(".menu-grid");

    menuFeaturedImages.forEach(imgPath => {
        const img = document.createElement("img");
        img.src = imgPath;
        gridContainer.appendChild(img);
    });
}