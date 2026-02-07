/**
 * Valentine's Day Interactive Proposal Application
 * A fun and romantic way to ask someone to be your Valentine!
 */

// ===== CONFIGURATION =====
const CONFIG = {
    hearts: {
        count: 15,
        emojis: ['💕', '💖', '💗', '💝', '💓', '💞'],
        minDuration: 10,
        maxDuration: 20
    },
    confetti: {
        count: 100,
        colors: ['#f093fb', '#f5576c', '#667eea', '#764ba2', '#ffd700', '#ff69b4'],
        duration: 3000
    },
    noButton: {
        phrases: [
            '💔 No 💔',
            '💔 Are you sure? 💔',
            '💔 Really? 💔',
            '💔 Think again! 💔',
            '💕 Please? 💕',
            "💔 Don't break my heart! 💔",
            '💕 Give me a chance! 💕',
            '💔 You sure about that? 💔',
            '💔 But why? 💔',
            '💕 Reconsider? 💕',
            '💕 One more chance? 💕',
            '💕 Pretty please? 💕'
        ],
        growthRate: 0.1,
        maxClicks: 5
    }
};

// ===== UTILITY FUNCTIONS =====
const Utils = {
    /**
     * Get random number between min and max
     */
    random(min, max) {
        return Math.random() * (max - min) + min;
    },

    /**
     * Get random item from array
     */
    randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    /**
     * Create DOM element with classes and attributes
     */
    createElement(tag, className = '', attributes = {}) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
        return element;
    }
};

// ===== BACKGROUND HEARTS MANAGER =====
class BackgroundHearts {
    constructor(containerSelector, config) {
        this.container = document.querySelector(containerSelector);
        this.config = config;
    }

    /**
     * Create floating hearts in the background
     */
    create() {
        if (!this.container) return;

        for (let i = 0; i < this.config.count; i++) {
            const heart = Utils.createElement('div', 'heart-bg');
            heart.textContent = Utils.randomChoice(this.config.emojis);
            
            // Random positioning and timing
            heart.style.left = `${Utils.random(0, 100)}vw`;
            heart.style.animationDuration = `${Utils.random(
                this.config.minDuration,
                this.config.maxDuration
            )}s`;
            heart.style.animationDelay = `${Utils.random(0, 5)}s`;
            
            this.container.appendChild(heart);
        }
    }
}

// ===== CONFETTI MANAGER =====
class ConfettiManager {
    constructor(config) {
        this.config = config;
    }

    /**
     * Create confetti explosion effect
     */
    create() {
        const { count, colors, duration } = this.config;

        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const confetti = Utils.createElement('div', 'confetti');
                confetti.style.left = `${Utils.random(0, 100)}vw`;
                confetti.style.background = Utils.randomChoice(colors);
                confetti.style.animationDelay = `${Utils.random(0, 1)}s`;
                
                document.body.appendChild(confetti);
                
                // Remove after animation completes
                setTimeout(() => confetti.remove(), duration);
            }, i * 30);
        }
    }
}

// ===== NO BUTTON CONTROLLER =====
class NoButtonController {
    constructor(buttonSelector, containerSelector, config) {
        this.button = document.querySelector(buttonSelector);
        this.container = document.querySelector(containerSelector);
        this.config = config;
        this.clickCount = 0;
        this.yesButton = document.querySelector('#yesBtn');
        this.app = null; // Will be set by ValentineApp
        
        this.init();
    }

    /**
     * Set reference to main app for triggering yes action
     */
    setApp(app) {
        this.app = app;
    }

    /**
     * Initialize event listeners
     */
    init() {
        if (!this.button || !this.container) return;

        this.button.addEventListener('mouseover', () => this.moveButton());
        this.button.addEventListener('click', (e) => {
            e.preventDefault();
            this.clickCount++;
            this.moveButton();
            this.growYesButton();
            
            // After max clicks, automatically trigger yes
            if (this.clickCount >= this.config.maxClicks) {
                this.fallBackToYes();
            }
        });
    }

    /**
     * Move button to random position
     */
    moveButton() {
        const maxX = this.container.offsetWidth - this.button.offsetWidth - 80;
        const maxY = this.container.offsetHeight - this.button.offsetHeight - 100;
        
        const randomX = Utils.random(0, maxX);
        const randomY = Utils.random(-150, maxY - 150);
        
        this.button.style.position = 'absolute';
        this.button.style.left = `${randomX}px`;
        this.button.style.top = `${randomY}px`;
        
        // Change button text
        this.button.textContent = Utils.randomChoice(this.config.phrases);
    }

