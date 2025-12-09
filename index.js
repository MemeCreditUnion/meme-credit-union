const appContent = document.getElementById('app-content');
const navItems = document.querySelectorAll('.bottom-nav .nav-item');

// --- WALLET STATE ---
let walletAddress = null;

/**
 * Truncates a Solana public key for display.
 * @param {string} key The full public key string.
 * @returns {string} The truncated key.
 */
function truncateKey(key) {
    if (!key || key.length < 8) return 'N/A';
    return key.substring(0, 4) + '...' + key.substring(key.length - 4);
}

/**
 * Updates the text and appearance of both Login buttons.
 */
function updateWalletUI() {
    const headerButton = document.getElementById('connectWallet');
    const heroButton = document.getElementById('heroConnectWallet');
    
    const buttonText = walletAddress ? truncateKey(walletAddress) : 'Login';
    const className = walletAddress ? 'connected' : '';

    // Update Header Button
    if (headerButton) {
        headerButton.textContent = buttonText;
        headerButton.className = 'wallet-connect-btn ' + className;
    }

    // Update Hero Button (if it exists on the current page)
    if (heroButton) {
        heroButton.textContent = buttonText;
        heroButton.className = 'wallet-connect-btn ' + className;
    }
}

/**
 * Checks if the user is likely on a mobile device based on screen size.
 * Note: This is a heuristic, not a guaranteed method.
 */
function isMobileDevice() {
    return window.matchMedia("(max-width: 768px)").matches;
}


/**
 * Connects to the Phantom Wallet (or disconnects if already connected).
 */
async function connectPhantom() {
    if (walletAddress) {
        // If connected, handle disconnection (Phantom usually doesn't need an explicit disconnect call for the wallet object)
        walletAddress = null;
        updateWalletUI();
        console.log('Wallet disconnected (UI update only).');
        return;
    }

    const solana = window.solana;
    
    if (solana && solana.isPhantom) {
        try {
            console.log('Attempting to connect to Phantom...');
            // Request connection
            const resp = await solana.connect();
            const publicKey = resp.publicKey.toString();
            
            walletAddress = publicKey;
            console.log('Wallet connected:', publicKey);
            updateWalletUI();

        } catch (err) {
            // Handle rejection or error
            console.error('Phantom connection failed:', err);
            alertUserMessage('Wallet connection request rejected or failed. Please try again.', 'error');
        }
    } else {
        // Handle Phantom not found - give better guidance for mobile vs desktop
        console.warn('Phantom wallet provider not found.');
        
        let guidanceMessage = 'Phantom wallet not found. ';

        if (isMobileDevice()) {
            guidanceMessage += 'For mobile connection, please ensure you open this application within the Phantom mobile app browser.';
        } else {
            guidanceMessage += 'Please install the Phantom browser extension and refresh the page.';
        }

        alertUserMessage(guidanceMessage, 'warning');
    }
}

/**
 * Simple custom message display instead of alert().
 */
function alertUserMessage(message, type) {
    console.log(`[USER MESSAGE - ${type.toUpperCase()}]: ${message}`);
    
    // Basic UI simulation for feedback
    const messageBar = document.createElement('div');
    messageBar.style.cssText = `
        position: fixed; top: 70px; left: 50%; transform: translateX(-50%); z-index: 2000;
        padding: 10px 20px; border-radius: 8px; font-weight: bold; text-align: center;
        max-width: 90%;
        background-color: ${type === 'error' ? '#f44336' : (type === 'warning' ? '#ff9800' : '#4CAF50')};
        color: white; box-shadow: 0 4px 8px rgba(0,0,0,0.2); transition: opacity 0.5s;
    `;
    messageBar.textContent = message;
    document.body.appendChild(messageBar);

    setTimeout(() => {
        messageBar.style.opacity = 0;
        setTimeout(() => messageBar.remove(), 500);
    }, 5000); // Increased visibility time for reading long guidance messages
}

