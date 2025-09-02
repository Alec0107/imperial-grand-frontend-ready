// global vars
let closeModalBtn;
let modalContainer;
let backDrop;

let currentImageIndex = 0;
let currentDataIndex = 0;

// for the three images
let experienceGrid;

// interval
let slideInterval;

const experienceData = [
        {
            title: "Timeless <br>Elegance",
            imageUrl: [
                "/img/modal-feature-images/modal/Timeless1.jpg",
                "/img/modal-feature-images/modal/Timeless2.jpg",
                "/img/modal-feature-images/modal/Timeless3.jpg"
            ],
            description: `Step into an atmosphere where every detail speaks luxury.  
            At Imperial Grand, dining is more than a meal — it's an immersive experience in comfort and refinement.
            <br><br>Surrounded by rich textures, warm lighting, and timeless design, you'll find yourself savoring not just the cuisine, but the moment itself.`
        },
        {
            title: "Celebrations <br>Redefined",
            imageUrl: [

            ],
            description: `Celebrate your milestones in grandeur. Our private event spaces are tailored to host everything from intimate gatherings to extravagant soirées.
            <br><br>Enjoy curated menus, customizable layouts, and a dedicated team ensuring your event is nothing short of perfection.`
        },
        {
            title: "Chef’s <br>Signature Tasting",
            imageUrl: [
                "/img/modal-feature-images/modal/Authentic1.jpg",
                "/img/modal-feature-images/modal/Authentic2.jpg",
                "/img/modal-feature-images/modal/Authentic3.jpg"
            ],
            description: `Embark on a culinary journey guided by the imagination of our executive chef. Each dish in our tasting menu tells a story through flavor, technique, and presentation.
            <br><br>Seasonal ingredients and innovative flair come together to surprise and delight even the most refined palates.`
        }
    ];

// ✅ Run after partials are injected
window.addEventListener("includes-loaded", ()=>{
    initHamburgerMenu();
})

document.addEventListener("DOMContentLoaded", function(){
    //initScrollNavbar();
    initGlobalVar();
    // initModalContent();
    // initThreeCardImages();
});


function initGlobalVar(){
    backDrop = document.getElementById("modal-backdrop");
    modalContainer = document.getElementById("experience-modal");
    closeModalBtn = document.querySelector(".close-modal-btn");
    experienceGrid = document.querySelector(".experience-grid");
}

function initModalContent(){
    closeModalBtn.addEventListener("click", ()=>{
        modalContainer.classList.remove("show");
        modalContainer.classList.add("hidden");
        backDrop.classList.add("hidden");
        clearInterval(slideInterval);
    });

    modalContainer.addEventListener("animationend", ()=>{
        if(modalContainer.classList.contains("hidden")){
            modalContainer.style.display = "none";
        }
    });

    backDrop.addEventListener("click", ()=>{
        modalContainer.classList.remove("show");
        modalContainer.classList.add("hidden");
        backDrop.classList.add("hidden");
        clearInterval(slideInterval);
    });
}

// find the id of one of the three images so modal will show (more details)
function initThreeCardImages(){
    experienceGrid.addEventListener("click", (e) => {
        const clickedCard = e.target.closest(".experience-image");
        if(!clickedCard) return
        const cardId = clickedCard.id;
        console.log("User clicked:", cardId);

        switch(cardId){
            case "portrait":
                showModalData(0);
                break;
            case "image-1":
                showModalData(1);
                break;
            case "image-2":
                showModalData(2);
                break;
        }
    });
}


function showModalData(index){
    const data = experienceData[index];
    
    currentDataIndex = index;
    currentImageIndex = 0;

    document.querySelector(".modal-title").innerHTML = data.title; // append the title
    document.querySelector(".modal-description").innerHTML = data.description; // append the description
    document.querySelector(".modal-image").src = data.imageUrl[currentImageIndex]; // append the image

    renderDots(data.imageUrl.length);

    slideInterval = setInterval(()=>{
        currentImageIndex = (currentImageIndex + 1) % data.imageUrl.length;
        updateImageShown();
        console.log(`Image Index: ${currentImageIndex}`);
    }, 2000)

    showModalUI();
}


