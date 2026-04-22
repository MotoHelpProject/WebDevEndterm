import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

declare var ScrollReveal: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements AfterViewInit {

  isOpen = false;

  constructor(private router: Router) {}

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  ngAfterViewInit(): void {

    const scrollRevealOption = {
      origin: "bottom",
      distance: "50px",
      duration: 1000,
    };

    if (typeof ScrollReveal !== 'undefined') {

      ScrollReveal().reveal(".header__container h1", {
        ...scrollRevealOption,
      });

      ScrollReveal().reveal(".header__container img", {
        ...scrollRevealOption,
        delay: 500,
      });

      ScrollReveal().reveal(".location__image img", {
        ...scrollRevealOption,
        origin: "right",
      });

      ScrollReveal().reveal(".location__content .section__header", {
        ...scrollRevealOption,
        delay: 500,
      });

      ScrollReveal().reveal(".location__content p", {
        ...scrollRevealOption,
        delay: 1000,
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
    }
  }
}