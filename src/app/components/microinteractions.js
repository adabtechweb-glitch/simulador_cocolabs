/**
 * Dark Premium Microinteractions for Adab.Tech Solar Simulator
 * Energy-charged, precision-focused interaction behaviors
 */

// Brand colors
const BRAND_ORANGE = '#F49A2B';
const BRAND_BLUE = '#1AB8D7';
const DARK_BASE = '#0C2638';

// Timing constants (ms)
const TRANSITION_FAST = 200;
const TRANSITION_MEDIUM = 300;
const TRANSITION_SLOW = 400;

/**
 * Initialize all microinteractions
 */
export function initMicrointeractions() {
  initCardHoverEffects();
  initSliderInteractions();
  initCTAButtonEffects();
  initDataPanelEffects();
  initConsumptionDisplayEffects();
}

/**
 * Card hover effects - subtle glow emergence with elevation
 */
function initCardHoverEffects() {
  const cards = document.querySelectorAll('[data-card]');
  
  cards.forEach(card => {
    let glowElement = null;
    
    // Mouse enter - energy activation
    card.addEventListener('mouseenter', (e) => {
      const rect = card.getBoundingClientRect();
      
      // Create glow element if not exists
      if (!glowElement) {
        glowElement = document.createElement('div');
        glowElement.style.position = 'absolute';
        glowElement.style.inset = '-2px';
        glowElement.style.borderRadius = 'inherit';
        glowElement.style.opacity = '0';
        glowElement.style.pointerEvents = 'none';
        glowElement.style.transition = `opacity ${TRANSITION_MEDIUM}ms ease-out`;
        glowElement.style.background = `radial-gradient(circle at 50% 50%, rgba(244, 154, 43, 0.15) 0%, transparent 70%)`;
        glowElement.style.filter = 'blur(8px)';
        glowElement.style.zIndex = '0';
        
        if (card.style.position !== 'absolute' && card.style.position !== 'relative') {
          card.style.position = 'relative';
        }
        card.insertBefore(glowElement, card.firstChild);
      }
      
      // Animate glow emergence
      requestAnimationFrame(() => {
        glowElement.style.opacity = '1';
      });
      
      // Subtle elevation
      card.style.transition = `transform ${TRANSITION_MEDIUM}ms ease-out`;
      card.style.transform = 'translateY(-2px)';
    });
    
    // Mouse move - dynamic glow position
    card.addEventListener('mousemove', (e) => {
      if (!glowElement) return;
      
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      glowElement.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(244, 154, 43, 0.2) 0%, transparent 60%)`;
    });
    
    // Mouse leave - energy deactivation
    card.addEventListener('mouseleave', () => {
      if (glowElement) {
        glowElement.style.opacity = '0';
      }
      card.style.transform = 'translateY(0)';
    });
  });
}

/**
 * Slider interactions - energy flow during interaction
 */
function initSliderInteractions() {
  const slider = document.querySelector('.energy-slider');
  if (!slider) return;
  
  const consumptionDisplay = document.querySelector('[data-consumption-value]');
  let isDragging = false;
  let energyGlow = null;
  
  // Create persistent energy glow element
  const sliderContainer = slider.parentElement;
  energyGlow = document.createElement('div');
  energyGlow.style.position = 'absolute';
  energyGlow.style.inset = '-4px';
  energyGlow.style.borderRadius = '9999px';
  energyGlow.style.opacity = '0';
  energyGlow.style.pointerEvents = 'none';
  energyGlow.style.background = `linear-gradient(90deg, transparent 0%, ${BRAND_ORANGE}40 50%, transparent 100%)`;
  energyGlow.style.filter = 'blur(12px)';
  energyGlow.style.transition = `opacity ${TRANSITION_FAST}ms ease-out`;
  
  if (sliderContainer.style.position !== 'absolute' && sliderContainer.style.position !== 'relative') {
    sliderContainer.style.position = 'relative';
  }
  sliderContainer.appendChild(energyGlow);
  
  // Focus - energy activation
  slider.addEventListener('focus', () => {
    energyGlow.style.opacity = '0.5';
    slider.style.outline = 'none';
  });
  
  slider.addEventListener('blur', () => {
    if (!isDragging) {
      energyGlow.style.opacity = '0';
    }
  });
  
  // Start drag - intensify energy
  slider.addEventListener('mousedown', () => {
    isDragging = true;
    energyGlow.style.transition = `opacity ${TRANSITION_FAST}ms ease-out`;
    energyGlow.style.opacity = '0.8';
  });
  
  slider.addEventListener('touchstart', () => {
    isDragging = true;
    energyGlow.style.transition = `opacity ${TRANSITION_FAST}ms ease-out`;
    energyGlow.style.opacity = '0.8';
  });
  
  // During drag - maintain intensity
  slider.addEventListener('input', (e) => {
    if (isDragging) {
      // Update position-based glow
      const percentage = ((e.target.value - e.target.min) / (e.target.max - e.target.min)) * 100;
      energyGlow.style.background = `linear-gradient(90deg, transparent 0%, ${BRAND_ORANGE}60 ${percentage}%, transparent ${percentage + 20}%)`;
      
      // Pulse consumption display
      if (consumptionDisplay) {
        consumptionDisplay.style.transition = 'transform 100ms ease-out';
        consumptionDisplay.style.transform = 'scale(1.02)';
        
        setTimeout(() => {
          consumptionDisplay.style.transform = 'scale(1)';
        }, 100);
      }
    }
  });
  
  // End drag - settle energy
  const endDrag = () => {
    isDragging = false;
    energyGlow.style.transition = `opacity ${TRANSITION_MEDIUM}ms ease-out`;
    energyGlow.style.opacity = '0';
    energyGlow.style.background = `linear-gradient(90deg, transparent 0%, ${BRAND_ORANGE}40 50%, transparent 100%)`;
  };
  
  slider.addEventListener('mouseup', endDrag);
  slider.addEventListener('touchend', endDrag);
  document.addEventListener('mouseup', endDrag);
  document.addEventListener('touchend', endDrag);
  
  // Hover on slider - subtle energy preview
  slider.addEventListener('mouseenter', () => {
    if (!isDragging) {
      energyGlow.style.opacity = '0.3';
    }
  });
  
  slider.addEventListener('mouseleave', () => {
    if (!isDragging) {
      energyGlow.style.opacity = '0';
    }
  });
}

/**
 * CTA button effects - energy pulse and glow spread
 */
function initCTAButtonEffects() {
  const ctaButton = document.querySelector('[data-cta-button]');
  if (!ctaButton) return;
  
  let rippleGlow = null;
  
  // Create ripple glow container
  rippleGlow = document.createElement('div');
  rippleGlow.style.position = 'absolute';
  rippleGlow.style.inset = '0';
  rippleGlow.style.borderRadius = 'inherit';
  rippleGlow.style.overflow = 'hidden';
  rippleGlow.style.pointerEvents = 'none';
  rippleGlow.style.zIndex = '0';
  
  if (ctaButton.style.position !== 'absolute' && ctaButton.style.position !== 'relative') {
    ctaButton.style.position = 'relative';
  }
  ctaButton.insertBefore(rippleGlow, ctaButton.firstChild);
  
  // Ensure button content is above glow
  Array.from(ctaButton.children).forEach(child => {
    if (child !== rippleGlow) {
      child.style.position = 'relative';
      child.style.zIndex = '1';
    }
  });
  
  // Hover - orange glow spreads
  ctaButton.addEventListener('mouseenter', (e) => {
    const rect = ctaButton.getBoundingClientRect();
    
    // Create expanding glow
    const glow = document.createElement('div');
    glow.style.position = 'absolute';
    glow.style.width = '0';
    glow.style.height = '0';
    glow.style.borderRadius = '50%';
    glow.style.background = `radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)`;
    glow.style.transform = 'translate(-50%, -50%)';
    glow.style.transition = `all ${TRANSITION_SLOW}ms ease-out`;
    glow.style.left = '50%';
    glow.style.top = '50%';
    
    rippleGlow.appendChild(glow);
    
    // Animate expansion
    requestAnimationFrame(() => {
      glow.style.width = '200%';
      glow.style.height = '200%';
      glow.style.opacity = '0';
    });
    
    // Cleanup
    setTimeout(() => {
      if (glow.parentElement) {
        glow.remove();
      }
    }, TRANSITION_SLOW);
    
    // Enhance button shadow
    ctaButton.style.boxShadow = `0 0 30px rgba(244, 154, 43, 0.6), 0 8px 24px rgba(0, 0, 0, 0.4)`;
  });
  
  ctaButton.addEventListener('mouseleave', () => {
    ctaButton.style.boxShadow = '';
  });
  
  // Active - energy pulse
  ctaButton.addEventListener('mousedown', () => {
    ctaButton.style.transition = `transform ${TRANSITION_FAST}ms ease-out`;
    ctaButton.style.transform = 'scale(0.98)';
    
    // Create energy pulse
    const pulse = document.createElement('div');
    pulse.style.position = 'absolute';
    pulse.style.inset = '-4px';
    pulse.style.borderRadius = 'inherit';
    pulse.style.border = `2px solid ${BRAND_ORANGE}`;
    pulse.style.opacity = '1';
    pulse.style.pointerEvents = 'none';
    pulse.style.transition = `all ${TRANSITION_MEDIUM}ms ease-out`;
    
    rippleGlow.appendChild(pulse);
    
    requestAnimationFrame(() => {
      pulse.style.inset = '-12px';
      pulse.style.opacity = '0';
    });
    
    setTimeout(() => {
      if (pulse.parentElement) {
        pulse.remove();
      }
    }, TRANSITION_MEDIUM);
  });
  
  ctaButton.addEventListener('mouseup', () => {
    ctaButton.style.transform = '';
  });
}

/**
 * Data panel effects - subtle energy on interaction
 */
function initDataPanelEffects() {
  const panels = document.querySelectorAll('[data-panel]');
  
  panels.forEach(panel => {
    const isHighlighted = panel.hasAttribute('data-panel-highlight');
    
    panel.addEventListener('mouseenter', () => {
      // Subtle border glow
      panel.style.transition = `border-color ${TRANSITION_MEDIUM}ms ease-out, box-shadow ${TRANSITION_MEDIUM}ms ease-out`;
      
      if (isHighlighted) {
        panel.style.boxShadow = `0 0 20px rgba(244, 154, 43, 0.3), 0 4px 12px rgba(0, 0, 0, 0.3)`;
      } else {
        panel.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        panel.style.boxShadow = `0 0 15px rgba(255, 255, 255, 0.05)`;
      }
    });
    
    panel.addEventListener('mouseleave', () => {
      panel.style.boxShadow = '';
      panel.style.borderColor = '';
    });
  });
}

/**
 * Consumption display effects - energy intensification
 */
function initConsumptionDisplayEffects() {
  const display = document.querySelector('[data-consumption-display]');
  if (!display) return;
  
  let glowLayer = null;
  
  // Create background glow layer
  glowLayer = document.createElement('div');
  glowLayer.style.position = 'absolute';
  glowLayer.style.inset = '-20px';
  glowLayer.style.borderRadius = 'inherit';
  glowLayer.style.background = `radial-gradient(circle, ${BRAND_ORANGE}30 0%, transparent 70%)`;
  glowLayer.style.filter = 'blur(30px)';
  glowLayer.style.opacity = '0';
  glowLayer.style.pointerEvents = 'none';
  glowLayer.style.transition = `opacity ${TRANSITION_SLOW}ms ease-out`;
  glowLayer.style.zIndex = '-1';
  
  if (display.style.position !== 'absolute' && display.style.position !== 'relative') {
    display.style.position = 'relative';
  }
  display.insertBefore(glowLayer, display.firstChild);
  
  // Observe value changes and pulse glow
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' || mutation.type === 'characterData') {
        // Energy pulse on value change
        glowLayer.style.opacity = '0.8';
        
        setTimeout(() => {
          glowLayer.style.opacity = '0.5';
        }, 200);
        
        setTimeout(() => {
          glowLayer.style.opacity = '0';
        }, 600);
      }
    });
  });
  
  observer.observe(display, {
    childList: true,
    characterData: true,
    subtree: true
  });
}

/**
 * Cleanup function to remove all event listeners
 */
export function cleanupMicrointeractions() {
  // Remove dynamically created elements
  document.querySelectorAll('[data-microinteraction-element]').forEach(el => el.remove());
}

/**
 * Utility: Create energy ripple effect at coordinates
 */
export function createEnergyRipple(x, y, color = BRAND_ORANGE) {
  const ripple = document.createElement('div');
  ripple.setAttribute('data-microinteraction-element', 'true');
  ripple.style.position = 'fixed';
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  ripple.style.width = '0';
  ripple.style.height = '0';
  ripple.style.borderRadius = '50%';
  ripple.style.border = `2px solid ${color}`;
  ripple.style.transform = 'translate(-50%, -50%)';
  ripple.style.opacity = '1';
  ripple.style.pointerEvents = 'none';
  ripple.style.transition = `all ${TRANSITION_MEDIUM}ms ease-out`;
  ripple.style.zIndex = '9999';
  
  document.body.appendChild(ripple);
  
  requestAnimationFrame(() => {
    ripple.style.width = '100px';
    ripple.style.height = '100px';
    ripple.style.opacity = '0';
  });
  
  setTimeout(() => {
    ripple.remove();
  }, TRANSITION_MEDIUM);
}
