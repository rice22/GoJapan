// Hero Section Card Carousel
const cards = document.querySelectorAll('#cardsContainer > div[data-img]');
const mainImage = document.querySelector('#section1 img');
const indexDisplay = document.getElementById('indexDisplay');
const regionText = document.getElementById('regionText');
const titleText = document.getElementById('titleText');
const descText = document.getElementById('descText');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const transitionOverlay = document.getElementById('transitionOverlay');
const mainContainer = document.querySelector('.max-w-\\[1200px\\]');



function isUserNearHero() {
  const heroTop = mainContainer.getBoundingClientRect().top;
  // only scroll if hero is near viewport top 
  return heroTop >= 0 && heroTop < 20;
}

let currentIndex = 0;
let intervalId;
let isTransitioning = false;

// update left side text content based on card
function updateTextContent(card) {
  regionText.textContent = card.getAttribute('data-region') || '';
  titleText.innerHTML = (card.getAttribute('data-title') || '').replace(/\n/g, '<br/>');
  descText.textContent = card.getAttribute('data-desc') || '';
}

// expanding card animation
function createExpandingAnimation(card, targetIndex) {
  if (isTransitioning) return;
  isTransitioning = true;
  
  // get card position and dimensions
  const cardRect = card.getBoundingClientRect();
  const containerRect = mainContainer.getBoundingClientRect();
  
  // create clone of the card for animation
  const cardClone = document.createElement('div');
  cardClone.className = 'card-clone';
  cardClone.style.width = `${cardRect.width}px`;
  cardClone.style.height = `${cardRect.height}px`;
  cardClone.style.top = `${cardRect.top - containerRect.top}px`;
  cardClone.style.left = `${cardRect.left - containerRect.left}px`;
  cardClone.style.zIndex = '5';
  
  // create image inside clone
  const img = document.createElement('img');
  img.src = card.getAttribute('data-img');
  img.className = 'w-full h-full object-cover';
  cardClone.appendChild(img);
  
  // stacking
  mainContainer.insertBefore(cardClone, document.getElementById('cardsContainer'));
  
  // reflow
  cardClone.offsetHeight;
  
  // overlay for fade effect
  transitionOverlay.style.opacity = '0.3';
  
  // start animation
  requestAnimationFrame(() => {
    // animate to full container size
    cardClone.style.width = '100%';
    cardClone.style.height = '100%';
    cardClone.style.top = '0';
    cardClone.style.left = '0';
    cardClone.style.borderRadius = '0.75rem';
    
    // after animation completes
    cardClone.addEventListener('transitionend', function handler() {
      // update actual background image
      mainImage.src = card.getAttribute('data-img');
      
      // dade out overlay
      transitionOverlay.style.opacity = '0';
      
      // remove clone
      setTimeout(() => {
        cardClone.remove();
        isTransitioning = false;
      }, 50);
      
      cardClone.removeEventListener('transitionend', handler);
    }, { once: true });
  });
}

const carouselContainer = document.getElementById('cardsContainer');

function scrollCardIntoViewHorizontally(card) {
  const containerRect = carouselContainer.getBoundingClientRect();
  const cardRect = card.getBoundingClientRect();

  // calculate how far to scroll the container to center the card
  const scrollLeft = card.offsetLeft - (carouselContainer.clientWidth / 2) + (card.clientWidth / 2);

  carouselContainer.scrollTo({
    left: scrollLeft,
    behavior: 'smooth'
  });
}

// Uupdate main image with expanding card effect
function setActiveCard(index) {
  if (isTransitioning) return;
  const previousIndex = currentIndex;
  currentIndex = index;
  cards.forEach((card, i) => {
    if(i === index) {
      card.classList.add('border-yellow-500');
      card.classList.remove('border-transparent');
      scrollCardIntoViewHorizontally(card);      
      updateTextContent(card);
      
      // only animate if this is not the initial load
      if (previousIndex !== index) {
        createExpandingAnimation(card, index);
      }
    } else {
      card.classList.remove('border-yellow-500');
      card.classList.add('border-transparent');
    }
  });
  indexDisplay.textContent = (index + 1).toString().padStart(2, '0');
}

