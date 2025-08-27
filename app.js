class Slideshow {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        this.isAutoPlaying = false;
        this.autoInterval = null;
        this.autoDelay = 5000; // 5 seconds per slide
        
        this.initElements();
        this.initEventListeners();
        this.updateUI();
        this.initImagePlaceholders();
    }
    
    initElements() {
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.autoToggle = document.getElementById('auto-toggle');
        this.currentSlideEl = document.getElementById('current-slide');
        this.totalSlidesEl = document.getElementById('total-slides');
        this.container = document.querySelector('.slideshow-container');
        
        // Set total slides count
        if (this.totalSlidesEl) {
            this.totalSlidesEl.textContent = this.totalSlides;
        }
    }
    
    initImagePlaceholders() {
        // Add click handlers to image placeholders for easy image replacement instructions
        const placeholders = document.querySelectorAll('.image-placeholder');
        placeholders.forEach(placeholder => {
            placeholder.addEventListener('click', () => {
                const instruction = placeholder.querySelector('.placeholder-instruction');
                if (instruction) {
                    this.showImageReplaceInstructions(placeholder.id, instruction.textContent);
                }
            });
        });
    }
    
    showImageReplaceInstructions(placeholderId, instruction) {
        // Create modal for image replacement instructions
        const modal = document.createElement('div');
        modal.className = 'image-replace-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>🖼️ Image Replacement Guide</h3>
                    <button class="modal-close" onclick="this.closest('.image-replace-modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <p><strong>Placeholder ID:</strong> <code>${placeholderId}</code></p>
                    <p><strong>To replace this placeholder with your own image:</strong></p>
                    <ol>
                        <li>Locate the div with class <code>"image-placeholder"</code> and id <code>"${placeholderId}"</code></li>
                        <li>Replace the entire div with an img element</li>
                        <li>Set the src attribute to your image URL</li>
                        <li>Add appropriate alt text</li>
                    </ol>
                    <div class="code-example">
                        <p><strong>Example replacement:</strong></p>
                        <pre><code>&lt;img src="your-image-url.jpg" alt="Description of your image" /&gt;</code></pre>
                    </div>
                    <p class="note"><strong>Note:</strong> Keep the same parent container to maintain styling.</p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn--primary" onclick="this.closest('.image-replace-modal').remove()">Got it!</button>
                </div>
            </div>
        `;
        
        // Style the modal
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            backdrop-filter: blur(5px);
        `;
        
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.cssText = `
            background: var(--color-surface);
            border-radius: var(--radius-lg);
            border: 1px solid var(--color-border);
            max-width: 600px;
            width: 90%;
            color: var(--color-text);
            box-shadow: var(--shadow-lg);
            max-height: 80vh;
            overflow-y: auto;
        `;
        
        const modalHeader = modal.querySelector('.modal-header');
        modalHeader.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: var(--space-20) var(--space-24);
            border-bottom: 1px solid var(--color-border);
        `;
        
        const modalBody = modal.querySelector('.modal-body');
        modalBody.style.cssText = `
            padding: var(--space-24);
        `;
        
        const modalFooter = modal.querySelector('.modal-footer');
        modalFooter.style.cssText = `
            padding: var(--space-16) var(--space-24);
            border-top: 1px solid var(--color-border);
            display: flex;
            justify-content: flex-end;
        `;
        
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            font-size: var(--font-size-2xl);
            color: var(--color-text-secondary);
            cursor: pointer;
            padding: var(--space-4);
            border-radius: var(--radius-sm);
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        const codeExample = modal.querySelector('.code-example');
        codeExample.style.cssText = `
            background: var(--color-bg-1);
            padding: var(--space-16);
            border-radius: var(--radius-base);
            border: 1px solid var(--color-border);
            margin: var(--space-16) 0;
        `;
        
        const pre = modal.querySelector('pre');
        if (pre) {
            pre.style.cssText = `
                background: var(--color-bg-2);
                padding: var(--space-12);
                border-radius: var(--radius-sm);
                overflow-x: auto;
                font-family: var(--font-family-mono);
                font-size: var(--font-size-sm);
                margin: var(--space-8) 0 0 0;
            `;
        }
        
        const note = modal.querySelector('.note');
        if (note) {
            note.style.cssText = `
                background: var(--color-bg-3);
                padding: var(--space-12);
                border-radius: var(--radius-sm);
                border-left: 3px solid var(--color-primary);
                margin-top: var(--space-16);
                font-size: var(--font-size-sm);
            `;
        }
        
        document.body.appendChild(modal);
        
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Close on escape key
        const closeOnEscape = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', closeOnEscape);
            }
        };
        document.addEventListener('keydown', closeOnEscape);
    }
    
    initEventListeners() {
        // Navigation buttons - ensure they exist before adding listeners
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.prevSlide();
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.nextSlide();
            });
        }
        
        // Auto-play toggle - fixed functionality
        if (this.autoToggle) {
            this.autoToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleAutoPlay();
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Pause auto-play on hover
        if (this.container) {
            this.container.addEventListener('mouseenter', () => {
                if (this.isAutoPlaying) {
                    this.pauseAutoPlay();
                }
            });
            
            this.container.addEventListener('mouseleave', () => {
                if (this.isAutoPlaying) {
                    this.resumeAutoPlay();
                }
            });
        }
        
        // Handle visibility change (pause when tab is not active)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.isAutoPlaying) {
                this.pauseAutoPlay();
            } else if (!document.hidden && this.isAutoPlaying) {
                this.resumeAutoPlay();
            }
        });
        
        // Touch gesture support
        this.initTouchGestures();
    }
    
    initTouchGestures() {
        let touchStartX = 0;
        let touchEndX = 0;
        
        if (this.container) {
            this.container.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            
            this.container.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                this.handleGesture(touchStartX, touchEndX);
            }, { passive: true });
        }
    }
    
    handleGesture(startX, endX) {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                this.nextSlide();
            } else {
                // Swipe right - previous slide
                this.prevSlide();
            }
        }
    }
    
    handleKeyPress(e) {
        // Don't handle keyboard events if a modal is open
        if (document.querySelector('.image-replace-modal')) {
            return;
        }
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.prevSlide();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.nextSlide();
                break;
            case ' ': // Spacebar - fixed auto-play toggle
                e.preventDefault();
                this.toggleAutoPlay();
                break;
            case 'Escape': // ESC key - stop auto-play
                e.preventDefault();
                if (this.isAutoPlaying) {
                    this.stopAutoPlay();
                }
                break;
            case 'Home':
                e.preventDefault();
                this.goToSlide(0);
                break;
            case 'End':
                e.preventDefault();
                this.goToSlide(this.totalSlides - 1);
                break;
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                e.preventDefault();
                const slideNum = parseInt(e.key);
                if (slideNum <= this.totalSlides) {
                    this.goToSlide(slideNum - 1);
                }
                break;
        }
    }
    
    goToSlide(slideIndex) {
        // Validate slide index
        if (slideIndex < 0 || slideIndex >= this.totalSlides || slideIndex === this.currentSlide) {
            return;
        }
        
        // Remove active class from current slide
        if (this.slides[this.currentSlide]) {
            this.slides[this.currentSlide].classList.remove('active');
        }
        
        // Update current slide index
        this.currentSlide = slideIndex;
        
        // Add active class to new slide
        if (this.slides[this.currentSlide]) {
            this.slides[this.currentSlide].classList.add('active');
        }
        
        this.updateUI();
        
        // Announce slide change for accessibility
        this.announceSlideChange();
    }
    
    nextSlide() {
        if (this.currentSlide < this.totalSlides - 1) {
            this.goToSlide(this.currentSlide + 1);
        }
    }
    
    prevSlide() {
        if (this.currentSlide > 0) {
            this.goToSlide(this.currentSlide - 1);
        }
    }
    
    updateUI() {
        // Update slide counter
        if (this.currentSlideEl) {
            this.currentSlideEl.textContent = this.currentSlide + 1;
        }
        
        // Update navigation button states
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentSlide === 0;
            this.prevBtn.setAttribute('aria-label', 
                this.currentSlide === 0 ? 'Previous slide (disabled)' : 'Previous slide'
            );
        }
        
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentSlide === this.totalSlides - 1;
            this.nextBtn.setAttribute('aria-label', 
                this.currentSlide === this.totalSlides - 1 ? 'Next slide (disabled)' : 'Next slide'
            );
        }
        
        // Update auto-play button text and styling
        if (this.autoToggle) {
            this.autoToggle.textContent = this.isAutoPlaying ? 'Auto: ON' : 'Auto: OFF';
            this.autoToggle.setAttribute('aria-label', 
                this.isAutoPlaying ? 'Disable auto-advance (currently ON)' : 'Enable auto-advance (currently OFF)'
            );
            
            // Add visual indication of auto-play state
            if (this.isAutoPlaying) {
                this.autoToggle.classList.remove('btn--outline');
                this.autoToggle.classList.add('btn--primary');
            } else {
                this.autoToggle.classList.remove('btn--primary');
                this.autoToggle.classList.add('btn--outline');
            }
        }
        
        // Update container class for auto-play indicator
        if (this.container) {
            if (this.isAutoPlaying) {
                this.container.classList.add('auto-playing');
            } else {
                this.container.classList.remove('auto-playing');
            }
        }
    }
    
    toggleAutoPlay() {
        if (this.isAutoPlaying) {
            this.stopAutoPlay();
        } else {
            this.startAutoPlay();
        }
    }
    
    startAutoPlay() {
        this.isAutoPlaying = true;
        this.resumeAutoPlay();
        this.updateUI();
        
        // Show notification
        this.showNotification('Auto-advance enabled. Press ESC or Space to stop.', 'success');
    }
    
    stopAutoPlay() {
        this.isAutoPlaying = false;
        this.pauseAutoPlay();
        this.updateUI();
        
        // Show notification
        this.showNotification('Auto-advance disabled.', 'info');
    }
    
    pauseAutoPlay() {
        if (this.autoInterval) {
            clearInterval(this.autoInterval);
            this.autoInterval = null;
        }
    }
    
    resumeAutoPlay() {
        if (this.isAutoPlaying && !this.autoInterval) {
            this.autoInterval = setInterval(() => {
                if (this.currentSlide < this.totalSlides - 1) {
                    this.nextSlide();
                } else {
                    // Stop auto-play when reaching the end
                    this.stopAutoPlay();
                    this.showNotification('Reached end of slideshow. Auto-advance stopped.', 'info');
                }
            }, this.autoDelay);
        }
    }
    
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelector('.slideshow-notification');
        if (existing) {
            existing.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = 'slideshow-notification';
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: var(--space-24);
            background: var(--color-${type === 'success' ? 'success' : info === 'error' ? 'error' : 'primary'});
            color: var(--color-white);
            padding: var(--space-12) var(--space-16);
            border-radius: var(--radius-base);
            font-size: var(--font-size-sm);
            font-weight: var(--font-weight-medium);
            z-index: 200;
            box-shadow: var(--shadow-md);
            transform: translateX(100%);
            transition: transform var(--duration-fast) var(--ease-standard);
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    announceSlideChange() {
        // Create or update screen reader announcement
        let announcer = document.getElementById('slide-announcer');
        if (!announcer) {
            announcer = document.createElement('div');
            announcer.id = 'slide-announcer';
            announcer.className = 'sr-only';
            announcer.setAttribute('aria-live', 'polite');
            document.body.appendChild(announcer);
        }
        
        const slideTitle = this.slides[this.currentSlide]?.querySelector('h1')?.textContent || 
                          `Slide ${this.currentSlide + 1}`;
        announcer.textContent = `Now showing: ${slideTitle}`;
    }
    
    // Method to restart slideshow from beginning
    restart() {
        this.goToSlide(0);
        if (this.isAutoPlaying) {
            this.pauseAutoPlay();
            this.resumeAutoPlay();
        }
        this.showNotification('Slideshow restarted', 'info');
    }
    
    // Method to go to a specific slide by number (1-based)
    jumpToSlide(slideNumber) {
        const slideIndex = slideNumber - 1;
        if (slideIndex >= 0 && slideIndex < this.totalSlides) {
            this.goToSlide(slideIndex);
        }
    }
    
    // Method to get current slide information
    getCurrentSlideInfo() {
        const currentSlideEl = this.slides[this.currentSlide];
        if (!currentSlideEl) return null;
        
        const title = currentSlideEl.querySelector('h1')?.textContent || '';
        const company = currentSlideEl.querySelector('.company')?.textContent || '';
        const isDetectionSlide = currentSlideEl.querySelector('.detection-slide') !== null;
        const isGeneratorSlide = currentSlideEl.querySelector('.generator-slide') !== null;
        
        return {
            index: this.currentSlide,
            title,
            company,
            isDetectionSlide,
            isGeneratorSlide,
            slideType: isDetectionSlide ? 'detection' : isGeneratorSlide ? 'generator' : 'other'
        };
    }
    
    // Method to jump to specific generator or detection slides
    jumpToGenerator(generatorName) {
        const targetSlide = Array.from(this.slides).findIndex(slide => {
            const title = slide.querySelector('h1')?.textContent;
            return title && title.toLowerCase().includes(generatorName.toLowerCase());
        });
        
        if (targetSlide !== -1) {
            this.goToSlide(targetSlide);
        }
    }
}

// Initialize the slideshow when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Ensure all required elements exist
        const container = document.querySelector('.slideshow-container');
        const slides = document.querySelectorAll('.slide');
        
        if (!container || !slides.length) {
            throw new Error('Required slideshow elements not found');
        }
        
        // Initialize slideshow
        const slideshow = new Slideshow();
        
        // Make slideshow globally available for debugging
        window.slideshow = slideshow;
        
        // Add accessibility attributes
        container.setAttribute('role', 'region');
        container.setAttribute('aria-label', 'Deep Media AI - AI Image Generators Detection Overview');
        
        slides.forEach((slide, index) => {
            slide.setAttribute('role', 'tabpanel');
            slide.setAttribute('aria-label', `Slide ${index + 1} of ${slides.length}`);
        });
        
        // Add error handling for images including platform screenshots
        document.querySelectorAll('.slide img').forEach(img => {
            img.addEventListener('error', (e) => {
                console.warn('Failed to load image:', e.target.src);
                
                // Don't replace platform screenshots with error message
                if (e.target.classList.contains('platform-screenshot')) {
                    console.error('DeepID platform screenshot failed to load:', e.target.src);
                    return;
                }
                
                // Add error placeholder for other images
                const errorDiv = document.createElement('div');
                errorDiv.className = 'image-error';
                errorDiv.textContent = 'Image not available - Please replace with your own';
                errorDiv.style.cssText = `
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--color-bg-4);
                    color: var(--color-text-secondary);
                    border: 1px solid var(--color-border);
                    border-radius: var(--radius-lg);
                    height: 300px;
                    font-size: var(--font-size-sm);
                    padding: var(--space-16);
                    text-align: center;
                `;
                e.target.parentNode.replaceChild(errorDiv, e.target);
            });
            
            // Add loading state
            img.addEventListener('load', () => {
                img.style.opacity = '1';
            });
            
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
        });
        
        // Add keyboard navigation hints for screen readers
        const hint = document.createElement('div');
        hint.className = 'sr-only';
        hint.textContent = 'Use arrow keys to navigate slides, spacebar to toggle auto-advance, ESC to stop auto-advance, number keys 1-9 for direct navigation, click image placeholders for replacement help';
        hint.setAttribute('aria-live', 'polite');
        document.body.appendChild(hint);
        
        // Add quick help overlay
        const helpOverlay = document.createElement('div');
        helpOverlay.style.cssText = `
            position: fixed;
            bottom: var(--space-16);
            left: 50%;
            transform: translateX(-50%);
            background: rgba(var(--color-slate-900-rgb), 0.95);
            padding: var(--space-12) var(--space-20);
            border-radius: var(--radius-full);
            color: var(--color-text-secondary);
            font-size: var(--font-size-xs);
            z-index: 99;
            backdrop-filter: blur(10px);
            border: 1px solid var(--color-border);
            opacity: 0;
            transition: opacity var(--duration-fast) var(--ease-standard);
            max-width: 90%;
            text-align: center;
        `;
        helpOverlay.innerHTML = `
            <div>🎮 Use ←→ arrows to navigate • Space: auto-play toggle • ESC: stop auto • Click placeholders for help</div>
        `;
        document.body.appendChild(helpOverlay);
        
        // Show help overlay on first load
        setTimeout(() => {
            helpOverlay.style.opacity = '1';
            setTimeout(() => {
                helpOverlay.style.opacity = '0';
            }, 4000);
        }, 1000);
        
        // Show help overlay on any key press
        document.addEventListener('keydown', () => {
            helpOverlay.style.opacity = '1';
            clearTimeout(helpOverlay.hideTimeout);
            helpOverlay.hideTimeout = setTimeout(() => {
                helpOverlay.style.opacity = '0';
            }, 2000);
        });
        
        console.log('🚀 Deep Media AI Slideshow initialized successfully!');
        console.log('📊 Total slides:', slides.length);
        console.log('🔍 Detection slides: 6 (showing DeepID platform results)');
        console.log('🎨 Generator slides: 6 (with replaceable image placeholders)');
        console.log('🎯 All image placeholders are clickable for replacement instructions');
        
    } catch (error) {
        console.error('❌ Failed to initialize slideshow:', error);
        
        // Fallback: basic navigation still works
        const nextBtn = document.getElementById('next-btn');
        const prevBtn = document.getElementById('prev-btn');
        const slides = document.querySelectorAll('.slide');
        let currentIndex = 0;
        
        if (nextBtn && slides.length) {
            nextBtn.addEventListener('click', () => {
                if (currentIndex < slides.length - 1) {
                    slides[currentIndex].classList.remove('active');
                    currentIndex++;
                    slides[currentIndex].classList.add('active');
                    
                    const currentSlideEl = document.getElementById('current-slide');
                    if (currentSlideEl) {
                        currentSlideEl.textContent = currentIndex + 1;
                    }
                }
            });
        }
        
        if (prevBtn && slides.length) {
            prevBtn.addEventListener('click', () => {
                if (currentIndex > 0) {
                    slides[currentIndex].classList.remove('active');
                    currentIndex--;
                    slides[currentIndex].classList.add('active');
                    
                    const currentSlideEl = document.getElementById('current-slide');
                    if (currentSlideEl) {
                        currentSlideEl.textContent = currentIndex + 1;
                    }
                }
            });
        }
    }
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.slideshow && window.slideshow.isAutoPlaying) {
        window.slideshow.stopAutoPlay();
    }
});

// Enhanced utility functions
window.slideshowUtils = {
    // Navigation
    goToSlide: (slideNumber) => window.slideshow?.jumpToSlide(slideNumber),
    jumpToGenerator: (generatorName) => window.slideshow?.jumpToGenerator(generatorName),
    getCurrentInfo: () => window.slideshow?.getCurrentSlideInfo(),
    
    // Playback controls
    startAutoPlay: () => window.slideshow?.startAutoPlay(),
    stopAutoPlay: () => window.slideshow?.stopAutoPlay(),
    toggleAutoPlay: () => window.slideshow?.toggleAutoPlay(),
    restart: () => window.slideshow?.restart(),
    
    // Quick navigation helpers
    goToTitle: () => window.slideshowUtils.goToSlide(1),
    goToSummary: () => window.slideshowUtils.goToSlide(14),
    
    // Generator-specific navigation
    goToDallE3: () => window.slideshowUtils.jumpToGenerator('DALL-E 3'),
    goToMidjourney: () => window.slideshowUtils.jumpToGenerator('Midjourney'),
    goToStableDiffusion: () => window.slideshowUtils.jumpToGenerator('Stable Diffusion'),
    goToAdobeFirefly: () => window.slideshowUtils.jumpToGenerator('Adobe Firefly'),
    goToUnstableDiffusion: () => window.slideshowUtils.jumpToGenerator('Unstable Diffusion'),
    goToGrok: () => window.slideshowUtils.jumpToGenerator('Grok'),
    
    // Debug helpers
    logCurrentSlide: () => console.log('Current slide:', window.slideshowUtils.getCurrentInfo()),
    showHelp: () => {
        console.log(`
🎮 Deep Media AI Slideshow Controls:
• ← → Arrow keys: Navigate slides
• Space: Toggle auto-advance
• ESC: Stop auto-advance
• Home/End: Jump to first/last slide
• 1-9: Jump to specific slide number
• Click image placeholders: Get replacement instructions

🔧 JavaScript API:
• slideshowUtils.goToSlide(n) - Jump to slide number
• slideshowUtils.startAutoPlay() - Start auto-advance
• slideshowUtils.stopAutoPlay() - Stop auto-advance
• slideshowUtils.restart() - Go back to beginning
• slideshowUtils.getCurrentInfo() - Get current slide info
        `);
    }
};