// --- PAGE CONTENT TEMPLATES ---
const pageContent = {
    home: `
        <section id="hero-new" style="text-align: center; padding: 60px 20px; background-color: white; border-radius: 10px; margin-bottom: 40px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
            <h1 style="font-size: 3em; color: #333; margin-bottom: 10px;">Decentralizing Finance.</h1>
            <p style="font-size: 1.2em; color: #555; margin-bottom: 30px;">Your community-owned, Solana-native protocol for seamless lending, staking, and trading.</p>
            <button id="heroConnectWallet" class="wallet-connect-btn" 
               style="background-color: #9945FF; color: white; border-color: #9945FF; padding: 15px 30px; height: auto; display: block; margin: 0 auto;">
               Login
            </button>
        </section>
        <section id="features-new" style="padding-bottom: 20px;">
            <h2 style="text-align: center; font-size: 2em; color: #333; margin-bottom: 30px;">Our Four Core Pillars</h2>
            <div class="card-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
                <div class="info-card"><h3>Lending</h3><p>Earn interest or borrow against your assets.</p></div>
                <div class="info-card"><h3>DEX</h3><p>Trade tokens with low fees and deep liquidity.</p></div>
                <div class="info-card"><h3>Flywheel</h3><p>Automated compounding for maximized rewards.</p></div>
                <div class="info-card"><h3>Staking</h3><p>Secure the protocol and earn governance rewards.</p></div>
            </div>
        </section>
    `,

    lending: `
        <h1 class="page-header">Lending & Borrowing</h1>
        <section style="text-align: center; padding: 60px 20px; background-color: white; border-radius: 10px; margin-bottom: 40px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
            <h2 style="font-size: 2.5em; color: #9945FF; margin-bottom: 15px;">Coming Soon!</h2>
            <p style="font-size: 1.4em; color: #555; margin-bottom: 30px;">This feature is currently under heavy development.</p>
            <p style="font-size: 1.1em; color: #777;">We're working hard to bring seamless, high-yield lending and low-cost borrowing to the Meme Credit Union. Follow our X for launch announcements!</p>
            <div style="margin-top: 30px;">
                <a href="https://twitter.com/MemeCreditUnion" target="_blank" class="wallet-connect-btn" style="background-color: #9945FF; color: white; border-color: #9945FF; padding: 12px 25px; height: auto; display: inline-flex;">
                    Follow us on X
                </a>
            </div>
        </section>
    `,

    dex: `
        <h1 class="page-header">Decentralized Exchange</h1>
        <section style="text-align: center; padding: 40px; background-color: white; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
            <h2 style="font-size: 1.8em; color: #333; margin-bottom: 30px;">Trade perpetual futures on Solana.</h2>
            
            <a href="https://dex.memecreditunion.com" target="_blank" class="wallet-connect-btn" 
               style="max-width: 250px; width: 80%; background-color: #9945FF; color: white; border-color: #9945FF; padding: 15px 30px; height: auto; font-size: 1.1em; display: block; margin: 0 auto;">
                Enter DEX Now
            </a>
        </section>
    `,

    flywheel: `
        <h1 class="page-header">Flywheel Optimization</h1>
        <section style="padding: 20px 0;">
            <p style="text-align: center; margin-bottom: 30px; font-size: 1.1em; color: #555;">
                The $MCU Flywheel is designed to generate sustainable yield and grow protocol liquidity through automated strategies.
            </p>
            
            <h2 style="color: #9945FF; margin-bottom: 20px; font-size: 1.8em;">How the Flywheel Works:</h2>
            
            <div style="text-align: center; margin-bottom: 30px;">
                <p style="font-style: italic; color: #9945FF;"></p>
            </div>

            <div class="flywheel-step">
                <h3>1️⃣ Treasury & Yield</h3>
                <ul>
                    <li><strong>Source:</strong> Creator rewards, LP fees, staked $SOL yield.</li>
                    <li><strong>Action:</strong> Aggregate yields and automatically reinvest them back into the protocol.</li>
                    <li><strong>Impact:</strong> Fuels our next moves and ensures capital efficiency.</li>
                </ul>
            </div>

            <div class="flywheel-step">
                <h3>2️⃣ Fund pump.fun AMMs</h3>
                <ul>
                    <li><strong>Strategy:</strong> Pair selection focusing on major tokens and high-potential memes.</li>
                    <li><strong>Execution:</strong> Launch new AMMs (MCU/SOL is already live ✅).</li>
                    <li><strong>Funding:</strong> Seed AMMs with funds from the Treasury and community LP contributions.</li>
                    <li><strong>Growth:</strong> Implement trader & creator incentives to grow liquidity.</li>
                </ul>
            </div>

            <div class="flywheel-step">
                <h3>3️⃣ Fund Meteora DAMM V2</h3>
                <ul>
                    <li><strong>Power Source:</strong> Powered by creator rewards + LP + SOL yield.</li>
                    <li><strong>Mechanism:</strong> Utilizes diversified strategies to harvest sustainable returns.</li>
                    <li><strong>Benefit:</strong> DAMM pools actively strengthen liquidity for $MCU.</li>
                </ul>
            </div>

            <div class="flywheel-step">
                <h3>4️⃣ Governance</h3>
                <ul>
                    <li><strong>Control:</strong> Community votes on which pools and incentives to prioritize.</li>
                    <li><strong>Oversight:</strong> Continuous monitoring of Total Value Locked (TVL), Impermanent Loss (IL), and overall risk.</li>
                    <li><strong>Transparency:</strong> Transparent reporting + rewards for Liquidity Providers (LPs).</li>
                </ul>
            </div>
            
            <div style="margin-top: 40px; text-align: center;">
                <a href="https://dune.com/memecreditunion/flywheel" target="_blank" class="wallet-connect-btn" 
                        style="background-color: #9945FF; color: white; border-color: #9945FF; height: auto; 
                               padding: 12px 30px; font-size: 1.1em; font-weight: bold; border-radius: 10px; 
                               box-shadow: 0 3px 8px rgba(153, 69, 255, 0.3); transition: all 0.2s ease-in-out; 
                               display: inline-flex; /* Use inline-flex for centering flexibility */
                               margin: 0 auto; max-width: 280px;">
                    Enter the Flywheel
                </a>
            </div>
        </section>
    `,

    staking: `
        <h1 class="page-header">$MCU Staking</h1>
        <section id="staking-details" style="text-align: center; padding: 60px 20px; background-color: white; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
            <h2 style="font-size: 2.5em; color: #9945FF; margin-bottom: 15px;">Coming Soon!</h2>
            <p style="font-size: 1.4em; color: #555; margin-bottom: 30px;">This feature is currently under heavy development.</p>
            <p style="font-size: 1.1em; color: #777;">Soon, you'll be able to stake your $MCU to secure the protocol and earn governance rewards. Follow our X for the latest news!</p>
            <div style="margin-top: 30px;">
                <a href="https://twitter.com/MemeCreditUnion" target="_blank" class="wallet-connect-btn" style="background-color: #9945FF; color: white; border-color: #9945FF; padding: 12px 25px; height: auto; display: inline-flex;">
                    Follow us on X
                </a>
            </div>
        </section>
    `
};