// cards transition every 6 seconds
function startAutoCycle() {
  intervalId = setInterval(() => {
    if (!isTransitioning) {
      const nextIndex = (currentIndex + 1) % cards.length;
      setActiveCard(nextIndex);
    }
  }, 6000);
}

function stopAutoCycle() {
  clearInterval(intervalId);
}

setActiveCard(currentIndex);
startAutoCycle();

// click event for manual card selection
cards.forEach((card, index) => {
  card.addEventListener('click', () => {
    if (isTransitioning || currentIndex === index) return;
    
    stopAutoCycle();
    setActiveCard(index);
    
    // auto restart after 8 seconds
    clearTimeout(card.restartTimeout);
    card.restartTimeout = setTimeout(() => {
      startAutoCycle();
    }, 8000);
  });
});

// prev and next buttons
prevBtn.addEventListener('click', () => {
  if (isTransitioning) return;
  stopAutoCycle();
  const prevIndex = (currentIndex - 1 + cards.length) % cards.length;
  setActiveCard(prevIndex);
  clearTimeout(prevBtn.restartTimeout);
  prevBtn.restartTimeout = setTimeout(() => {
    startAutoCycle();
  }, 8000);
});

nextBtn.addEventListener('click', () => {
  if (isTransitioning) return;
  stopAutoCycle();
  const nextIndex = (currentIndex + 1) % cards.length;
  setActiveCard(nextIndex);
  clearTimeout(nextBtn.restartTimeout);
  nextBtn.restartTimeout = setTimeout(() => {
    startAutoCycle();
  }, 8000);
});


























