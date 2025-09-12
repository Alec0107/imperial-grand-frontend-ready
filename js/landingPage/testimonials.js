const testimonials = [
  { text: 
    `"The food and service here have been consistently excellent over the years. 
    We recently celebrated a birthday in a private room with karaoke, 
    and everyone—from young to old—had a fantastic time. Highly recommended 
    for family gatherings!"`, 
    name: "Shaun C.",
    ratings: 5,
    date: "July 2025",
    imgPath: "/img/testimonials/SC.JPEG"
},

  { text:
    `A hidden gem in the Farrer Park area. Every dish we tried was a hit, and 
    the prices are very reasonable for the quality. Definitely worth discovering!`, 
    name: "Chia T.Y.",
    ratings: 5,
    date: "September 2025",
    imgPath: "/img/testimonials/CTY.JPEG"
},

  { text: `
    We celebrated a birthday here and were so impressed. The Peking Duck was 
    outstanding, and the staff gave wonderful recommendations. The service, food, 
    and atmosphere were all top-notch—perfect for family celebrations!`, 
    name: "Sky S.",
    ratings: 5,
    date: "April 2025",
    imgPath: "/img/testimonials/SS.JPEG"
},
];

const star = `<svg width="25px" height="25px" viewBox="0 0 33.00 33.00" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#DBB741" stroke="#DBB741"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools --> <title>star</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Vivid.JS" stroke-width="0.00033" fill="none" fill-rule="evenodd"> <g id="Vivid-Icons" transform="translate(-903.000000, -411.000000)" fill="#DBB741"> <g id="Icons" transform="translate(37.000000, 169.000000)"> <g id="star" transform="translate(858.000000, 234.000000)"> <g transform="translate(7.000000, 8.000000)" id="Shape"> <polygon points="27.865 31.83 17.615 26.209 7.462 32.009 9.553 20.362 0.99 12.335 12.532 10.758 17.394 0 22.436 10.672 34 12.047 25.574 20.22"> </polygon> </g> </g> </g> </g> </g> </g></svg>`
const emptyStar = `<svg width="25px" height="25px" viewBox="0 0 33.00 33.00" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#DBB741" stroke="#DBB741"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools --> <title>star</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Vivid.JS" stroke-width="1.584" fill="none" fill-rule="evenodd"> <g id="Vivid-Icons" transform="translate(-903.000000, -411.000000)" fill="#ffffff"> <g id="Icons" transform="translate(37.000000, 169.000000)"> <g id="star" transform="translate(858.000000, 234.000000)"> <g transform="translate(7.000000, 8.000000)" id="Shape"> <polygon points="27.865 31.83 17.615 26.209 7.462 32.009 9.553 20.362 0.99 12.335 12.532 10.758 17.394 0 22.436 10.672 34 12.047 25.574 20.22"> </polygon> </g> </g> </g> </g> </g> </g></svg>`;

let slides;
let track;
let index = 1; // ← start at first REAL slide
let slideIntervalTestimonial;

// --- variables for swipe ---
let startX = 0, startY = 0, dx = 0, isSwiping = false;


document.addEventListener("DOMContentLoaded", ()=>{
    slides = document.querySelectorAll(".t-slide")
    track = document.querySelector(".t-track");
    loadTestimonials();
    initSwipe();
})

function loadTestimonials(){

    const firstClone = testimonials[0];
    const lastClone = testimonials[testimonials.length - 1]

    track.innerHTML = [
        toSlide(lastClone),
        testimonials.map(tm => toSlide(tm)).join(""), // all real slides
        toSlide(firstClone)  
    ].join("")

    // put us at index=1 instantly (no animation flash)
    track.style.transition = "none";
    track.style.transform = `translateX(-${index * 100}%)`;
    void track.offsetWidth; // reflow
    track.style.transition = "transform .45s ease"; // restore

    const SLIDE_MS = 450; // must match ".45s" in your CSS

    startSlider();
    initHoverPauses();
}







