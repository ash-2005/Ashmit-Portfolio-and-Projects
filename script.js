function scrollToProjects() {
    document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
  }
  document.getElementById("darkModeToggle").addEventListener("click", function () {
    document.body.classList.toggle("dark");
    const icon = this.textContent;
    this.textContent = icon === "🌙" ? "☀️" : "🌙";
  });
  document.getElementById("contactForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let message = document.getElementById("message").value.trim();
    let formMessage = document.getElementById("formMessage");
  
    if (name === "" || email === "" || message === "") {
      formMessage.textContent = "Please fill in all fields.";
      formMessage.style.color = "red";
    } else {
      formMessage.textContent = "Thanks! Message sent successfully.";
      formMessage.style.color = "green";
      this.reset();
    }
  });
  function revealOnScroll() {
    const reveals = document.querySelectorAll(".reveal");
  
    reveals.forEach((section) => {
      const windowHeight = window.innerHeight;
      const revealTop = section.getBoundingClientRect().top;
      const revealPoint = 100;
  
      if (revealTop < windowHeight - revealPoint) {
        section.classList.add("active");
      } else {
        section.classList.remove("active");
      }
    });
  }
  
  window.addEventListener("scroll", revealOnScroll);
  const backToTopBtn = document.getElementById("backToTop");

window.onscroll = function () {
  if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
    backToTopBtn.style.display = "block";
  } else {
    backToTopBtn.style.display = "none";
  }
};

backToTopBtn.addEventListener("click", () => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
});
const phrases = ["Ashmit", "a Developer", "a Tech Explorer"];
let currentPhrase = 0;
let currentLetter = 0;

function typeText() {
  const textElement = document.getElementById("typed-text");
  if (currentLetter <= phrases[currentPhrase].length) {
    textElement.textContent = phrases[currentPhrase].substring(0, currentLetter++);
    setTimeout(typeText, 100);
  } else {
    setTimeout(() => {
      currentLetter = 0;
      currentPhrase = (currentPhrase + 1) % phrases.length;
      typeText();
    }, 2000);
  }
}

typeText();

function openModal(title, description, link) {
    document.getElementById("modal-title").textContent = title;
    document.getElementById("modal-description").textContent = description;
    document.getElementById("modal-link").href = link;
    document.getElementById("modal").style.display = "block";
  }
  
  
  document.querySelector(".close").addEventListener("click", () => {
    document.getElementById("modal").style.display = "none";
  });
  
  window.addEventListener("click", (event) => {
    if (event.target == document.getElementById("modal")) {
      document.getElementById("modal").style.display = "none";
    }
  });

 
  document.querySelector(".close").addEventListener("click", () => {
    document.getElementById("modal").style.display = "none";
  });
  

  window.addEventListener("click", (event) => {
    if (event.target == document.getElementById("modal")) {
      document.getElementById("modal").style.display = "none";
    }
  });

window.addEventListener('scroll', function() {
  const elements = document.querySelectorAll('.fade-in');
  elements.forEach(function(element) {
    const rect = element.getBoundingClientRect();
    if (rect.top <= window.innerHeight && rect.bottom >= 0) {
      element.classList.add('visible');
    }
  });
});
