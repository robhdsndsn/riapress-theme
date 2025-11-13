import { store, getContext, getElement } from '@wordpress/interactivity';

// Shared submenu toggle logic
function toggleSubmenuState(toggleBtn, nav) {
    const isOpen = toggleBtn.getAttribute('aria-expanded') === 'true';
    const newState = !isOpen;
    
    const currentSubmenuItem = toggleBtn.closest('.wp-block-navigation-submenu');
    const currentSubmenu = currentSubmenuItem?.querySelector('.wp-block-navigation__submenu-container');
    
    // Close all other submenus first (preserve one-at-a-time behavior)
    const allSubmenuItems = nav.querySelectorAll('.wp-block-navigation-submenu');
    allSubmenuItems.forEach(item => {
        if (item !== currentSubmenuItem) {
            const otherToggleBtn = item.querySelector('.wp-block-navigation__submenu-icon');
            const otherSubmenu = item.querySelector('.wp-block-navigation__submenu-container');
            
            if (otherToggleBtn && otherSubmenu) {
                otherToggleBtn.setAttribute('aria-expanded', 'false');
                otherSubmenu.style.display = 'none';
                item.classList.remove('is-open');
            }
        }
    });
    
    // Update current submenu state
    toggleBtn.setAttribute('aria-expanded', String(newState));
    
    if (currentSubmenu && currentSubmenuItem) {
        if (newState) {
            currentSubmenu.style.display = 'block';
            currentSubmenuItem.classList.add('is-open');
        } else {
            currentSubmenu.style.display = 'none';
            currentSubmenuItem.classList.remove('is-open');
        }
    }
    
    return newState;
}

// Shared hover prevention function
function preventHoverEvent(event) {
    event.stopImmediatePropagation();
    event.preventDefault();
    return false;
}

// Initialize Interactivity API store
const storeObj = store('zp/offcanvas-navigation', {
        state: {
            isOpen: false,
            lastFocusedElement: null,
            get scrollbarWidth() {
                return window.innerWidth - document.documentElement.clientWidth;
            }
        },
        
        actions: {
            openOffcanvas: function(event) {
                event.preventDefault();
                
                // Store last focused element for accessibility
                state.lastFocusedElement = document.activeElement !== event.target ? document.activeElement : null;
                
                // Update state
                state.isOpen = true;
                
				// Apply body styles for scroll prevention
                const body = document.body;
                const scrollbarWidth = state.scrollbarWidth;
                
                body.classList.add('offcanvas-is-active');
                body.style.overflow = 'hidden';
                body.style.paddingRight = `${scrollbarWidth}px`;
                
                // Update CSS custom property for content positioning
                document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
                
                // Remove aria-hidden when opening
                const offcanvas = document.getElementById('offcanvas');
                if (offcanvas) {
                    offcanvas.setAttribute('aria-hidden', 'false');
                }
                
                // Focus management - slight delay to allow DOM updates
                setTimeout(() => {
                    const firstFocusable = offcanvas?.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                    if (firstFocusable) {
                        firstFocusable.focus();
                    }
                }, 10);
                
                // Add keyboard event listener for focus trapping
                actions.addFocusTrap();
            },
            
            closeOffcanvas: function(event) {
                event.preventDefault();
                
                // Remove focus trap first
                actions.removeFocusTrap();
                
                // Force focus out of offcanvas immediately to prevent aria-hidden accessibility warning
                // First, explicitly blur the current element
                if (document.activeElement && document.activeElement.blur) {
                    document.activeElement.blur();
                }
                
                // Focus management: return focus to appropriate element
                const openBtn = document.getElementById('offcanvas-open-toggle');
                const focusTarget = state.lastFocusedElement && state.lastFocusedElement !== event.target 
                    ? state.lastFocusedElement 
                    : openBtn;
                
                if (focusTarget) {
                    // Focus with retry for reliability
                    focusTarget.focus();
                    
                    // If focus didn't work immediately, try again with small delay
                    if (document.activeElement !== focusTarget) {
                        setTimeout(() => {
                            focusTarget.focus();
                        }, 10);
                    }
                }
                
                // Update state to trigger hiding
                state.isOpen = false;
                
                // Set aria-hidden immediately (no timeout needed thanks to proper focus management)
                const offcanvas = document.getElementById('offcanvas');
                if (offcanvas) {
                    offcanvas.setAttribute('aria-hidden', 'true');
                }
                
                // Remove body styles
                const body = document.body;
                body.classList.remove('offcanvas-is-active');
                body.style.overflow = '';
                body.style.paddingRight = '';
            },
            
            handleOutsideClick: function(event) {
                // Close if clicking on the backdrop (offcanvas element itself)
                if (event.target.id === 'offcanvas') {
                    actions.closeOffcanvas(event);
                }
            },
            
            handleEscapeKey: function(event) {
                if (event.key === 'Escape') {
                    if (state.isOpen) {
                        actions.closeOffcanvas(event);
                    }
                }
            },
            
            addFocusTrap: function() {
                document.addEventListener('keydown', actions.trapFocus);
                document.addEventListener('keydown', actions.handleEscapeKey);
            },
            
            removeFocusTrap: function() {
                document.removeEventListener('keydown', actions.trapFocus);
                document.removeEventListener('keydown', actions.handleEscapeKey);
            },
            
            trapFocus: function(event) {
                if (event.key !== 'Tab') return;
                
                const offcanvas = document.getElementById('offcanvas');
                if (!offcanvas || offcanvas.classList.contains('hidden')) return;
                
                const focusableElements = Array.from(offcanvas.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                ));
                
                if (focusableElements.length === 0) return;
                
                const firstFocusable = focusableElements[0];
                const lastFocusable = focusableElements[focusableElements.length - 1];
                
                if (event.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        event.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        event.preventDefault();
                        firstFocusable.focus();
                    }
                }
            },
            
            toggleSubmenu: function(event) {
                const { ref } = getElement();
                
                event.preventDefault();
                event.stopPropagation();
                
                const nav = ref.closest('.wp-block-navigation');
                const newState = toggleSubmenuState(ref, nav);
            },
            
            preventHover: preventHoverEvent
        }
    });