function toSlide(tm){

        let starSVG = "";

        for(let i = 0; i < tm.ratings; i++){
            starSVG += star;
        }

        for(let i = 0; i < (5 - tm.ratings); i++){
            starSVG += emptyStar;
        }


      return `
        <li class="t-slide">
            <figure class="t-card">

                <blockquote class="t-quote font">
                    ${tm.text}
                </blockquote>

                <div class="rating-star">
                    ${starSVG}
                </div>

                <figurecaption class="t-author">

                    <img src="${tm.imgPath}">
                    
                    <div class="name-date-div">
                        <strong class="font name"> ${tm.name} </strong>
                        <div class="t-meta font date"> ${tm.date} </div>
                    </div>

                </figurecaption>

            </figure>
        </li>
        `
}



function go(i){
 index = i;
  track.style.transition = "transform .45s ease";
  track.style.transform = `translateX(-${index * 100}%)`;
}


function nextSlide() {
  index++;

  if (index === testimonials.length + 1) {
    // animate 3 -> clone(1) forward
    go(index);

    // AFTER the animation, snap clone(1) -> real(1) with no animation
    setTimeout(() => {
      track.style.transition = "none";
      index = 1;
      track.style.transform = `translateX(-${index * 100}%)`;
      // restore transition for next tick
      void track.offsetWidth;
      track.style.transition = "transform .45s ease";
    }, 450);

  } else {
    // normal forward slide
    go(index);
  }
}

function prevSlide() {
  index--;

  if (index === 0) {
    // animate clone(last) backwards
    go(index);

    // after animation, snap back to real last
    setTimeout(() => {
      track.style.transition = "none";
      index = testimonials.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      void track.offsetWidth;
      track.style.transition = "transform .45s ease";
    }, 450);

  } else {
    // normal backwards move
    go(index);
  }
}


function initHoverPauses(){
    track.addEventListener("mouseenter", stopSlider);
    track.addEventListener("mouseleave", startSlider);
}

function startSlider(){
    console.log("Mouse left.")
    slideIntervalTestimonial = setInterval(nextSlide, 6000);
}

function stopSlider() {
  console.log("Hovering")
  clearInterval(slideIntervalTestimonial);
}



function initSwipe(){
    // Attach touch events on the whole track (where the slides are)
    track.addEventListener("touchstart", onTouchStart, { passive: true });
    track.addEventListener("touchmove", onTouchMove, { passive: false });
    track.addEventListener("touchend", onTouchEnd);
}


function onTouchStart(e){
    stopSlider(); // pause autoplay while swiping

    const t = e.touches[0];  // first finger
    startX = t.clientX;      // save X (horizontal position)
    startY = t.clientY;      // save Y (vertical position)
    dx = 0;                  // reset swipe distance
    isSwiping = false;       // not swiping yet

    // turn off animation so slide follows finger immediately
    track.style.transition = "none";
}

// 2. When finger moves
function onTouchMove(e) {
  const t = e.touches[0];
  const mx = t.clientX - startX; // distance moved horizontally
  const my = t.clientY - startY; // distance moved vertically

  // detect if this is horizontal swipe (not scrolling up/down)
  if (!isSwiping) {
    if (Math.abs(mx) > 10 && Math.abs(mx) > Math.abs(my)) {
      isSwiping = true; // yes it's a horizontal swipe
    } else {
      return; // ignore if scrolling vertically
    }
  }

  e.preventDefault(); // stop page from scrolling up/down
  dx = mx; // save distance

  // move slides according to finger
  track.style.transform = `translateX(${dx - index * track.offsetWidth}px)`;
}

// 3. When finger lifts
function onTouchEnd() {
  track.style.transition = "transform .45s ease"; // restore smooth animation
  const threshold = track.offsetWidth * 0.2; // 20% of container width

  if (isSwiping && Math.abs(dx) > threshold) {
    // enough swipe → change slide
    if (dx < 0) {
      nextSlide(); // swiped left
    } else {
      prevSlide(); // swiped right
    }
  } else {
    // not enough → snap back
    go(index);
  }

  startSlider(); // resume autoplay
}