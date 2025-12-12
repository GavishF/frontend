/**
 * KEYBOARD ACCESSIBILITY UTILITIES
 * ================================
 * Helper functions for keyboard navigation and accessibility.
 * 
 * Features:
 * - Focus management
 * - Keyboard event handling
 * - ARIA label generation
 * - Tab order management
 * - Screen reader support
 */

/**
 * Check if a keyboard event is an "activation" key
 * (Enter or Space - keys that should trigger actions)
 * @param {KeyboardEvent} event - The keyboard event
 * @returns {boolean} True if event is Enter or Space
 */
export function isActivationKey(event) {
    return event.key === 'Enter' || event.key === ' ';
}

/**
 * Check if user pressed Escape key
 * (Common for closing modals, dropdowns, etc.)
 * @param {KeyboardEvent} event - The keyboard event
 * @returns {boolean} True if Escape key pressed
 */
export function isEscapeKey(event) {
    return event.key === 'Escape';
}

/**
 * Check if user pressed arrow keys
 * (Common for navigation)
 * @param {KeyboardEvent} event - The keyboard event
 * @returns {string} 'up', 'down', 'left', 'right', or null
 */
export function getArrowKeyDirection(event) {
    switch (event.key) {
        case 'ArrowUp':
            return 'up';
        case 'ArrowDown':
            return 'down';
        case 'ArrowLeft':
            return 'left';
        case 'ArrowRight':
            return 'right';
        default:
            return null;
    }
}

/**
 * Check if Tab key was pressed
 * @param {KeyboardEvent} event - The keyboard event
 * @returns {boolean} True if Tab key pressed
 */
export function isTabKey(event) {
    return event.key === 'Tab';
}

/**
 * Set focus to an element
 * Useful for managing focus in modals
 * @param {HTMLElement} element - Element to focus
 * @param {boolean} smooth - Use smooth scroll (default: false)
 */
export function setFocus(element, smooth = false) {
    if (!element) return;
    
    if (smooth) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    setTimeout(() => element.focus(), smooth ? 300 : 0);
}

/**
 * Return focus to previously focused element
 * Call this before closing a modal
 * @param {HTMLElement} previousElement - Element to return focus to
 */
export function restoreFocus(previousElement) {
    if (previousElement && typeof previousElement.focus === 'function') {
        previousElement.focus();
    }
}

/**
 * Get all focusable elements within a container
 * Useful for managing focus within a modal
 * @param {HTMLElement} container - Container element
 * @returns {Array<HTMLElement>} Array of focusable elements
 */
export function getFocusableElements(container) {
    if (!container) return [];

    const focusableSelectors = [
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[href]',
        '[tabindex]:not([tabindex="-1"])',
    ].join(',');

    return Array.from(container.querySelectorAll(focusableSelectors));
}

/**
 * Trap focus within a modal
 * Prevents Tab key from escaping modal
 * @param {HTMLElement} modal - Modal element
 * @param {KeyboardEvent} event - Keyboard event
 */
export function trapFocus(modal, event) {
    if (!isTabKey(event)) return;

    const focusableElements = getFocusableElements(modal);
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    // Tab forward from last element → go to first
    if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
    }

    // Shift+Tab backward from first element → go to last
    if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
    }
}

/**
 * Announce message to screen readers
 * Creates a temporary ARIA live region
 * @param {string} message - Message to announce
 * @param {string} priority - 'polite' (default) or 'assertive'
 */
export function announceToScreenReader(message, priority = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only'; // Hide visually but keep for screen readers
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove after announcement is read
    setTimeout(() => announcement.remove(), 1000);
}

/**
 * Generate ARIA label for status
 * @param {boolean} isValid - Is the input valid?
 * @param {string} fieldName - Name of the field
 * @returns {string} ARIA label text
 */
export function generateAriaLabel(isValid, fieldName) {
    if (isValid === null) return `Enter your ${fieldName}`;
    if (isValid) return `${fieldName} is valid`;
    return `${fieldName} is invalid`;
}