    /**
     * Make Yes button grow larger
     */
    growYesButton() {
        if (!this.yesButton) return;
        
        const scale = 1 + (this.clickCount * this.config.growthRate);
        this.yesButton.style.transform = `scale(${scale})`;
    }

    /**
     * Fall back to yes button - automatically trigger yes action
     */
    fallBackToYes() {
        // Hide no button
        if (this.button) {
            this.button.style.display = 'none';
        }
        
        // Show message and trigger yes after a short delay
        if (this.yesButton) {
            this.yesButton.textContent = '💕 You chose YES! 💕';
            this.yesButton.style.animation = 'pulse 0.5s ease 3';
            
            setTimeout(() => {
                if (this.app) {
                    this.app.handleYesClick();
                }
            }, 1500);
        }
    }
}

// ===== MOTION PAGES MANAGER =====
class MotionPagesManager {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        this.currentPage = 0;
        this.pages = [];
        this.lyrics = [];
        this.images = [];
        this.autoPlayInterval = null;
    }

    /**
     * Get all image files from media folder
     */
    async getImageFiles() {
        const imageFiles = [
            'media/IMG_0419.jpg',
            'media/IMG_1413.jpg',
            'media/IMG_1486.jpg',
            'media/IMG_1711.jpg',
            'media/IMG_1787.jpg',
            'media/IMG_3664.jpg',
            'media/IMG_3723.jpg',
            'media/IMG_3723 2.jpg',
            'media/IMG_3861.jpg',
            'media/IMG_3906.jpg',
            'media/IMG_3909.jpg',
            'media/IMG_4012.jpg',
            'media/IMG_4668.jpg',
            'media/IMG_4673.jpg',
            'media/IMG_4687.jpg',
            'media/IMG_4692.jpg',
            'media/IMG_4735.jpg',
            'media/IMG_4825.jpg',
            'media/IMG_4828.jpg',
            'media/IMG_4832.jpg',
            'media/IMG_4975.jpg',
            'media/IMG_4983.jpg',
            'media/IMG_5055.jpg',
            'media/IMG_5339.jpg',
            'media/IMG_5340.jpg',
            'media/IMG_5347.jpg',
            'media/IMG_5349.jpg',
            'media/IMG_5351.jpg',
            'media/IMG_5363.jpg',
            'media/IMG_5366.jpg',
            'media/IMG_5369.jpg',
            'media/IMG_5378.jpg',
            'media/IMG_5383.jpg',
            'media/IMG_5385.jpg',
            'media/IMG_5397.jpg',
            'media/IMG_5404.jpg'
        ];
        return imageFiles;
    }

    /**
     * Load lyrics from JSON file
     */
    async loadLyrics() {
        try {
            const response = await fetch('lyrics.json');
            const data = await response.json();
            return data.verses || [];
        } catch (error) {
            console.error('Error loading lyrics:', error);
            return [];
        }
    }

    /**
     * Shuffle array randomly
     */
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Create floating decorative elements
     */
    createFloatingDecorations(container) {
        const emojis = ['💕', '💖', '💗', '💝', '💓', '✨', '⭐', '🌟'];
        
        for (let i = 0; i < 8; i++) {
            const decoration = Utils.createElement('div', 'floating-decoration');
            decoration.textContent = Utils.randomChoice(emojis);
            decoration.style.left = `${Utils.random(0, 100)}%`;
            decoration.style.top = `${Utils.random(0, 100)}%`;
            decoration.style.animationDelay = `${Utils.random(0, 3)}s`;
            decoration.style.animationDuration = `${Utils.random(3, 6)}s`;
            container.appendChild(decoration);
        }
    }

    /**
     * Create photo collage page with scrolling lyrics and dynamic image rotation
     */
    createCollagePage(allImages, lyricText, index) {
        const page = Utils.createElement('div', 'motion-page collage-page');
        if (index === 0) {
            page.classList.add('active');
        }

        // Create photo collage with masonry layout
        const collageContainer = Utils.createElement('div', 'photo-collage');
        
        // Define different sizes for collage items (masonry layout)
        const sizePatterns = [
            { gridColumn: '1 / 3', gridRow: '1 / 2', className: 'large' },
            { gridColumn: '3 / 4', gridRow: '1 / 3', className: 'tall' },
            { gridColumn: '1 / 2', gridRow: '2 / 4', className: 'tall' },
            { gridColumn: '2 / 4', gridRow: '3 / 4', className: 'wide' },
            { gridColumn: '4 / 5', gridRow: '1 / 2', className: 'small' },
            { gridColumn: '4 / 5', gridRow: '2 / 3', className: 'small' },
            { gridColumn: '4 / 6', gridRow: '3 / 4', className: 'wide' },
            { gridColumn: '5 / 6', gridRow: '1 / 2', className: 'small' },
            { gridColumn: '5 / 6', gridRow: '2 / 3', className: 'small' },
            { gridColumn: '1 / 2', gridRow: '4 / 5', className: 'small' },
            { gridColumn: '2 / 3', gridRow: '4 / 5', className: 'small' },
            { gridColumn: '3 / 5', gridRow: '4 / 5', className: 'wide' },
            { gridColumn: '5 / 6', gridRow: '4 / 5', className: 'small' },
            { gridColumn: '6 / 7', gridRow: '1 / 3', className: 'tall' },
            { gridColumn: '6 / 7', gridRow: '3 / 5', className: 'tall' }
        ];

        // Create initial collage items (show first batch)
        const initialCount = Math.min(12, allImages.length);
        this.collageItems = [];
        
        for (let i = 0; i < initialCount; i++) {
            const pattern = sizePatterns[i % sizePatterns.length];
            const collageItem = Utils.createElement('div', `collage-item ${pattern.className}`);
            collageItem.style.gridColumn = pattern.gridColumn;
            collageItem.style.gridRow = pattern.gridRow;
            
            const img = Utils.createElement('img', 'collage-image', {
                src: allImages[i],
                alt: `Photo ${i + 1}`,
                loading: 'lazy',
                'data-image-index': i
            });
            const gradient = Utils.createElement('div', 'collage-gradient');
            
            collageItem.appendChild(img);
            collageItem.appendChild(gradient);
            collageContainer.appendChild(collageItem);
            this.collageItems.push({ element: collageItem, img: img, currentIndex: i });
        }

        // Store all images for rotation
        this.allCollageImages = allImages;
        this.collageContainer = collageContainer;

        // Create scrolling lyrics container
        const lyricsWrapper = Utils.createElement('div', 'lyrics-scroll-wrapper');
        
        // Create multiple duplicates for seamless continuous loop
        for (let i = 0; i < 3; i++) {
            const lyricsContainer = Utils.createElement('div', 'lyrics-scroll');
            lyricsContainer.textContent = lyricText;
            lyricsWrapper.appendChild(lyricsContainer);
        }

        page.appendChild(collageContainer);
        page.appendChild(lyricsWrapper);

        // Start image rotation
        this.startImageRotation();

        return page;
    }

    /**
     * Rotate images in collage dynamically
     */
    startImageRotation() {
        if (!this.collageItems || this.collageItems.length === 0 || !this.allCollageImages) return;

        const manager = this;
        
        // Rotate each image independently with different delays
        manager.collageItems.forEach((item, index) => {
            // Stagger the rotation start times
            setTimeout(() => {
                const rotateItem = () => {
                    // Calculate next image index (cycle through all images)
                    const nextIndex = (item.currentIndex + 1) % manager.allCollageImages.length;
                    
                    // Fade out
                    item.img.style.opacity = '0';
                    item.img.style.transition = 'opacity 0.5s ease';
                    
                    setTimeout(() => {
                        // Change image
                        item.img.src = manager.allCollageImages[nextIndex];
                        item.img.setAttribute('data-image-index', nextIndex);
                        item.currentIndex = nextIndex;
                        
                        // Fade in
                        item.img.style.opacity = '1';
                    }, 500);
                };

                // Initial rotation
                rotateItem();
                
                // Continue rotating every 3-5 seconds (randomized per item)
                const rotationInterval = setInterval(rotateItem, 3000 + (index * 200));
                item.rotationInterval = rotationInterval;
            }, index * 500); // Stagger initial start
        });
    }

    /**
     * Create a motion page with image and lyrics (keeping for backward compatibility)
     */
    createMotionPage(imagePath, lyricText, index) {
        const page = Utils.createElement('div', 'motion-page');
        if (index === 0) {
            page.classList.add('active');
        }

        // Add floating decorations
        this.createFloatingDecorations(page);

        // Image container
        const imageContainer = Utils.createElement('div', 'motion-page-image-container');
        const img = Utils.createElement('img', 'motion-page-image', {
            src: imagePath,
            alt: `Memory ${index + 1}`,
            loading: 'lazy'
        });
        const gradient = Utils.createElement('div', 'motion-page-gradient');

        imageContainer.appendChild(img);
        imageContainer.appendChild(gradient);

        // Lyrics container
        const lyricsContainer = Utils.createElement('div', 'motion-page-lyrics');
        lyricsContainer.textContent = lyricText;

        // Add floating hearts
        const heartLeft = Utils.createElement('div', 'lyrics-heart left');
        heartLeft.textContent = '💕';
        const heartRight = Utils.createElement('div', 'lyrics-heart right');
        heartRight.textContent = '💖';
        
        lyricsContainer.appendChild(heartLeft);
        lyricsContainer.appendChild(heartRight);

        page.appendChild(imageContainer);
        page.appendChild(lyricsContainer);

        return page;
    }

    /**
     * Load and display motion pages with images and lyrics
     */
    async loadMotionPages() {
        if (!this.container) return;

        // Clear container
        this.container.innerHTML = '';

        // Load lyrics and images
        this.lyrics = await this.loadLyrics();
        const allImages = await this.getImageFiles();
        const shuffledImages = this.shuffleArray(allImages);

        // Create one collage page with all images and scrolling lyrics
        const numPages = Math.min(this.lyrics.length, 5); // Use up to 5 verses
        this.pages = [];

        // Use all available images for dynamic rotation
        // Combine all lyrics into one scrolling text with proper formatting
        const allLyrics = this.lyrics.slice(0, numPages)
            .map(lyric => lyric.text)
            .join('  💕  •  💕  ');
        
        const collagePage = this.createCollagePage(shuffledImages, allLyrics, 0);
        this.container.appendChild(collagePage);
        this.pages.push(collagePage);

        // Hide page indicator for collage page
        const pageIndicator = document.querySelector('.page-indicator');
        if (pageIndicator) {
            pageIndicator.style.display = 'none';
        }

        // Don't auto-play for single collage page
        // this.startAutoPlay();
    }

    /**
     * Show specific page
     */
    showPage(index) {
        if (index < 0 || index >= this.pages.length) return;

        // Update current page
        const prevIndex = this.currentPage;
        this.currentPage = index;

        // Update page classes
        this.pages.forEach((page, i) => {
            page.classList.remove('active', 'prev');
            if (i === index) {
                page.classList.add('active');
            } else if (i < index) {
                page.classList.add('prev');
            }
        });

        // Update page indicator
        const currentPageEl = document.querySelector('#current-page');
        if (currentPageEl) {
            currentPageEl.textContent = index + 1;
        }
    }

    /**
     * Go to next page
     */
    nextPage() {
        const nextIndex = (this.currentPage + 1) % this.pages.length;
        this.showPage(nextIndex);
    }

    /**
     * Start auto-play
     */
    startAutoPlay() {
        // Clear existing interval
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }

        // Auto-advance every 5 seconds
        this.autoPlayInterval = setInterval(() => {
            this.nextPage();
        }, 5000);
    }

    /**
     * Stop auto-play
     */
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

