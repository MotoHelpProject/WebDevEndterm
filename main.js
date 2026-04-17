const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuBtnIcon = menuBtn.querySelector("i");

menuBtn.addEventListener("click", (e) =>{
    navLinks.classList.toggle("open");

    const isOpen = navLinks.classList.contains("open");
    menuBtnIcon.setAttribute("class", isOPen?"ri-close-line":"ri-menг-line")
});

navLinks.addEventListener("click", (e) => {
  navLinks.classList.remove("open");
  menuBtnIcon.setAttribute("class", "ri-menu-line");
});

const scrollRevealOption = {
    origin: "bottom",
    distance: "50px",
    duration: 1000,
}

ScrollReveal().reveal(".header__container h1", {
    ...scrollRevealOption,
});

ScrollReveal().reveal(".header__container img", {
    ...scrollRevealOption,
    delay:500,
});

/*ScrollReveal().reveal(".range_card",{
    duration: 1000,
    interval: 500,
});*/

ScrollReveal().reveal(".location__image img", {
    ...scrollRevealOption,
   origin: "right",
});
ScrollReveal().reveal(".location__content .section__header", {
    ...scrollRevealOption,
    delay:500,
});
ScrollReveal().reveal(".location__content p", {
    ...scrollRevealOption,
    delay:1000,
});

ScrollReveal().reveal(".story__card", {
    ...scrollRevealOption,
    interval: 500,
});

ScrollReveal().reveal(".download__image img", {
  ...scrollRevealOption,
  origin: "right",
});
ScrollReveal().reveal(".download__content .section__header", {
  ...scrollRevealOption,
  delay: 500,
});
ScrollReveal().reveal(".download__links", {
  ...scrollRevealOption,
  delay: 1000,
});

document.getElementById("get-started").addEventListener("click", () => {
  window.location.href = "login.html";
});