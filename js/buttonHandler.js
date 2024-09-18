import anime from 'animejs';

const homeButton = document.getElementById('home-button');
const aboutButton = document.getElementById('about-button');
const contactButton = document.getElementById('contact-button');
const usageButton = document.getElementById('usage-button');
const linksButton = document.getElementById('links-button');

let currentPage = '';
let transitionStatus = false;

function showPage(id) {
    if (transitionStatus) return;

    if (currentPage && currentPage.classList.contains(id)) return;

    transitionStatus = true;

    if (currentPage) {
        anime({
            targets: currentPage,
            scale: [1, 0.9],
            opacity: [1, 0],
            easing: 'easeInOutQuad',
            duration: 1000,
            translateY: [0, 100],
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
            scale: [0.9, 1],
            opacity: [0, 1],
            translateY: [-100, 0],
            easing: 'easeInOutQuad',
            duration: 1000,
            complete: function () {
                transitionStatus = false;
            }
        });
    }
}

homeButton.addEventListener('click', () => showPage('page1'));
aboutButton.addEventListener('click', () => showPage('page2'));
contactButton.addEventListener('click', () => showPage('page3'));
usageButton.addEventListener('click', () => showPage('page4'));
linksButton.addEventListener('click', () => showPage('page5'));