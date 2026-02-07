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

// ===== PHOTO GALLERY MANAGER =====
class PhotoGalleryManager {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        this.images = [];
        this.loadedImages = [];
    }

    /**
     * Get all image files from media folder
     */
    async getImageFiles() {
        // List of JPG image files in media folder (converted from HEIC)
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
     * Load and display random images
     */
    async loadRandomImages(count = 6) {
        if (!this.container) return;

        // Clear existing images
        this.container.innerHTML = '';

        // Get all image files
        const allImages = await this.getImageFiles();
        
        // Shuffle and select random images
        const shuffled = this.shuffleArray(allImages);
        const selectedImages = shuffled.slice(0, Math.min(count, shuffled.length));

        // Create photo frames for each image
        selectedImages.forEach((imagePath, index) => {
            const frame = Utils.createElement('div', 'photo-frame');
            
            const img = Utils.createElement('img', '', {
                src: imagePath,
                alt: `Memory ${index + 1}`,
                loading: 'lazy'
            });

            // Handle image load error (for HEIC files that might not load)
            img.onerror = () => {
                // Try to load a placeholder or skip this image
                frame.style.display = 'none';
            };

            const gradient = Utils.createElement('div', 'photo-gradient');

            frame.appendChild(img);
            frame.appendChild(gradient);
            this.container.appendChild(frame);

            // Animate in with delay
            setTimeout(() => {
                frame.classList.add('visible');
            }, index * 200);
        });
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
        this.photoGallery = new PhotoGalleryManager('#photo-gallery');
        
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

        // Load random photos in gallery
        this.photoGallery.loadRandomImages(6);

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
