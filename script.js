document.addEventListener("DOMContentLoaded", () => {
  const envelope = document.getElementById("envelope");
  const seal = document.getElementById("seal");
  const hint = document.getElementById("openHint");
  const mainContent = document.getElementById("mainContent");
  const logoSmall = document.getElementById("logoSmall");
  const bgAudio = document.getElementById("bgAudio");
  const petalsContainer = document.getElementById("petals");

  const nameInput = document.getElementById("qname");
  const photoInput = document.getElementById("qphoto");
  const guestPreview = document.getElementById("guestPreview");
  const inviteText = document.getElementById("inviteText");
  const createLinkBtn = document.getElementById("createLink");
  const previewGuestBtn = document.getElementById("previewGuest");

  /* ---------------- ENVELOPE OPEN ---------------- */
  const openEnvelope = () => {
    envelope.classList.add("opened");
    hint.style.display = "none";
    setTimeout(() => {
      document.querySelector(".center-wrap").style.display = "none";
      mainContent.classList.remove("hidden");
      logoSmall.style.display = "block";
      startPetals();
      if (bgAudio) {
        bgAudio.volume = 0.7;
        bgAudio.play().catch(() => {});
      }
      revealPanels();
    }, 1000);
  };

  envelope.addEventListener("click", openEnvelope);
  seal.addEventListener("click", openEnvelope);
  hint.addEventListener("click", openEnvelope);

  /* ---------------- PETAL FALL ---------------- */
  function startPetals() {
    const numPetals = 15;
    for (let i = 0; i < numPetals; i++) {
      createPetal();
    }
    setInterval(() => {
      createPetal();
    }, 800);
  }

  function createPetal() {
    const petal = document.createElement("div");
    petal.className = "petal";
    const size = Math.random() * 16 + 10;
    petal.style.width = `${size}px`;
    petal.style.height = `${size}px`;
    petal.style.left = Math.random() * 100 + "vw";
    petal.style.animationDuration = 8 + Math.random() * 6 + "s";
    petal.style.animationDelay = Math.random() * 5 + "s";
    petalsContainer.appendChild(petal);
    setTimeout(() => petal.remove(), 14000);
  }

  /* ---------------- SCROLL FADE ---------------- */
  function revealPanels() {
    const panels = document.querySelectorAll(".panel");
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );
    panels.forEach(panel => observer.observe(panel));
  }

  /* ---------------- INVITE TEXT ---------------- */
  function updateInviteText(name = "anh", hasPhoto = false, photoURL = "") {
    let content = `
      <p>Anh <strong>${name}</strong> thân mến,</p>
      <p>Vào sáng <mark>thứ Sáu, ngày 31/10/2025</mark>, em sẽ chính thức tốt nghiệp <mark>Cử nhân Xét nghiệm Y học</mark> tại <mark>Trường Đại học Y tế Công cộng</mark>.</p>
      <p>Sau buổi lễ, lúc <mark>11h–12h</mark>, em sẽ đợi anh ở vườn trước cửa Nhà C hoặc ở sân bóng gần đó.</p>
      <p>Có anh ở đó sẽ vui hơn nhiều 🤍</p>
    `;
    if (hasPhoto && photoURL) {
      guestPreview.style.backgroundImage = `url(${photoURL})`;
    } else {
      guestPreview.style.backgroundImage = "none";
    }
    inviteText.innerHTML = content;
  }

  updateInviteText(); // default preview

  /* ---------------- PHOTO UPLOAD ---------------- */
  photoInput?.addEventListener("change", e => {
    const file = e.target.files[0];
    if (file) {
      const reader =
