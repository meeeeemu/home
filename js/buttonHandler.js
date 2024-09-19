import anime from 'animejs';
import { changeColor } from './main.js';

const homeButton = document.getElementById('home-button');
const aboutButton = document.getElementById('about-button');
const contactButton = document.getElementById('contact-button');
const usageButton = document.getElementById('usage-button');
const linksButton = document.getElementById('links-button');

let currentPage = '';
let transitionStatus = false;

function showPage(id, color) {
    if (transitionStatus) return;

    if (currentPage && currentPage.classList.contains(id)) return;

    transitionStatus = true;

    changeColor(color)

    if (currentPage) {
        anime({
            targets: currentPage,
            scale: [1, 0.8],
            opacity: [1, 0],
            easing: 'easeInExpo',
            duration: 1000,
            translateY: [0, 600],
            complete: function () {
                currentPage.style.display = 'none';
                showNewPage(id);
            }
        })
    } else {
        showNewPage(id);
    }
}

function showNewPage(id) {

    const selPage = document.querySelector("." + id);
    
    if (selPage) {
        if (currentPage == selPage) return;
        selPage.style.display = 'block';
        currentPage = selPage;
        anime({
            targets: selPage,
            scale: [0.8, 1],
            opacity: [0, 1],
            translateY: [-600, 0],
            easing: 'easeOutExpo',
            duration: 1000,
            complete: function () {
                transitionStatus = false;
            }
        });
    }
}

homeButton.addEventListener('click', () => showPage('page1', '#5F9EA0'));
aboutButton.addEventListener('click', () => showPage('page2', '#7393B3'));
contactButton.addEventListener('click', () => showPage('page3', '#5D3FD3'));
usageButton.addEventListener('click', () => showPage('page4', '#FFB6C1'));
linksButton.addEventListener('click', () => showPage('page5', '#D2042D'));