// Gallery Section Functionality
document.addEventListener('DOMContentLoaded', () => {
  // click event listeners to gallery cards
  const galleryCards = document.querySelectorAll('.gallery-card');
  
  galleryCards.forEach(card => {
    card.addEventListener('click', () => {
      // remove selected class from all cards
      galleryCards.forEach(c => c.classList.remove('selected'));
      
      // add selected class to clicked card
      card.classList.add('selected');
      
      console.log('Gallery card clicked:', card.getAttribute('data-img'));
    });

    // card clickable
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const href = card.dataset.href;
      if (href) {
        window.location.href = href;
      }
    });
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const cards = document.querySelectorAll('.gallery-card');
  
  cards.forEach(card => {
    let slideInterval;
    let isSlideShowActive = false;
    
    // text overlay z-index
    const textOverlay = card.querySelector('.absolute');
    if (textOverlay) {
      textOverlay.classList.add('text-overlay');
    }
    
    // get all images in this card's image container
    const imageContainer = card.querySelector('.image-container');
    
    // if no image container yet, create one
    if (!imageContainer) {
      // Get the original image
      const originalImg = card.querySelector('img');
      if (!originalImg) return;
      
      // create image container
      const container = document.createElement('div');
      container.className = 'image-container';
      
      // get image src and create base path for additional images
      const imgSrc = originalImg.getAttribute('src');
      const imgAlt = originalImg.getAttribute('alt');
      const imgClass = originalImg.className;
      
      // extract base path and extension
      const lastDotIndex = imgSrc.lastIndexOf('.');
      const basePath = imgSrc.substring(0, lastDotIndex - 1);
      const extension = imgSrc.substring(lastDotIndex);
      
      // 3 images
      for (let i = 1; i <= 3; i++) {
        const newImg = document.createElement('img');
        newImg.src = `${basePath}${i}${extension}`;
        newImg.alt = imgAlt;
        newImg.className = imgClass;
        if (i === 1) newImg.classList.add('active');
        container.appendChild(newImg);
      }
      
      // replace original image with the container
      originalImg.parentNode.insertBefore(container, originalImg);
      originalImg.remove();
    }
    
    // get all images in the container
    const images = card.querySelectorAll('.image-container img');
    
    // if only one image, no need for slideshow
    if (images.length <= 1) return;
    
    let currentImageIndex = 0;
    
    // start the slideshow
    function startSlideshow() {
      if (isSlideShowActive) return;
      
      isSlideShowActive = true;
      slideInterval = setInterval(() => {
        // remove active class from current image
        images[currentImageIndex].classList.remove('active');
        images[currentImageIndex].classList.add('slide-out');
        
        // move to next image
        currentImageIndex = (currentImageIndex + 1) % images.length;
        
        // add active class to new image
        images[currentImageIndex].classList.add('active', 'slide-in');
        
        // clean up classes after transition
        setTimeout(() => {
          images.forEach((img, idx) => {
            if (idx !== currentImageIndex) {
              img.classList.remove('slide-out', 'slide-in');
            }
          });
          images[currentImageIndex].classList.remove('slide-in');
        }, 500); 
      }, 2000); 
    }
    
    // stop the slideshow
    function stopSlideshow() {
      clearInterval(slideInterval);
      isSlideShowActive = false;
      
      // reset to first image
      images.forEach((img, idx) => {
        if (idx === 0) {
          img.classList.add('active');
        } else {
          img.classList.remove('active', 'slide-in', 'slide-out');
        }
      });
      currentImageIndex = 0;
    }
    
   // start slideshow immediately when mouse enters
    card.addEventListener('mouseenter', () => {
      startSlideshow();
    });
    
    // stop slideshow when mouse leaves
    card.addEventListener('mouseleave', () => {
      stopSlideshow();
    
    });
    // prevent the slideshow from interfering with the click event
    card.addEventListener('click', (e) => {
      //click is on the card itself 
      if (e.target === card || card.contains(e.target)) {
        // get destination URL from the onclick attribute or data attribute
        const href = card.getAttribute('onclick')?.match(/window\.location\.href='([^']+)'/)?.[1] || 
                    card.dataset.href;
                    
        if (href) {
          window.location.href = href;
        }
      }
    });
  });
});


// Seasons Section Functionality

document.addEventListener('DOMContentLoaded', function() {
  
  // season button clicks
  const seasonBtns = document.querySelectorAll('.season-btn');
  seasonBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // remove active class from all buttons and rooms
      seasonBtns.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.shoji-room').forEach(room => room.classList.remove('active'));
      
      // add active class to clicked button and corresponding room
      this.classList.add('active');
      const season = this.dataset.season;
      document.getElementById(`${season}-room`).classList.add('active');
    });
  });
  
  // shoji door clicks
  const shojiDoors = document.querySelectorAll('.shoji-door');
  shojiDoors.forEach(door => {
    door.addEventListener('click', function() {
      const room = this.parentElement;
      room.classList.toggle('open');
      
      // start image slideshow when door is opened
      if (room.classList.contains('open')) {
        startSlideshow(room);
      }
    });
  });
  
  // seasonal effects
  initSeasonalEffects();
});

function setupSeasonImageTransitions() {
  document.querySelectorAll('.shoji-room').forEach(room => {
    const images = room.querySelectorAll('.season-images img');
    let currentIndex = 0;
    
    // find active image
    images.forEach((img, index) => {
      if (img.classList.contains('active')) {
        currentIndex = index;
      }
    });
    
    // interval to change images
    setInterval(() => {
      // remove active class from current image
      images[currentIndex].classList.remove('active');
      
      // move to next image or back to first
      currentIndex = (currentIndex + 1) % images.length;
      
      // add active class to new current image
      images[currentIndex].classList.add('active');
    }, 3000); // Change image every 5 seconds
  });
}

document.addEventListener('DOMContentLoaded', function() {
  setupSeasonImageTransitions();
});

