


export function initAnimationOurStory(){

    const heroContainer = document.getElementById("home");
    const textContainer = document.querySelector(".hero-text");
    const imageContainer = document.querySelector(".hero-image");

    const observer = new IntersectionObserver((entry)=>{

        if(entry[0].isIntersecting){
            textContainer.classList.add("show");
            imageContainer.classList.add("show");
        }

    }, {
        threshold: 0
    })

    observer.observe(heroContainer);
}