function renderDots(length){

 const dotContainer = document.querySelector(".dot-container"); //get the dot container div
 dotContainer.innerHTML =  ``;

 for(let i = 0; i < length; i++){
    const dot = document.createElement("p");
    dot.classList.add("dot");

    if( i === currentImageIndex) dot.classList.add("active");

    dot.dataset.index = i;

    dot.addEventListener("click", ()=>{
        currentImageIndex = parseInt(dot.dataset.index);
        const images = experienceData[currentDataIndex].imageUrl;
        document.querySelector(".modal-image").src = images[currentImageIndex];
        renderDots(length);
    });

    dotContainer.appendChild(dot);
 }

}


function updateImageShown(){
    const data = experienceData[currentDataIndex];
    const currentImage = data.imageUrl[currentImageIndex];
    const dots = document.querySelectorAll(".dot");

    document.querySelector(".modal-image").src = currentImage;

    dots.forEach(p=> p.classList.remove("active"));

    if(dots[currentImageIndex]){
        dots[currentImageIndex].classList.add("active");
    }

}





// to show data in the modal
// function showModalData(index){
//     const data = experienceData[index];

//     currentDataIndex = index; // save the current data index
//     currentImageIndex = 0 // set to 0 current image so wehenever the card is clicked its always starts at 0 index

//     document.querySelector(".modal-title").innerHTML = data.title; // append the title
//     document.querySelector(".modal-description").innerHTML = data.description; // append the description
//     document.querySelector(".modal-image").src = data.imageUrl[currentImageIndex]; // append the image

//     renderDots(data.imageUrl.length);// creating the dots

//     slideInterval = setInterval(()=>{
//         currentImageIndex = (currentImageIndex + 1) % data.imageUrl.length; // update the image index 
//         updateImageShown(); // update the image shown based on the index
//     }, 4000)

//     showModalUI();
// }


// function renderDots(length){
//     const dotContainer = document.querySelector(".dot-container"); //get the dot container div

//     dotContainer.innerHTML = ``; // clear the dot contianer div

//     for(let i = 0; i < length; i++){
//         const dot = document.createElement("p");
//         dot.classList.add("dot");

//         if(i === currentImageIndex) dot.classList.add("active"); // add the active class in current index image

//         dot.dataset.index = i;

//         dot.addEventListener("click", ()=>{
//             currentImageIndex = parseInt(dot.dataset.index);
//             const images = experienceData[currentDataIndex].imageUrl;
//             document.querySelector(".modal-image").src = images[currentImageIndex];
//             renderDots(length);
//         });

//         dotContainer.appendChild(dot);
//     }

 
// }

// function updateImageShown(){
//     const data = experienceData[currentDataIndex]; // get the current data index
//     const currentImage = data.imageUrl[currentImageIndex]; // get the current image 
//     const dots = document.querySelectorAll(".dot"); // get all dots in a div

//     document.querySelector(".modal-image").src = currentImage; // show the updated current image

 
//     dots.forEach(p => p.classList.remove("active")); // remove or clear the active dot classes

//     if(dots[currentImageIndex]){
//         dots[currentImageIndex].classList.add("active");
//     }

// }




function showModalUI(){
    modalContainer.style.display = "block"
    modalContainer.classList.add("show");
    modalContainer.classList.remove("hidden");
    backDrop.classList.add("show")
    backDrop.classList.remove("hidden");
}

function removeModalUI(){
    modalContainer.classList.remove("show");
    modalContainer.classList.add("hidden");
    backDrop.classList.add("hidden");
}

// function initScrollNavbar(){
//     // capture lastScrolledY
//     let lastScrolledY = window.scrollY;
//     const navbar = document.querySelector(".navbar");

//     window.addEventListener(`scroll`, () => {
//         let currentScrollY = window.scrollY;
//         if(currentScrollY > lastScrolledY){
//             navbar.classList.add("hidden");
//         }else{
//             navbar.classList.remove("hidden");
//         }
//         lastScrolledY = currentScrollY;
//     });

// }

function initHamburgerMenu(){
    const hamMenu = document.querySelector(".ham-menu");
    const navLinks = document.querySelector(".nav-links");

    hamMenu.addEventListener("click", () => {
        hamMenu.classList.toggle("active")
        navLinks.classList.toggle("active");
    })

}