

const SOURCE = [
    "/img/our-story/story1.jpeg",
    "/img/our-story/story2.jpeg",
    "/img/our-story/story3.jpeg",
    "/img/our-story/story4.jpeg",
    "/img/our-story/story5.jpeg"
]

let ourStoryImageInterval;
let INTERVAL = 5000;
let imagePointer = 0;

let imageEl;


function initGlobalVars(){
    imageEl = document.querySelector(".image-container");
}


document.addEventListener("DOMContentLoaded", function(){
    initGlobalVars();
    preLoadImages(SOURCE, startSlideShow)

})





function preLoadImages(srcs, done){
    let counter = 0;
    srcs.forEach(src => {
        const img = new Image();
        img.onload = () => {
            counter++;
            if(counter === srcs.length){ done(); }
        }
        img.src = src;
    });
}


function startSlideShow(){
    imageEl.src = SOURCE[0];
    imageEl.style.opacity = 1;
    imagePointer = 1;

    //  renderDotIndicator();

    setInterval (nextSlide, INTERVAL);
}

function nextSlide(){
    imagePointer = (imagePointer + 1) % SOURCE.length;
    const nextImg = SOURCE[imagePointer];

    imageEl.style.opacity = 0;

    setTimeout(()=>{
        imageEl.src = nextImg;
        imageEl.style.opacity = 1;
    }, 1000)

}

















// function preLoadImages(srcs, done){
//     let counter = 0;
//     srcs.forEach(src => {
//         const img = new Image();
//         img.onload = () => { 
//             counter++;
//             if(counter === srcs.length){ done();}
//         }
//         img.src = src;
//     })
// }

// function startSlideShow(){
//     imageEl.src = SOURCE[0]
//     imageEl.style.opacity = 1;
//     imagePointer = 1;

//     renderDotIndicator();

//     setInterval(nextSlide, INTERVAL);
// }

// function renderDotIndicator(){
//     const dotContainer = document.querySelector(".dot-container-our-story");
//     for(let i = 0; i < SOURCE.length; i++){
//         const dot = document.createElement("span");
//         dot.classList.add("dot-nav");

//         dot.dataset.index = 1;

//         dotContainer.appendChild(dot);
//     }
// }



// function nextSlide(){
//     imagePointer = (imagePointer + 1) % SOURCE.length;
//     const nextSrc = SOURCE[imagePointer];
//     const dots = document.querySelectorAll(".dot-nav");

//     imageEl.style.opacity = 0;

//     setTimeout(()=>{
//         imageEl.src = nextSrc;
//         imageEl.style.opacity = 1;
//     }, 1000);


// }














// function setImageView(){


//     imageEl.style.opacity = 0; // fade out

//     setTimeout(() => {
//     imageEl.src = imageToShow;  // change the picture
//     imageEl.style.opacity = 1;  // fade in
//     }, 600); // wait a little before swapping (half of 0.6s)

//     dots.forEach( span => span.classList.remove("active"));

//     if(dots[imagePointer]){
//         dots[imagePointer].classList.add("active");
//     }

// }