const { state, actions } = storeObj;

// Utility function to disable Interactivity API attributes
function disableInteractivityAPI(element) {
    const attributes = Array.from(element.attributes);
    attributes.forEach(attr => {
        if ((attr.name.startsWith('data-wp-on') || 
             attr.name.startsWith('data-wp-watch') || 
             attr.name.startsWith('data-wp-bind') ||
             attr.name === 'data-wp-interactive') && 
            !attr.name.includes('disabled')) {
            element.setAttribute(attr.name + '-disabled', attr.value);
            element.removeAttribute(attr.name);
        }
    });
}



// Enhanced navigation setup function
function setupOffcanvasNavigation(offCanvas) {
    const nav = offCanvas.querySelector('.wp-block-navigation');
    if (!nav || nav.hasAttribute('data-rp-enhanced')) return;
    
    nav.setAttribute('data-rp-enhanced', 'true');
    const submenuItems = nav.querySelectorAll('.wp-block-navigation-submenu');
    
    // Setup submenu items for Interactivity API
    submenuItems.forEach(item => {
        // Disable WordPress core navigation hover/click handlers
        disableInteractivityAPI(item);
        
        const toggleBtn = item.querySelector('.wp-block-navigation__submenu-icon');
        if (toggleBtn) {
            // Add our custom Interactivity API attributes
            toggleBtn.setAttribute('data-wp-interactive', 'zp/offcanvas-navigation');
            toggleBtn.setAttribute('data-wp-on-async--click', 'actions.toggleSubmenu');
            toggleBtn.setAttribute('data-wp-on-async--mouseenter', 'actions.preventHover');
            toggleBtn.setAttribute('data-wp-on-async--mouseleave', 'actions.preventHover');
        }
        
        // Add styling classes for click-only behavior
        item.classList.add('click-only-submenu');
        item.classList.remove('open-on-hover');
    });
}

// Main initialization - Setup navigation enhancement
document.addEventListener('DOMContentLoaded', function () {
    const offCanvas = document.getElementById('offcanvas');
    if (offCanvas) {
        setupOffcanvasNavigation(offCanvas);
    }
});