/**
 * Create keyboard navigation for list items
 * Arrow keys to navigate, Enter to activate
 * @param {Array<HTMLElement>} items - List of items
 * @param {number} startIndex - Starting index (default: 0)
 * @returns {Object} Object with methods for navigation
 */
export function createKeyboardNavigation(items, startIndex = 0) {
    let currentIndex = startIndex;

    const navigate = (direction) => {
        if (direction === 'up') {
            currentIndex = (currentIndex - 1 + items.length) % items.length;
        } else if (direction === 'down') {
            currentIndex = (currentIndex + 1) % items.length;
        }
        setFocus(items[currentIndex]);
        return items[currentIndex];
    };

    const handleKeyDown = (event) => {
        const direction = getArrowKeyDirection(event);
        if (direction === 'up' || direction === 'down') {
            event.preventDefault();
            navigate(direction);
        }
    };

    return {
        navigate,
        handleKeyDown,
        getCurrentItem: () => items[currentIndex],
        getCurrentIndex: () => currentIndex,
    };
}

/**
 * Make any element keyboard-accessible
 * Adds click listener and keyboard support
 * @param {HTMLElement} element - Element to make accessible
 * @param {Function} onActivate - Callback when activated
 */
export function makeKeyboardAccessible(element, onActivate) {
    if (!element) return;

    // Make sure element is focusable
    if (!element.hasAttribute('tabindex')) {
        element.setAttribute('tabindex', '0');
    }

    // Add role if missing
    if (!element.hasAttribute('role')) {
        element.setAttribute('role', 'button');
    }

    // Add keyboard support
    element.addEventListener('keydown', (event) => {
        if (isActivationKey(event)) {
            event.preventDefault();
            onActivate(event);
        }
    });

    // Keep click listener for mouse users
    element.addEventListener('click', (event) => {
        onActivate(event);
    });
}

/**
 * Skip to main content link
 * Add this to the top of your page for accessibility
 * <a href="#main" className="skip-to-main">Skip to main content</a>
 * @param {string} mainSelector - CSS selector for main content
 */
export function setupSkipLink(mainSelector = '#main') {
    const skipLink = document.querySelector('[href="' + mainSelector + '"]');
    if (!skipLink) return;

    skipLink.addEventListener('click', (event) => {
        event.preventDefault();
        const mainContent = document.querySelector(mainSelector);
        if (mainContent) {
            setFocus(mainContent, true);
            // Announce to screen readers
            announceToScreenReader('Skipped to main content');
        }
    });
}

/**
 * Create accessible form group
 * @param {string} fieldName - Name of the field
 * @param {boolean} isRequired - Is field required?
 * @param {string} errorMessage - Error message (if any)
 * @returns {Object} ARIA attributes for form field
 */
export function createFormFieldAriaAttrs(fieldName, isRequired, errorMessage) {
    return {
        'aria-label': fieldName + (isRequired ? ' (required)' : ''),
        'aria-required': isRequired,
        'aria-invalid': !!errorMessage,
        'aria-describedby': errorMessage ? `${fieldName}-error` : undefined,
    };
}

/**
 * Detect if user prefers reduced motion
 * Respect accessibility preferences
 * @returns {boolean} True if user prefers reduced motion
 */
export function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Apply motion safely
 * Use reduced motion for users who prefer it
 * @param {string} transitionName - CSS animation/transition name
 * @returns {string} Either the transition name or 'none'
 */
export function getSafeTransition(transitionName) {
    return prefersReducedMotion() ? 'none' : transitionName;
}

export default {
    isActivationKey,
    isEscapeKey,
    getArrowKeyDirection,
    isTabKey,
    setFocus,
    restoreFocus,
    getFocusableElements,
    trapFocus,
    announceToScreenReader,
    generateAriaLabel,
    createKeyboardNavigation,
    makeKeyboardAccessible,
    setupSkipLink,
    createFormFieldAriaAttrs,
    prefersReducedMotion,
    getSafeTransition,
};
