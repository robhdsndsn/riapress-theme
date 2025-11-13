/**
 * addCollapsibleFooterMarkup
 */

// Store headingTagName globally
let headingTagName;
window.addEventListener('DOMContentLoaded', (event) => {
    // Select the first .is-style-collapsible heading
    const heading = document.querySelector('.is-style-collapsible');
    if (heading && !headingTagName) {
        headingTagName = "h3";
    }
    // console.log(headingTagName);
});

// addCollapsiblesFooterMarkup
function addCollapsiblesFooterMarkup() {
    const headings = document.querySelectorAll('.is-style-collapsible');

    headings.forEach((heading, index) => {
        const button = document.createElement('button');

        // Start with the 'collapsible-toggle' class
        let classes = ['collapsible-toggle'];
        // Loop through the headings to collect classes
        headings.forEach(heading => {
            let headingClasses = Array.from(heading.classList);
            classes = classes.concat(headingClasses);
        });

        // Remove duplicate classes
        classes = [...new Set(classes)];
        button.className = classes.join(' ');
        button.setAttribute('aria-expanded', 'false');
        button.innerHTML = heading.innerHTML;
        button.id = `collapsible-toggle-${index}`;
        heading.parentNode.insertBefore(button, heading);
        heading.remove();
        var ulElement = button.nextElementSibling;
        if (ulElement) {
            ulElement.classList.add('is-style-collapsible', 'collapsible-content');
        }
    });
}

// removeCollapsiblesFooterMarkup
function removeCollapsiblesFooterMarkup() {
    const buttons = document.querySelectorAll('.collapsible-toggle');

    buttons.forEach((button) => {
        const heading = document.createElement(headingTagName);
        heading.className = button.className;
        heading.classList.remove('collapsible-toggle');
        heading.innerHTML = button.innerHTML;
        button.parentNode.insertBefore(heading, button);
        button.remove();
        var ulElement = heading.nextElementSibling;
        if (ulElement) {
            ulElement.classList.remove('is-style-collapsible', 'collapsible-content');
        }
    });
}

// initCollapsiblesFooter
function initCollapsiblesFooter() {
    const collapsible = document.querySelectorAll('.collapsible-toggle');
    for (let i = 0; i < collapsible.length; i++) {
        collapsible[i].onclick = function () {
            this.classList.toggle('is-active');
            this.nextElementSibling.classList.toggle('is-active');

            if (this.getAttribute('aria-expanded') === 'true') {
                this.setAttribute('aria-expanded', 'false');
            } else {
                this.setAttribute('aria-expanded', 'true');
            }
        };
    }
}

// destroyCollapsiblesFooter
function destroyCollapsiblesFooter() {
    const collapsibles = document.querySelectorAll('.collapsible-toggle');
    for (let i = 0; i < collapsibles.length; i++) {
        collapsibles[i].onclick = null;
    }
}

// removeAllActiveClasses
function removeAllActiveClasses() {
    const activeElements = document.querySelectorAll('.is-active');
    activeElements.forEach(element => {
        element.classList.remove('is-active');
        if (element.hasAttribute('aria-expanded')) {
            element.setAttribute('aria-expanded', 'false');
        }
    });
}

function initializeCollapsiblesFooter() {
    removeAllActiveClasses(); // Remove all active classes before changing the markup

    const isMobile = window.innerWidth <= 781;
    const hasCollapsibleMarkup = document.querySelector('.collapsible-toggle') !== null;

    if (isMobile && !hasCollapsibleMarkup) {
        addCollapsiblesFooterMarkup();
        initCollapsiblesFooter();
    } else if (!isMobile && hasCollapsibleMarkup) {
        removeCollapsiblesFooterMarkup();
        destroyCollapsiblesFooter();
    }
}

document.addEventListener('DOMContentLoaded', function () {
    initializeCollapsiblesFooter();
});

window.onresize = function () {
    initializeCollapsiblesFooter();
};