// seasonal effects
function initSeasonalEffects() {
  // spring effect (cherry blossoms)
  initCherryBlossoms();
  
  // summer effect (fireflies)
  initFireflies();
  
  // autumn effect (falling leaves)
  initFallingLeaves();
  
  // winter effect (snowflakes)
  initSnowflakes();
}

// cherry blossoms effect
function initCherryBlossoms() {
  const canvas = document.querySelector('.spring-effect');
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  
  const petals = [];
  const petalCount = 30;
  
  for (let i = 0; i < petalCount; i++) {
    petals.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 10 + 5,
      speed: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.3,
      rotation: Math.random() * 360
    });
  }
  
  function drawPetals() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    petals.forEach(petal => {
      ctx.save();
      ctx.translate(petal.x, petal.y);
      ctx.rotate((petal.rotation * Math.PI) / 180);
      ctx.beginPath();
      ctx.fillStyle = `rgba(255, 218, 225, ${petal.opacity})`;
      ctx.ellipse(0, 0, petal.size, petal.size / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      
      petal.y += petal.speed;
      petal.x += Math.sin(petal.y / 50) * 0.5;
      petal.rotation += 0.5;
      
      if (petal.y > canvas.height) {
        petal.y = -petal.size;
        petal.x = Math.random() * canvas.width;
      }
    });
    
    requestAnimationFrame(drawPetals);
  }
  
  drawPetals();
}

// fireflies effect for summer (continued)
function initFireflies() {
  const canvas = document.querySelector('.summer-effect');
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  
  const fireflies = [];
  const fireflyCount = 20;
  
  for (let i = 0; i < fireflyCount; i++) {
    fireflies.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 1 + 0.5,
      brightness: 0,
      maxBrightness: Math.random() * 0.8 + 0.2,
      brightening: true,
      brightSpeed: Math.random() * 0.02 + 0.01
    });
  }
  
  function drawFireflies() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    fireflies.forEach(fly => {
      ctx.beginPath();
      const gradient = ctx.createRadialGradient(fly.x, fly.y, 0, fly.x, fly.y, fly.size * 3);
      gradient.addColorStop(0, `rgba(255, 255, 150, ${fly.brightness})`);
      gradient.addColorStop(1, 'rgba(255, 255, 150, 0)');
      ctx.fillStyle = gradient;
      ctx.arc(fly.x, fly.y, fly.size * 3, 0, Math.PI * 2);
      ctx.fill();
      
      fly.x += Math.sin(Date.now() / 1000 * fly.speed) * 0.5;
      fly.y += Math.cos(Date.now() / 1000 * fly.speed) * 0.5;
      
      if (fly.brightening) {
        fly.brightness += fly.brightSpeed;
        if (fly.brightness >= fly.maxBrightness) {
          fly.brightening = false;
        }
      } else {
        fly.brightness -= fly.brightSpeed;
        if (fly.brightness <= 0) {
          fly.brightening = true;
        }
      }
      
      if (fly.x < 0) fly.x = canvas.width;
      if (fly.x > canvas.width) fly.x = 0;
      if (fly.y < 0) fly.y = canvas.height;
      if (fly.y > canvas.height) fly.y = 0;
    });
    
    requestAnimationFrame(drawFireflies);
  }
  
  drawFireflies();
}

