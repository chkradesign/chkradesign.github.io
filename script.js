const hamMenu = document.querySelector('.ham-menu');
const offScreenMenu = document.querySelector('.off-screen-menu');

hamMenu.addEventListener('click', ()=>{
    hamMenu.classList.toggle('active');
    offScreenMenu.classList.toggle('active');
})

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

//intro bars animation
gsap.to(".bar", 1.5,{
  delay: 0.5,
  height: 0,
  stagger: {
      amount: 0.5,
  },
  ease: "power4.inOut",
})
  
  // Ripple Effect Background Change and Open Project
  // function openProject(url, event) {
  //   const color = event.currentTarget.getAttribute('data-color');
  //   document.body.style.setProperty('--ripple-color', color);
  //   const ripple = document.createElement('span');
  //   const rect = event.currentTarget.getBoundingClientRect();
  //   const size = Math.max(rect.width, rect.height);
  //   const x = event.clientX - rect.left - size / 2;
  //   const y = event.clientY - rect.top - size / 2;
  //   ripple.style.width = ripple.style.height = `${size}px`;
  //   ripple.style.left = `${x}px`;
  //   ripple.style.top = `${y}px`;
  //   ripple.classList.add('ripple');
  //   event.currentTarget.appendChild(ripple);
  //   setTimeout(() => {
  //     window.location.href = url;
  //   }, 600);
  // }
  