// ===== SCREEN MANAGER =====
class ScreenManager {
    /**
     * Switch between different screens
     */
    static show(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Show target screen
        const targetScreen = document.querySelector(`#${screenId}`);
        if (targetScreen) {
            targetScreen.classList.add('active');
        }
    }
}

// ===== MAIN APPLICATION =====
class ValentineApp {
    constructor() {
        this.backgroundHearts = new BackgroundHearts(
            '#hearts-container',
            CONFIG.hearts
        );
        this.confettiManager = new ConfettiManager(CONFIG.confetti);
        this.noButtonController = new NoButtonController(
            '#noBtn',
            '.container',
            CONFIG.noButton
        );
        this.motionPages = new MotionPagesManager('#motion-pages-container');
        
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        // Create background hearts
        this.backgroundHearts.create();

        // Set reference to app in noButtonController
        this.noButtonController.setApp(this);

        // Set up Yes button
        const yesButton = document.querySelector('#yesBtn');
        if (yesButton) {
            yesButton.addEventListener('click', () => this.handleYesClick());
        }

        console.log('💕 Valentine App Initialized!');
    }

    /**
     * Handle Yes button click
     */
    handleYesClick() {
        // Switch to celebration screen
        ScreenManager.show('celebration');

        // Create confetti
        this.confettiManager.create();

        // Load motion pages with images and lyrics
        this.motionPages.loadMotionPages();

        // Optional: Play success sound (uncomment if you add audio file)
        // this.playSound('celebration.mp3');

        console.log('🎉 She said YES!');
    }

    /**
     * Play sound effect (optional)
     */
    playSound(audioFile) {
        const audio = new Audio(audioFile);
        audio.play().catch(err => {
            console.log('Audio playback failed:', err);
        });
    }
}

// ===== INITIALIZE APP WHEN DOM IS READY =====
document.addEventListener('DOMContentLoaded', () => {
    const app = new ValentineApp();
});

// Export for potential module usage
export { ValentineApp, CONFIG, Utils };
