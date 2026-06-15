const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
})

document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}))

const cursor = document.getElementById('custom-cursor');
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
const speed = 0.2;
let cursorVisible = false;

function animate() {
  const distX = mouseX - cursorX;
  const distY = mouseY - cursorY;

  cursorX += distX * speed;
  cursorY += distY * speed;

  cursor.style.left = cursorX + 'px';
  cursor.style.top = cursorY + 'px';

  requestAnimationFrame(animate);
}

function handleMouseMove(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;

  if (!cursorVisible) {
    cursor.style.visibility = 'visible';
    cursorVisible = true;
    animate();
  }
}

// Mobile device check
if (window.matchMedia('(pointer: coarse)').matches) {
  // Mobile device, don't show custom cursor
  cursor.style.display = 'none';
} else {
  // Desktop device, add mousemove listener
  document.addEventListener('mousemove', handleMouseMove);
}

if (!window.matchMedia('(pointer: coarse)').matches) {
    document.addEventListener('mousemove', handleMouseMove);
  }

//intro bars animation
gsap.to(".line", 1.5,{
    delay: 0.5,
    height: 0,
    stagger: {
        amount: 0.5,
    },
    ease: "power4.inOut",
    onComplete: () => {
      // Fade out overlay after lines shrink
      gsap.to(".overlay", {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          document.querySelector(".overlay").style.display = "none";
        }
      });
    }
  })

document.addEventListener('DOMContentLoaded', () => {
    // --- Dynamic Splash Transition Logic ---
    const splashTriggers = document.querySelectorAll('.splash-trigger');

    splashTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            // Prevent default navigation initially
            e.preventDefault();
            
            const targetUrl = trigger.getAttribute('href');
            // Get the color from data-bg, default to white if not set
            const targetColor = trigger.getAttribute('data-bg') || '#F2F0EF';

            // Create splash element dynamically
            const splash = document.createElement('div');
            splash.classList.add('splash-transition');
            splash.style.backgroundColor = targetColor;
            
            // Set position based on click
            splash.style.left = `${e.clientX}px`;
            splash.style.top = `${e.clientY}px`;
            
            document.body.appendChild(splash);

            // Expand the circle
            gsap.to(splash, {
                scale: 250, 
                duration: 0.8,
                ease: "power3.inOut",
                onComplete: () => {
                    window.location.href = targetUrl;
                }
            });
        });
    });
});
