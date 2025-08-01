document.addEventListener('DOMContentLoaded', function() {
    // Animated title effect
    const titleSpans = document.querySelectorAll('.animated-title span');
    let animationInterval = null;
    let isAnimating = false;
    let animationDirection = 1; // 1 for forward, -1 for backward
    let animationProgress = 0;
    let animationCompleted = false;
    let animationTimeout = null;
    
    // Extract all colors from the letters
    const letterColors = Array.from(titleSpans).map(span => span.getAttribute('data-color'));
    
    titleSpans.forEach((span, index) => {
        span.addEventListener('click', function() {
            if (isAnimating) {
                // Stop animation
                clearInterval(animationInterval);
                clearTimeout(animationTimeout);
                isAnimating = false;
                
                // Reset all spans to their original colors
                titleSpans.forEach(s => {
                    s.style.color = s.getAttribute('data-color');
                });
            } else {
                // Start animation
                isAnimating = true;
                animationDirection = 1;
                animationProgress = 0;
                animationCompleted = false;
                
                // Convert hex to RGB
                function hexToRgb(hex) {
                    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                    return result ? {
                        r: parseInt(result[1], 16),
                        g: parseInt(result[2], 16),
                        b: parseInt(result[3], 16)
                    } : null;
                }
                
                const rgbColors = letterColors.map(color => hexToRgb(color));
                
                animationInterval = setInterval(() => {
                    animationProgress += 0.02 * animationDirection;
                    
                    if (animationProgress >= 1) {
                        animationProgress = 1;
                        animationDirection = -1; // Change direction
                    } else if (animationProgress <= 0) {
                        animationProgress = 0;
                        animationDirection = 1; // Change direction
                    }
                    
                    // Update each span's color
                    titleSpans.forEach((s, i) => {
                        // Calculate which color to use based on progress
                        let colorIndex;
                        
                        if (animationDirection === 1) {
                            // Forward: from first to last
                            colorIndex = Math.floor(animationProgress * letterColors.length);
                        } else {
                            // Backward: from last to first
                            colorIndex = letterColors.length - 1 - Math.floor(animationProgress * letterColors.length);
                        }
                        
                        // Ensure colorIndex is within bounds
                        colorIndex = Math.max(0, Math.min(colorIndex, letterColors.length - 1));
                        
                        // Apply the color
                        s.style.color = letterColors[colorIndex];
                    });
                    
                    // Check if animation completed a full cycle
                    if (animationProgress === 0 && animationDirection === 1) {
                        if (!animationCompleted) {
                            animationCompleted = true;
                            
                            // Flash all colors 3 times
                            let flashCount = 0;
                            let flashIndex = 0;
                            
                            clearInterval(animationInterval);
                            
                            const flashInterval = setInterval(() => {
                                // Flash each color
                                titleSpans.forEach(s => {
                                    s.style.color = letterColors[flashIndex];
                                });
                                
                                flashIndex++;
                                
                                if (flashIndex >= letterColors.length) {
                                    flashIndex = 0;
                                    flashCount++;
                                    
                                    if (flashCount >= 3) {
                                        clearInterval(flashInterval);
                                        
                                        // Reset to original colors
                                        titleSpans.forEach(s => {
                                            s.style.color = s.getAttribute('data-color');
                                        });
                                        
                                        // Give reward and show modal
                                        const coinsRewarded = parseInt(localStorage.getItem('coinsRewarded') || '0');
                                        if (coinsRewarded === 0) {
                                            localStorage.setItem('coinsRewarded', '1');
                                            showModal('congrats-modal');
                                        }
                                        
                                        isAnimating = false;
                                    }
                                }
                            }, 100);
                        }
                    }
                }, 50);
            }
        });
    });
    
    // Function to show modal
    function showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
        }
    }
    
    // Function to hide modal
    function hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    // Set random game of the day
    const games = [
        "Blob Bots", "Castle Siege", "Classic War", "Cosmic Jackpot", "Big Fish",
        "Escape Prison", "Rock Paper Scissors", "Get On Top", "Hangman", "Header Hustle",
        "Puzzles", "Lunar Lander: Horizon", "Math Works", "Memory Match", "Mini Basketball",
        "One in a Million", "Platform Jump", "Pixel Python Arena", "QuizKnows", "Sea Square",
        "Snakes & Ladders – Gamble", "Stickman Fight", "Stickman Racer", "Wolverine", "WordWeaver"
    ];
    
    const randomGame = games[Math.floor(Math.random() * games.length)];
    document.getElementById('game-of-day').textContent = randomGame;
    
    // Week timer
    function updateWeekTimer() {
        const now = new Date();
        const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const hoursLeft = 24 - now.getHours();
        const minutesLeft = 60 - now.getMinutes();
        const secondsLeft = 60 - now.getSeconds();
        
        let daysUntilMonday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
        
        if (daysUntilMonday === 0 && hoursLeft === 24) {
            daysUntilMonday = 7;
        }
        
        const timerText = `Next Week: ${daysUntilMonday}d ${hoursLeft}h ${minutesLeft}m ${secondsLeft}s`;
        document.getElementById('week-timer').textContent = timerText;
    }
    
    updateWeekTimer();
    setInterval(updateWeekTimer, 1000);
    
    // Profile button functionality
    const profileBtn = document.getElementById('profile-btn');
    const profilePage = document.getElementById('profile-page');
    const profileBackBtn = document.getElementById('profile-back-btn');
    
    profileBtn.addEventListener('click', function() {
        profilePage.style.display = 'block';
    });
    
    profileBackBtn.addEventListener('click', function() {
        profilePage.style.display = 'none';
    });
    
    // Profile tabs functionality
    const profileTabs = document.querySelectorAll('.profile-tab');
    const profileTabContents = document.querySelectorAll('.profile-tab-content');
    
    profileTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            profileTabs.forEach(t => t.classList.remove('active'));
            profileTabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
    
    // Coins dropdown functionality - Fixed to attach to the button
    const coinsBtn = document.getElementById('coins-btn');
    const coinsDropdown = document.getElementById('coins-dropdown');
    
    // Position the dropdown relative to the coins button
    function positionCoinsDropdown() {
        const rect = coinsBtn.getBoundingClientRect();
        coinsDropdown.style.position = 'fixed';
        coinsDropdown.style.top = `${rect.bottom + 5}px`;
        coinsDropdown.style.right = `${window.innerWidth - rect.right}px`;
    }
    
    // Initial positioning
    positionCoinsDropdown();
    
    // Reposition on window resize
    window.addEventListener('resize', positionCoinsDropdown);
    
    coinsBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        coinsDropdown.style.display = coinsDropdown.style.display === 'block' ? 'none' : 'block';
        positionCoinsDropdown();
    });
    
    // Close dropdown when clicking elsewhere
    document.addEventListener('click', function() {
        coinsDropdown.style.display = 'none';
    });
    
    // Coin modals functionality
    const coinModals = document.querySelectorAll('.coin-modal');
    const coinModalCloseBtns = document.querySelectorAll('.coin-modal .close');
    
    // Open coin modals
    document.getElementById('purchase-fiat').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('purchase-fiat-modal').style.display = 'block';
        coinsDropdown.style.display = 'none';
    });
    
    document.getElementById('purchase-crypto').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('purchase-crypto-modal').style.display = 'block';
        coinsDropdown.style.display = 'none';
    });
    
    document.getElementById('earn-friends').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('earn-friends-modal').style.display = 'block';
        coinsDropdown.style.display = 'none';
    });
    
    document.getElementById('daily-login').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('daily-login-modal').style.display = 'block';
        coinsDropdown.style.display = 'none';
        checkDailyLoginStatus();
        generateLoginCalendar();
    });
    
    document.getElementById('daily-dice').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('daily-dice-modal').style.display = 'block';
        coinsDropdown.style.display = 'none';
        checkDailyDiceStatus();
    });
    
    document.getElementById('watch-ads').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('watch-ads-modal').style.display = 'block';
        coinsDropdown.style.display = 'none';
        updateVideosRemaining();
    });
    
    // Close coin modals
    coinModalCloseBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.coin-modal').style.display = 'none';
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        coinModals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Daily login functionality
    function checkDailyLoginStatus() {
        const lastLogin = localStorage.getItem('lastLogin');
        const today = new Date().toDateString();
        
        if (lastLogin === today) {
            document.getElementById('daily-login-status').textContent = 'Already claimed today';
            document.getElementById('daily-login-status').className = 'daily-reward-status claimed';
            document.getElementById('claim-daily-login-btn').disabled = true;
        } else {
            document.getElementById('daily-login-status').textContent = 'Reward available';
            document.getElementById('daily-login-status').className = 'daily-reward-status available';
            document.getElementById('claim-daily-login-btn').disabled = false;
        }
    }
    
    function generateLoginCalendar() {
        const calendar = document.getElementById('login-calendar');
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        
        // Clear existing calendar days (except headers)
        while (calendar.children.length > 7) {
            calendar.removeChild(calendar.lastChild);
        }
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            calendar.appendChild(emptyDay);
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            
            // Mark today
            if (day === today.getDate()) {
                dayElement.classList.add('today');
            }
            
            // Mark claimed days (for demo, we'll mark some random days)
            if (Math.random() > 0.7 || day < today.getDate()) {
                dayElement.classList.add('claimed');
            }
            
            calendar.appendChild(dayElement);
        }
    }
    
    document.getElementById('claim-daily-login-btn').addEventListener('click', function() {
        const today = new Date().toDateString();
        localStorage.setItem('lastLogin', today);
        
        // Calculate reward based on consecutive days
        const consecutiveDays = parseInt(localStorage.getItem('consecutiveDays') || '0') + 1;
        localStorage.setItem('consecutiveDays', consecutiveDays);
        
        let reward = 10;
        if (consecutiveDays >= 7) {
            reward = 100;
        } else if (consecutiveDays >= 5) {
            reward = 50;
        } else if (consecutiveDays >= 3) {
            reward = 25;
        }
        
        alert(`You claimed ${reward} coins! Consecutive days: ${consecutiveDays}`);
        
        // Update UI
        document.getElementById('daily-login-status').textContent = 'Already claimed today';
        document.getElementById('daily-login-status').className = 'daily-reward-status claimed';
        this.disabled = true;
        
        // Update calendar
        generateLoginCalendar();
    });
    
    // Daily dice functionality
    function checkDailyDiceStatus() {
        const lastDiceRoll = localStorage.getItem('lastDiceRoll');
        const today = new Date().toDateString();
        
        if (lastDiceRoll === today) {
            document.getElementById('daily-dice-status').textContent = 'Already rolled today';
            document.getElementById('daily-dice-status').className = 'daily-reward-status claimed';
            document.getElementById('roll-dice-btn').disabled = true;
        } else {
            document.getElementById('daily-dice-status').textContent = 'Roll available';
            document.getElementById('daily-dice-status').className = 'daily-reward-status available';
            document.getElementById('roll-dice-btn').disabled = false;
        }
    }
    
    document.getElementById('roll-dice-btn').addEventListener('click', function() {
        const dice = document.getElementById('daily-dice');
        const diceResult = document.getElementById('dice-result');
        
        // Animate dice roll
        dice.classList.add('rolling');
        
        setTimeout(() => {
            dice.classList.remove('rolling');
            
            // Generate random result (1-6)
            const result = Math.floor(Math.random() * 6) + 1;
            dice.textContent = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'][result - 1];
            
            // Calculate reward
            let reward = 0;
            if (result <= 2) {
                reward = 10;
            } else if (result <= 4) {
                reward = 25;
            } else {
                reward = 50;
            }
            
            diceResult.textContent = `You rolled a ${result}! Earned ${reward} coins.`;
            
            // Update localStorage
            const today = new Date().toDateString();
            localStorage.setItem('lastDiceRoll', today);
            
            // Update UI
            document.getElementById('daily-dice-status').textContent = 'Already rolled today';
            document.getElementById('daily-dice-status').className = 'daily-reward-status claimed';
            this.disabled = true;
            
            alert(`You earned ${reward} coins!`);
        }, 1000);
    });
    
    // Watch ads functionality
    function updateVideosRemaining() {
        const videosWatched = parseInt(localStorage.getItem('videosWatchedToday') || '0');
        const videosRemaining = 5 - videosWatched;
        
        document.getElementById('videos-remaining').textContent = `${videosRemaining}/5`;
        
        if (videosRemaining <= 0) {
            document.getElementById('watch-video-btn').disabled = true;
            document.getElementById('watch-video-btn').textContent = 'No videos remaining';
        } else {
            document.getElementById('watch-video-btn').disabled = false;
            document.getElementById('watch-video-btn').textContent = 'Watch Video';
        }
    }
    
    document.getElementById('watch-video-btn').addEventListener('click', function() {
        const videosWatched = parseInt(localStorage.getItem('videosWatchedToday') || '0');
        const today = new Date().toDateString();
        const lastVideoDate = localStorage.getItem('lastVideoDate');
        
        // Reset counter if it's a new day
        if (lastVideoDate !== today) {
            localStorage.setItem('videosWatchedToday', '0');
            localStorage.setItem('lastVideoDate', today);
        }
        
        if (videosWatched < 5) {
            // Simulate watching a video
            alert('Watching video... Please wait 30 seconds.');
            
            setTimeout(() => {
                // Update counter
                const newVideosWatched = videosWatched + 1;
                localStorage.setItem('videosWatchedToday', newVideosWatched.toString());
                
                // Award coins
                alert('Video completed! You earned 20 coins.');
                
                // Update UI
                updateVideosRemaining();
            }, 2000); // Simulate 30 seconds with 2 seconds for demo
        }
    });
    
    // Share functionality
    document.getElementById('copy-link-btn').addEventListener('click', function() {
        const link = document.querySelector('.share-link').textContent;
        navigator.clipboard.writeText(link).then(() => {
            alert('Referral link copied to clipboard!');
        });
    });
    
    document.getElementById('share-facebook-btn').addEventListener('click', function() {
        const link = document.querySelector('.share-link').textContent;
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`, '_blank');
    });
    
    document.getElementById('share-twitter-btn').addEventListener('click', function() {
        const link = document.querySelector('.share-link').textContent;
        const text = 'Join me on Gambling Guys and earn rewards!';
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link)}`, '_blank');
    });
    
    // Lobby modal functionality
    const lobbyButton = document.querySelector('.lobby-button');
    const lobbyModal = document.getElementById('lobby-modal');
    const lobbyClose = document.getElementById('lobby-close');
    
    lobbyButton.addEventListener('click', function() {
        lobbyModal.style.display = 'block';
    });
    
    lobbyClose.addEventListener('click', function() {
        lobbyModal.style.display = 'none';
    });
    
    // Lobby floor buttons
    const lobbyFloorBtns = document.querySelectorAll('.lobby-floor-btn');
    
    lobbyFloorBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const floorNumber = this.closest('.lobby-floor').querySelector('.lobby-floor-number').textContent;
            alert(`Entering ${floorNumber}`);
        });
    });
    
    // Mini slots functionality
    const slotsBtn = document.getElementById('slots-btn');
    const miniSlots = document.getElementById('mini-slots');
    const slotsClose = document.getElementById('slots-close');
    const slotsSpinBtn = document.getElementById('slots-spin-btn');
    const slotsLever = document.getElementById('slots-lever');
    const betAmountSelect = document.getElementById('bet-amount');
    const reelCountSelect = document.getElementById('reel-count');
    const betDisplay = document.getElementById('bet-display');
    const winDisplay = document.getElementById('win-display');
    
    slotsBtn.addEventListener('click', function() {
        miniSlots.style.display = 'block';
    });
    
    slotsClose.addEventListener('click', function() {
        miniSlots.style.display = 'none';
    });
    
    // Update bet display when bet amount changes
    betAmountSelect.addEventListener('change', function() {
        betDisplay.textContent = this.value;
    });
    
    // Update reel count when changed
    reelCountSelect.addEventListener('change', function() {
        const reelCount = parseInt(this.value);
        const slotsDisplay = document.getElementById('slots-display');
        
        // Clear existing reels
        slotsDisplay.innerHTML = '';
        
        // Add new reels
        for (let i = 1; i <= reelCount; i++) {
            const reel = document.createElement('div');
            reel.className = 'slot-reel';
            reel.id = `reel${i}`;
            reel.textContent = getRandomSymbol();
            slotsDisplay.appendChild(reel);
        }
    });
    
    // Spin slots
    function spinSlots() {
        const reelCount = parseInt(reelCountSelect.value);
        const betAmount = parseInt(betAmountSelect.value);
        let winAmount = 0;
        
        // Animate lever pull
        slotsLever.classList.add('pulled');
        setTimeout(() => {
            slotsLever.classList.remove('pulled');
        }, 500);
        
        // Animate reels
        for (let i = 1; i <= reelCount; i++) {
            const reel = document.getElementById(`reel${i}`);
            
            // Add spinning animation
            let spinCount = 0;
            const spinInterval = setInterval(() => {
                reel.textContent = getRandomSymbol();
                spinCount++;
                
                if (spinCount > 10) {
                    clearInterval(spinInterval);
                    reel.textContent = getRandomSymbol();
                }
            }, 100);
        }
        
        // Calculate win after all reels stop
        setTimeout(() => {
            const symbols = [];
            for (let i = 1; i <= reelCount; i++) {
                const reel = document.getElementById(`reel${i}`);
                symbols.push(reel.textContent);
            }
            
            // Check for winning combinations
            if (symbols.every(symbol => symbol === symbols[0])) {
                // All symbols match
                winAmount = betAmount * 10;
            } else if (reelCount >= 3 && symbols.slice(0, 3).every(symbol => symbol === symbols[0])) {
                // First 3 symbols match
                winAmount = betAmount * 5;
            } else if (reelCount >= 4 && symbols.slice(0, 4).every(symbol => symbol === symbols[0])) {
                // First 4 symbols match
                winAmount = betAmount * 7;
            }
            
            winDisplay.textContent = winAmount;
            
            // Show win message
            if (winAmount > 0) {
                setTimeout(() => {
                    alert(`You won ${winAmount} coins!`);
                }, 500);
            }
        }, 1500);
    }
    
    slotsSpinBtn.addEventListener('click', spinSlots);
    slotsLever.addEventListener('click', spinSlots);
    
    function getRandomSymbol() {
        const symbols = ['🍒', '🍋', '🍊', '🍇', '🔔', '⭐', '💎', '7️⃣'];
        return symbols[Math.floor(Math.random() * symbols.length)];
    }
    
    // Chatbot functionality
    const chatbotBtn = document.getElementById('chatbot-btn');
    const chatbotModal = document.getElementById('chatbot-modal');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotScreenshot = document.getElementById('chatbot-screenshot');
    const chatbotFile = document.getElementById('chatbot-file');
    const fileInput = document.getElementById('file-input');
    
    chatbotBtn.addEventListener('click', function() {
        chatbotModal.style.display = 'flex';
    });
    
    chatbotClose.addEventListener('click', function() {
        chatbotModal.style.display = 'none';
    });
    
    // Send message function
    function sendMessage() {
        const message = chatbotInput.value.trim();
        if (message === '') return;
        
        // Add user message
        const userMessage = document.createElement('div');
        userMessage.className = 'chatbot-message user';
        userMessage.textContent = message;
        chatbotMessages.appendChild(userMessage);
        
        // Clear input
        chatbotInput.value = '';
        
        // Scroll to bottom
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        
        // Simulate bot response
        setTimeout(() => {
            const botMessage = document.createElement('div');
            botMessage.className = 'chatbot-message bot';
            
            // Simple response logic
            let response = "Thank you for your message. Our team will get back to you soon.";
            
            if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
                response = "Hello! How can I help you today?";
            } else if (message.toLowerCase().includes('help')) {
                response = "I'm here to help! You can ask me about games, account issues, or general questions.";
            } else if (message.toLowerCase().includes('game')) {
                response = "We have many exciting games available! Check out our Games section for more information.";
            } else if (message.toLowerCase().includes('withdraw') || message.toLowerCase().includes('cash')) {
                response = "For withdrawal requests, please visit the Cashout tab in your profile.";
            }
            
            botMessage.textContent = response;
            chatbotMessages.appendChild(botMessage);
            
            // Scroll to bottom
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }, 1000);
    }
    
    chatbotSend.addEventListener('click', sendMessage);
    
    chatbotInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Screenshot button
    chatbotScreenshot.addEventListener('click', function() {
        alert('Screenshot feature would be implemented here.');
    });
    
    // File button
    chatbotFile.addEventListener('click', function() {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            const fileName = this.files[0].name;
            
            // Add user message about file
            const userMessage = document.createElement('div');
            userMessage.className = 'chatbot-message user';
            userMessage.textContent = `File uploaded: ${fileName}`;
            chatbotMessages.appendChild(userMessage);
            
            // Clear input
            this.value = '';
            
            // Scroll to bottom
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            
            // Simulate bot response
            setTimeout(() => {
                const botMessage = document.createElement('div');
                botMessage.className = 'chatbot-message bot';
                botMessage.textContent = "Thank you for uploading your file. Our team will review it and get back to you soon.";
                chatbotMessages.appendChild(botMessage);
                
                // Scroll to bottom
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            }, 1000);
        }
    });
    
    // Play Now buttons for 5x5 grid
    const gamePlayNowBtns = document.querySelectorAll('#game-grid .play-now-btn');
    
    gamePlayNowBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const gameCard = this.closest('.game-card');
            const gameName = gameCard.getAttribute('data-name');
            window.location.href = `game-menu.html?game=${encodeURIComponent(gameName)}`;
        });
    });
    
    // Play Now buttons for weekly rotation
    const weeklyPlayNowBtns = document.querySelectorAll('.rotation-item .play-now-btn');
    
    weeklyPlayNowBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const weekNumber = this.closest('.rotation-item').querySelector('.week-number').textContent;
            window.location.href = `weekly-menu.html?week=${encodeURIComponent(weekNumber)}`;
        });
    });
    
    // Other Play Now buttons
    const otherPlayNowBtns = document.querySelectorAll('.featured-game .play-now-btn');
    
    otherPlayNowBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const gameTitle = this.closest('.featured-game').querySelector('h3').textContent;
            alert(`Loading ${gameTitle}...`);
        });
    });
    
    // Language selector
    const languageSelector = document.getElementById('language-selector');
    
    languageSelector.addEventListener('change', function() {
        const selectedLanguage = this.value;
        document.body.className = `lang-${selectedLanguage}`;
        alert(`Language changed to ${this.options[this.selectedIndex].text}`);
    });
    
    // Visitor counters animation
    function animateCounter(counterId, targetValue) {
        const counter = document.getElementById(counterId);
        const digits = counter.querySelectorAll('.odometer-digit');
        
        // Convert target value to string and pad with zeros if needed
        const targetString = targetValue.toString().padStart(digits.length, '0');
        
        // Animate each digit
        digits.forEach((digit, index) => {
            const targetDigit = targetString[index];
            let currentDigit = 0;
            
            const interval = setInterval(() => {
                if (currentDigit < parseInt(targetDigit)) {
                    currentDigit++;
                    digit.textContent = currentDigit;
                } else {
                    clearInterval(interval);
                }
            }, 100);
        });
    }
    
    // Simulate visitor counter updates
    setInterval(() => {
        // Update online counter
        const onlineCounter = document.getElementById('online-counter');
        const onlineDigits = onlineCounter.querySelectorAll('.odometer-digit');
        let onlineValue = '';
        
        onlineDigits.forEach(digit => {
            onlineValue += digit.textContent;
        });
        
        const newOnlineValue = parseInt(onlineValue) + Math.floor(Math.random() * 10) - 3;
        animateCounter('online-counter', Math.max(1000, newOnlineValue));
        
        // Update visitors counter
        const visitorsCounter = document.getElementById('visitors-counter');
        const visitorsDigits = visitorsCounter.querySelectorAll('.odometer-digit');
        let visitorsValue = '';
        
        visitorsDigits.forEach(digit => {
            visitorsValue += digit.textContent;
        });
        
        const newVisitorsValue = parseInt(visitorsValue) + Math.floor(Math.random() * 5);
        animateCounter('visitors-counter', newVisitorsValue);
    }, 5000);
    
    // Action buttons functionality
    const defaultBtn = document.getElementById('default-btn');
    const nameBtn = document.getElementById('name-btn');
    const useBtn = document.getElementById('use-btn');
    const colorBtn = document.getElementById('color-btn');
    const gameGrid = document.getElementById('game-grid');
    const gameCards = document.querySelectorAll('.game-card');
    
    // Store original order
    const originalOrder = Array.from(gameCards);
    let previousOrder = [...originalOrder];
    
    // Track click counts
    let defaultClickCount = 0;
    let nameClickCount = 0;
    let useClickCount = 0;
    let colorClickCount = 0;
    
    // Apply vibrant colors to game cards
    gameCards.forEach(card => {
        const color = card.getAttribute('data-color');
        card.style.backgroundColor = color;
    });
    
    // Default button functionality
    defaultBtn.addEventListener('click', function() {
        defaultClickCount++;
        
        if (defaultClickCount % 2 === 0) {
            // Even number of clicks - reset to original order
            gameGrid.innerHTML = '';
            originalOrder.forEach(card => {
                gameGrid.appendChild(card);
            });
        } else {
            // Odd number of clicks - restore previous order
            gameGrid.innerHTML = '';
            previousOrder.forEach(card => {
                gameGrid.appendChild(card);
            });
        }
    });
    
    // Name button functionality
    nameBtn.addEventListener('click', function() {
        nameClickCount++;
        
        // Store current order before changing
        previousOrder = Array.from(gameGrid.children);
        
        // Get all game cards
        const cards = Array.from(gameGrid.children);
        
        // Sort by name
        cards.sort((a, b) => {
            const nameA = a.getAttribute('data-name').toLowerCase();
            const nameB = b.getAttribute('data-name').toLowerCase();
            
            if (nameClickCount % 2 === 0) {
                // Even - A to Z
                return nameA.localeCompare(nameB);
            } else {
                // Odd - Z to A
                return nameB.localeCompare(nameA);
            }
        });
        
        // Reorder the grid
        gameGrid.innerHTML = '';
        cards.forEach(card => {
            gameGrid.appendChild(card);
        });
    });
    
    // Use button functionality
    useBtn.addEventListener('click', function() {
        useClickCount++;
        
        // Store current order before changing
        previousOrder = Array.from(gameGrid.children);
        
        // Get all game cards
        const cards = Array.from(gameGrid.children);
        
        // Sort by usage count
        cards.sort((a, b) => {
            const usesA = parseInt(a.getAttribute('data-uses'));
            const usesB = parseInt(b.getAttribute('data-uses'));
            
            if (useClickCount % 2 === 0) {
                // Even - most used to least used
                return usesB - usesA;
            } else {
                // Odd - least used to most used
                return usesA - usesB;
            }
        });
        
        // Reorder the grid
        gameGrid.innerHTML = '';
        cards.forEach(card => {
            gameGrid.appendChild(card);
        });
    });
    
    // Color button functionality
    colorBtn.addEventListener('click', function() {
        colorClickCount++;
        
        // Store current order before changing
        previousOrder = Array.from(gameGrid.children);
        
        // Get all game cards
        const cards = Array.from(gameGrid.children);
        
        // Function to calculate brightness of a color
        function getBrightness(color) {
            // Convert hex to RGB
            const hex = color.replace('#', '');
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            
            // Calculate brightness (perceived brightness)
            return (r * 299 + g * 587 + b * 114) / 1000;
        }
        
        // Sort by brightness
        cards.sort((a, b) => {
            const brightnessA = getBrightness(a.getAttribute('data-color'));
            const brightnessB = getBrightness(b.getAttribute('data-color'));
            
            if (colorClickCount % 2 === 0) {
                // Even - brightest to darkest
                return brightnessB - brightnessA;
            } else {
                // Odd - darkest to brightest
                return brightnessA - brightnessB;
            }
        });
        
        // Reorder the grid
        gameGrid.innerHTML = '';
        cards.forEach(card => {
            gameGrid.appendChild(card);
        });
    });
    
    // Drag and drop functionality for 5x5 grid
    let draggedElement = null;
    
    gameCards.forEach(card => {
        card.addEventListener('dragstart', function(e) {
            draggedElement = this;
            this.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        });
        
        card.addEventListener('dragend', function() {
            this.classList.remove('dragging');
        });
        
        card.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });
        
        card.addEventListener('drop', function(e) {
            e.preventDefault();
            
            if (this !== draggedElement) {
                // Get all game cards
                const allCards = Array.from(gameGrid.children);
                const draggedIndex = allCards.indexOf(draggedElement);
                const targetIndex = allCards.indexOf(this);
                
                if (draggedIndex < targetIndex) {
                    // Insert after target
                    gameGrid.insertBefore(draggedElement, this.nextSibling);
                } else {
                    // Insert before target
                    gameGrid.insertBefore(draggedElement, this);
                }
            }
        });
    });
    
    // Check for daily rewards reset at 12:00 AM UTC
    function checkDailyReset() {
        const now = new Date();
        const utcHours = now.getUTCHours();
        const utcMinutes = now.getUTCMinutes();
        const utcSeconds = now.getUTCSeconds();
        
        // If it's 12:00:00 AM UTC, reset daily rewards
        if (utcHours === 0 && utcMinutes === 0 && utcSeconds === 0) {
            // Reset daily login
            localStorage.removeItem('lastLogin');
            
            // Reset daily dice
            localStorage.removeItem('lastDiceRoll');
            
            // Reset video watches
            localStorage.removeItem('videosWatchedToday');
            localStorage.removeItem('lastVideoDate');
            
            // Reset consecutive days
            localStorage.setItem('consecutiveDays', '0');
            
            // Reset coins rewarded
            localStorage.removeItem('coinsRewarded');
            
            console.log('Daily rewards reset at 12:00 AM UTC');
        }
    }
    
    // Check every second if it's time to reset
    setInterval(checkDailyReset, 1000);
});
