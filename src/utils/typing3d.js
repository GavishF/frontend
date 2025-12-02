// 3D Typing Effect Handler
export function init3DTyping() {
  let typingTimeout;

  const handleInput = (e) => {
    const element = e.target;
    
    // Add typing class for animation
    element.classList.add('typing');
    
    // Clear previous timeout
    clearTimeout(typingTimeout);
    
    // Remove typing class after animation completes
    typingTimeout = setTimeout(() => {
      element.classList.remove('typing');
    }, 150);
  };

  // Add event listeners to all input elements
  const inputs = document.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    // Wrap in 3d container if not already wrapped
    if (!input.parentElement.classList.contains('input-3d')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'input-3d';
      input.parentNode.insertBefore(wrapper, input);
      wrapper.appendChild(input);
    }
    
    input.addEventListener('input', handleInput);
    input.addEventListener('keydown', handleInput);
  });

  // Watch for new inputs added dynamically
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          const newInputs = node.querySelectorAll ? 
            node.querySelectorAll('input, textarea, select') : 
            (node.matches && node.matches('input, textarea, select') ? [node] : []);
          
          newInputs.forEach(input => {
            if (!input.parentElement.classList.contains('input-3d')) {
              const wrapper = document.createElement('div');
              wrapper.className = 'input-3d';
              input.parentNode.insertBefore(wrapper, input);
              wrapper.appendChild(input);
            }
            input.addEventListener('input', handleInput);
            input.addEventListener('keydown', handleInput);
          });
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Cleanup function
  return () => {
    inputs.forEach(input => {
      input.removeEventListener('input', handleInput);
      input.removeEventListener('keydown', handleInput);
    });
    observer.disconnect();
  };
}
