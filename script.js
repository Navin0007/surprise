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
     * Create a motion page with image and lyrics
     */
    createMotionPage(imagePath, lyricText, index) {
        const page = Utils.createElement('div', 'motion-page');
        if (index === 0) {
            page.classList.add('active');
        }

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

        // Create pages - pair each lyric with a random image
        const numPages = Math.min(this.lyrics.length, 5); // Use up to 5 verses
        this.pages = [];

        for (let i = 0; i < numPages; i++) {
            const lyric = this.lyrics[i];
            const image = shuffledImages[i % shuffledImages.length];
            
            const page = this.createMotionPage(image, lyric.text, i);
            this.container.appendChild(page);
            this.pages.push(page);
        }

        // Update page indicator
        const totalPagesEl = document.querySelector('#total-pages');
        if (totalPagesEl) {
            totalPagesEl.textContent = numPages;
        }

        // Start auto-play
        this.startAutoPlay();
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