// falling leaves effect for autumn
function initFallingLeaves() {
  const canvas = document.querySelector('.autumn-effect');
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  
  const leaves = [];
  const leafCount = 25;
  const leafColors = ['#C94C24', '#E58F34', '#8C4B2A', '#BB4430', '#7D2E0B'];
  
  for (let i = 0; i < leafCount; i++) {
    leaves.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 10 + 8,
      speed: Math.random() * 1.5 + 0.5,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 2 - 1,
      color: leafColors[Math.floor(Math.random() * leafColors.length)],
      swingFactor: Math.random() * 5 + 3
    });
  }
  
  function drawLeaves() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    leaves.forEach(leaf => {
      ctx.save();
      ctx.translate(leaf.x, leaf.y);
      ctx.rotate((leaf.rotation * Math.PI) / 180);
      
      ctx.beginPath();
      ctx.fillStyle = leaf.color;
      ctx.moveTo(0, -leaf.size/2);
      ctx.bezierCurveTo(leaf.size/3, -leaf.size/2, leaf.size/2, -leaf.size/4, leaf.size/2, 0);
      ctx.bezierCurveTo(leaf.size/2, leaf.size/4, leaf.size/3, leaf.size/2, 0, leaf.size/2);
      ctx.bezierCurveTo(-leaf.size/3, leaf.size/2, -leaf.size/2, leaf.size/4, -leaf.size/2, 0);
      ctx.bezierCurveTo(-leaf.size/2, -leaf.size/4, -leaf.size/3, -leaf.size/2, 0, -leaf.size/2);
      ctx.fill();
      
      ctx.beginPath();
      ctx.strokeStyle = '#7D4F2A';
      ctx.lineWidth = 1;
      ctx.moveTo(0, -leaf.size/2);
      ctx.lineTo(0, -leaf.size/2 - 5);
      ctx.stroke();
      
      ctx.restore();
      
      leaf.y += leaf.speed;
      leaf.x += Math.sin(leaf.y / leaf.swingFactor) * 0.8;
      leaf.rotation += leaf.rotationSpeed;
      
      if (leaf.y > canvas.height) {
        leaf.y = -leaf.size;
        leaf.x = Math.random() * canvas.width;
      }
    });
    
    requestAnimationFrame(drawLeaves);
  }
  
  drawLeaves();
}

// snowflakes effect for winter
function initSnowflakes() {
  const canvas = document.querySelector('.winter-effect');
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  
  const snowflakes = [];
  const snowflakeCount = 50;
  
  for (let i = 0; i < snowflakeCount; i++) {
    snowflakes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 4 + 1,
      speed: Math.random() * 1 + 0.5,
      opacity: Math.random() * 0.5 + 0.5,
      swingRange: Math.random() * 3 + 1
    });
  }
  
  function drawSnowflakes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    snowflakes.forEach(flake => {
      ctx.beginPath();
      ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
      ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
      ctx.fill();
      
      flake.y += flake.speed;
      flake.x += Math.sin(flake.y / 30) * flake.swingRange;
      
      if (flake.y > canvas.height) {
        flake.y = -flake.size;
        flake.x = Math.random() * canvas.width;
      }
    });
    
    requestAnimationFrame(drawSnowflakes);
  }
  
  drawSnowflakes();
}

document.addEventListener('DOMContentLoaded', function() {
  // seasonal effects
  initializeSeasonalEffects();
  
  // event listeners to season buttons
  const seasonBtns = document.querySelectorAll('.season-btn');
  seasonBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const season = this.getAttribute('data-season');
      openSeason(season);
    });
  });
  
  // event listeners to shoji doors
  const shojiDoors = document.querySelectorAll('.shoji-door');
  shojiDoors.forEach(door => {
    door.addEventListener('click', function() {
      const room = this.closest('.shoji-room');
      room.classList.toggle('open');
    });
  });
  
  // spring default
  openSeason('spring');
});