// --- RENDERING FUNCTION ---
function renderPage(pageId) {
    // 1. Clear and fade out old content
    appContent.style.opacity = 0;
    
    // 2. Set timeout to wait for fade-out, then change content and fade in
    setTimeout(() => {
        const content = pageContent[pageId] || pageContent.home;
        appContent.innerHTML = content;
        updateWalletUI(); // Call again after content changes, especially for the hero button
        appContent.style.opacity = 1;
        updateActiveNavButton(pageId);
        
        // --- POST-RENDER LOGIC ---
        // Attach listener to the dynamically created hero button if it exists
        const heroButton = document.getElementById('heroConnectWallet');
        if (heroButton) {
            heroButton.addEventListener('click', connectPhantom);
        }

    }, 300); // 300ms transition time

    // 3. Scroll to the top of the main content area
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- NAVIGATION HIGHLIGHT FUNCTION ---
function updateActiveNavButton(activePageId) {
    navItems.forEach(item => {
        item.classList.remove('active');
        // Check if the data-page attribute matches the active page ID
        if (item.dataset.page === activePageId) {
            item.classList.add('active');
        }
    });
}

// --- INITIALIZATION ---
window.onload = function() {
    // Initial render on load
    renderPage('home');

    // Attach listener to the static header button
    document.getElementById('connectWallet').addEventListener('click', connectPhantom);

    // Attempt to check if Phantom is already connected on load
    if (window.solana && window.solana.isPhantom && window.solana.isConnected) {
        walletAddress = window.solana.publicKey.toString();
        console.log('Phantom already connected on load.');
        updateWalletUI();
    }
}
