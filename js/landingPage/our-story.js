const ourStoryImages = [
    "/img/our-story/story1.jpeg",
    "/img/our-story/story2.jpeg",
    "/img/our-story/story3.jpeg",
    "/img/our-story/story4.jpeg",
    "/img/our-story/story5.jpeg"
]

let ourStoryImageInterval;
let imagePointer = 0;




document.addEventListener("DOMContentLoaded", function(){
    renderDotIndicator();
    renderImagesInterval();

})



function renderDotIndicator(){
    const dotContainer = document.querySelector(".dot-container-our-story");

    for(let i = 0; i < ourStoryImages.length; i++){
        const dot = document.createElement("span");
        dot.classList.add("dot-nav");

        dot.dataset.index = 1;

        dotContainer.appendChild(dot);
    }

}

function renderImagesInterval(){
    ourStoryImageInterval = setInterval( ()=>{
       // (4 + 1) % 5 = 5 % 5 = 0
       imagePointer = (imagePointer+ 1) % ourStoryImages.length;
       setImageView();
       console.log(`Image Index: ${imagePointer}`);
    }, 5000);
}

function setImageView(){
    const imageToShow = ourStoryImages[imagePointer];
    const dots = document.querySelectorAll(".dot-nav");

    const imageEl = document.querySelector(".image-container");

    imageEl.style.opacity = 0; // fade out

    setTimeout(() => {
    imageEl.src = imageToShow;  // change the picture
    imageEl.style.opacity = 1;  // fade in
    }, 600); // wait a little before swapping (half of 0.6s)

    dots.forEach( span => span.classList.remove("active"));

    if(dots[imagePointer]){
        dots[imagePointer].classList.add("active");
    }

}