function openSeason(season) {
  // remove active class from all buttons and add to selected
  document.querySelectorAll('.season-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`.season-btn[data-season="${season}"]`).classList.add('active');
  
  // remove open class from all rooms and add to selected
  document.querySelectorAll('.shoji-room').forEach(room => {
    room.classList.remove('open');
  });
  document.getElementById(`${season}-room`).classList.add('open');
}

function initializeSeasonalEffects() {
  // spring
  createCherryBlossoms();
  
  // summer
  createFireflies();
  
  // autumn
  createAutumnLeaves();
  
  // winter
  createSnowflakes();
}

function createCherryBlossoms() {
  const canvas = document.querySelector('.spring-effect');
  const container = canvas.parentElement;
  
  while (canvas.firstChild) {
    canvas.removeChild(canvas.firstChild);
  }
  
  for (let i = 0; i < 30; i++) {
    const petal = document.createElement('div');
    petal.classList.add('petal');
    
    // size
    const size = Math.random() * 10 + 5;
    petal.style.width = `${size}px`;
    petal.style.height = `${size}px`;
    
    // position
    petal.style.left = `${Math.random() * 100}%`;
    
    // animation duration
    const duration = Math.random() * 10 + 5;
    petal.style.animationDuration = `${duration}s`;
    
    // delay
    petal.style.animationDelay = `${Math.random() * 10}s`;
    
    canvas.appendChild(petal);
  }
}

function createFireflies() {
  const canvas = document.querySelector('.summer-effect');
  const container = canvas.parentElement;
  
  while (canvas.firstChild) {
    canvas.removeChild(canvas.firstChild);
  }

  for (let i = 0; i < 20; i++) {
    const firefly = document.createElement('div');
    firefly.classList.add('firefly');
    
    // position
    firefly.style.left = `${Math.random() * 100}%`;
    firefly.style.top = `${Math.random() * 100}%`;
    
    // animation duration
    const duration = Math.random() * 4 + 2;
    firefly.style.animationDuration = `${duration}s`;
    
    // delay
    firefly.style.animationDelay = `${Math.random() * 5}s`;
    
    canvas.appendChild(firefly);
  }
}

function createAutumnLeaves() {
  const canvas = document.querySelector('.autumn-effect');
  const container = canvas.parentElement;
  
  while (canvas.firstChild) {
    canvas.removeChild(canvas.firstChild);
  }
  
  // colors
  const colors = ['red', 'orange', 'yellow'];
  
  for (let i = 0; i < 25; i++) {
    const leaf = document.createElement('div');
    leaf.classList.add('leaf');
    
    //  color
    const colorClass = colors[Math.floor(Math.random() * colors.length)];
    leaf.classList.add(colorClass);
    
    //  size
    const size = Math.random() * 15 + 10;
    leaf.style.width = `${size}px`;
    leaf.style.height = `${size}px`;
    
    //  position
    leaf.style.left = `${Math.random() * 100}%`;
    
    //  animation duration
    const duration = Math.random() * 10 + 8;
    leaf.style.animationDuration = `${duration}s`;
    
    //  delay
    leaf.style.animationDelay = `${Math.random() * 10}s`;
    
    canvas.appendChild(leaf);
  }
}

function createSnowflakes() {
  const canvas = document.querySelector('.winter-effect');
  const container = canvas.parentElement;
  
  while (canvas.firstChild) {
    canvas.removeChild(canvas.firstChild);
  }
  
  // characters
  const snowflakes = ['❄', '❅', '❆', '✻', '✼', '❉'];
  
  for (let i = 0; i < 40; i++) {
    const snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');
    
    // snowflake character
    snowflake.textContent = snowflakes[Math.floor(Math.random() * snowflakes.length)];
    
    // size
    const size = Math.random() * 15 + 10;
    snowflake.style.fontSize = `${size}px`;
    
    // position
    snowflake.style.left = `${Math.random() * 100}%`;
    
    // animation duration
    const duration = Math.random() * 15 + 10;
    snowflake.style.animationDuration = `${duration}s`;
    
    // delay
    snowflake.style.animationDelay = `${Math.random() * 10}s`;
    
    canvas.appendChild(snowflake);
  }
}

// Fortune Cookie Functionality
function initFortuneCookie() {
  const fortuneCookie = document.querySelector('.fortune-cookie');
  const fortuneModal = document.querySelector('.fortune-modal');
  const fortuneContent = document.querySelector('.fortune-content');
  const fortuneText = document.querySelector('.fortune-text');
  const closeFortuneBtn = document.querySelector('.close-fortune');
  const sparkleContainer = document.querySelector('.sparkle-container');

  const fortunes = [
    "A journey to Japan will bring you unexpected happiness.",
    "The cherry blossoms will guide you to your destiny.",
    "You will discover a flavor that makes your soul do a happy dance. Hint: it involves rice and magic.",
    "Your luck is rising! Take the next corner—it might just lead to a shrine... or a cat café.",
    "A beckoning cat waves at you—not for money, but for good vibes and even better ramen.",
    "Mount Fuji watches over your dreams and aspirations.",
    "A chance encounter in Shibuya will lead to friendship.",
    "Cross the next street. Not just traffic—there's a story waiting on the other side.",
    "Love may blossom on your next train stop. Or maybe it's just sakura season playing tricks again.",
    "Forget the train ticket—your real journey starts when you get lost on purpose."
  ];

  let canClick = true;
  let sparkleInterval;

  function createSparkles() {
    sparkleContainer.innerHTML = '';
    const numSparkles = 30; // Increased number of sparkles
    
    // Create sparkles in a circular pattern
    for (let i = 0; i < numSparkles; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      
      // Calculate position in a circular pattern
      const angle = (i / numSparkles) * Math.PI * 2;
      const radius = 30 + Math.random() * 100; // Random radius between 30% and 130%
      const x = 50 + Math.cos(angle) * radius;
      const y = 50 + Math.sin(angle) * radius;
      
      sparkle.style.left = x + '%';
      sparkle.style.top = y + '%';
      sparkle.style.animationDelay = (Math.random() * 1) + 's';
      sparkle.style.width = (12 + Math.random() * 8) + 'px';
      sparkle.style.height = sparkle.style.width;
      
      sparkleContainer.appendChild(sparkle);
    }

    // Add some random sparkles
    for (let i = 0; i < 15; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      sparkle.style.left = Math.random() * 200 - 50 + '%';
      sparkle.style.top = Math.random() * 200 - 50 + '%';
      sparkle.style.animationDelay = (Math.random() * 1) + 's';
      sparkle.style.width = (10 + Math.random() * 5) + 'px';
      sparkle.style.height = sparkle.style.width;
      sparkleContainer.appendChild(sparkle);
    }
  }

  function openFortune() {
    if (!canClick) return;
    
    canClick = false;
    fortuneCookie.style.transform = 'scale(0.8) rotate(45deg)';
    
    setTimeout(() => {
      fortuneModal.style.display = 'flex';
      const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
      fortuneText.textContent = randomFortune;
      
      setTimeout(() => {
        fortuneContent.classList.add('show');
        createSparkles();
        
        // Continue creating sparkles while fortune is shown
        clearInterval(sparkleInterval);
        sparkleInterval = setInterval(() => {
          if (fortuneContent.classList.contains('show')) {
            createSparkles();
          } else {
            clearInterval(sparkleInterval);
          }
        }, 2000);
      }, 100);
      
      fortuneCookie.style.transform = 'scale(1) rotate(0deg)';
      setTimeout(() => {
        canClick = true;
      }, 1000);
    }, 500);
  }

  function closeFortune() {
    fortuneContent.classList.remove('show');
    clearInterval(sparkleInterval);
    
    // Fade out sparkles
    const sparkles = document.querySelectorAll('.sparkle');
    sparkles.forEach(sparkle => {
      sparkle.style.animation = 'none';
      sparkle.offsetHeight; // Force reflow
      sparkle.style.animation = 'sparkle 0.5s ease-out forwards';
    });
    
    setTimeout(() => {
      fortuneModal.style.display = 'none';
      sparkleContainer.innerHTML = '';
    }, 500);
  }

  // Event Listeners
  fortuneCookie.addEventListener('click', openFortune);
  closeFortuneBtn.addEventListener('click', closeFortune);
  fortuneModal.addEventListener('click', (e) => {
    if (e.target === fortuneModal) {
      closeFortune();
    }
  });
}

// Make sure to call initFortuneCookie when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initFortuneCookie();
});






