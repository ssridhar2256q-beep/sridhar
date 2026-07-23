const stages = [...document.querySelectorAll(".stage")];
const nextButtons = document.querySelectorAll("[data-next]");
const replayButton = document.querySelector("#replay");
const celebrateButton = document.querySelector("#celebrate");
const thankWhatsapp = document.querySelector("#thank-whatsapp");
const unlockFinalButton = document.querySelector("#unlock-final");
const lovePhoto = document.querySelector("#love-photo");
const heartArena = document.querySelector("#heart-arena");
const scoreDisplay = document.querySelector("#score");
const catchMessage = document.querySelector("#catch-message");
const canvas = document.querySelector("#confetti");
const ctx = canvas.getContext("2d");
const FRIEND_NAME = "Thangameyyy...🎀";

const params = new URLSearchParams(window.location.search);
const friendName = params.get("name") || localStorage.getItem("birthdayFriendName") || FRIEND_NAME;
const colors = ["#fffdf8", "#4b2617", "#ffffff", "#6b3823"];
const heartImages = [
  "lover-bg.jpeg",
  "IMG_20260720_221357_066.jpg",
  "IMG_20260720_224706_283.jpg",
];
let pieces = [];
let animationFrame;
let score = 0;
let heartImageIndex = 0;
const catchMessages = [
  "Super chlm, first heart catch pannitta... 💖",
  "Yeththana time paththalum un face salichu pogathu chlm... 😍",
  "Nee appudiye na varapppa sirichutte alaga pappala chlm pudikkum... 🫂",
  "Nee alaga tha chlm irukka nambu di yen alagiye... ✨",
  "5 hearts complete! Un final surprise ready... 🎉",
];

document.querySelectorAll("[data-friend-name]").forEach((node) => {
  node.textContent = friendName;
});

if (thankWhatsapp) {
  const whatsappNumber = "919789484195";
  const thankMessage = `Thank you so much for this beautiful birthday surprise. I love you too!`;
  thankWhatsapp.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(thankMessage)}`;
}

function showStage(id) {
  stages.forEach((stage) => stage.classList.toggle("is-active", stage.id === id));
  launchConfetti(110);

  if (id === "stage-game") {
    startHeartGame();
  }
}

nextButtons.forEach((button) => {
  button.addEventListener("click", () => showStage(button.dataset.next));
});

replayButton.addEventListener("click", () => showStage("stage-intro"));
celebrateButton.addEventListener("click", () => launchConfetti(180));

localStorage.removeItem("birthdayLovePhoto");

function startHeartGame() {
  score = 0;
  heartImageIndex = 0;
  scoreDisplay.textContent = score;
  catchMessage.textContent = "First heart-a catch pannu chlm... 💖";
  unlockFinalButton.classList.add("hidden");
  heartArena.innerHTML = "";

  for (let index = 0; index < 5; index += 1) {
    window.setTimeout(spawnHeart, index * 120);
  }
}

function spawnHeart() {
  if (score >= 5) {
    return;
  }

  const heart = document.createElement("button");
  const arenaRect = heartArena.getBoundingClientRect();
  const size = window.innerWidth <= 720 ? 64 : 60;
  const maxX = Math.max(arenaRect.width - size, 0);
  const maxY = Math.max(arenaRect.height - size, 0);

  heart.type = "button";
  heart.className = "heart";
  heart.setAttribute("aria-label", "Catch heart");
  heart.style.backgroundImage = `url("${heartImages[heartImageIndex % heartImages.length]}")`;
  heart.style.left = `${Math.random() * maxX}px`;
  heart.style.top = `${Math.random() * maxY}px`;
  heart.style.animationDuration = `${2.6 + Math.random() * 1.8}s`;
  heart.style.animationDelay = `${-Math.random() * 2}s`;
  heartImageIndex += 1;

  heart.addEventListener("click", () => {
    heart.remove();
    score += 1;
    scoreDisplay.textContent = score;
    catchMessage.textContent = catchMessages[score - 1];
    launchConfetti(18);

    if (score >= 5) {
      unlockFinalButton.classList.remove("hidden");
      launchConfetti(140);
    }
  });

  heartArena.appendChild(heart);
}

function resizeCanvas() {
  const scale = window.devicePixelRatio || 1;
  canvas.width = Math.floor(window.innerWidth * scale);
  canvas.height = Math.floor(window.innerHeight * scale);
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
}

function launchConfetti(count) {
  const width = window.innerWidth;
  pieces = [
    ...pieces,
    ...Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: -20 - Math.random() * 120,
      size: 7 + Math.random() * 9,
      color: colors[Math.floor(Math.random() * colors.length)],
      velocityX: -3 + Math.random() * 6,
      velocityY: 1 + Math.random() * 2.5,
      rotation: Math.random() * 360,
      spin: -8 + Math.random() * 16,
    })),
  ];

  if (!animationFrame) {
    animateConfetti();
  }
}

function animateConfetti() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  pieces = pieces
    .map((piece) => ({
      ...piece,
      x: piece.x + piece.velocityX,
      y: piece.y + piece.velocityY,
      velocityY: piece.velocityY + 0.02,
      rotation: piece.rotation + piece.spin,
    }))
    .filter((piece) => piece.y < window.innerHeight + 30);

  pieces.forEach((piece) => {
    ctx.save();
    ctx.translate(piece.x, piece.y);
    ctx.fillStyle = piece.color;
    const size = piece.size;
    ctx.beginPath();
    ctx.moveTo(0, size * 0.45);
    ctx.bezierCurveTo(-size * 0.9, -size * 0.1, -size * 0.55, -size * 0.75, 0, -size * 0.25);
    ctx.bezierCurveTo(size * 0.55, -size * 0.75, size * 0.9, -size * 0.1, 0, size * 0.45);
    ctx.fill();
    ctx.strokeStyle = "#3a1d12";
    ctx.lineWidth = Math.max(1, size * 0.12);
    ctx.stroke();
    ctx.restore();
  });

  if (pieces.length) {
    animationFrame = requestAnimationFrame(animateConfetti);
  } else {
    animationFrame = null;
  }
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
setTimeout(() => launchConfetti(80), 400);
