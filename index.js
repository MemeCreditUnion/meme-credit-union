// Wallet connection state

let walletAdapter = null;

let isWalletConnected = false;

let userWalletAddress = null;



// Solend market data

let solendAssets = [];



// Fetch real Solend market data

async function fetchSolendData() {

    try {

        const response = await fetch('https://api.solend.fi/v1/markets/main');

        const marketData = await response.json();



        if (marketData && marketData.reserves) {

            solendAssets = marketData.reserves.map(reserve => {

                const supplyAPY = (reserve.rates.supplyInterest * 100).toFixed(2) + '%';

                const borrowAPY = (reserve.rates.borrowInterest * 100).toFixed(2) + '%';



                return {

                    symbol: reserve.asset.symbol,

                    name: reserve.asset.name,

                    icon: getAssetIcon(reserve.asset.symbol),

                    supplyAPY: supplyAPY,

                    borrowAPY: borrowAPY,

                    balance: getUserBalance(reserve.asset.symbol),

                    price: formatPrice(reserve.asset.price),

                    mintAddress: reserve.asset.mintAddress,

                    totalSupply: reserve.totalSupply,

                    totalBorrow: reserve.totalBorrow,

                    utilizationRate: (reserve.utilizationRate * 100).toFixed(2) + '%'

                };

            });

        }

    } catch (error) {

        console.error('Failed to fetch Solend data:', error);

        solendAssets = getMockAssets();

    }

}



// Get asset icon based on symbol

function getAssetIcon(symbol) {

    const icons = {

        'SOL': '◎',

        'USDC': '$',

        'ETH': 'Ξ',

        'BTC': '₿',

        'USDT': '₮',

        'mSOL': '◎',

        'stSOL': '◎',

        'RAY': '☀',

        'SRM': '🌊',

        'FTT': '🔥'

    };

    return icons[symbol] || '●';

}



// Get user balance for asset (placeholder)

function getUserBalance(symbol) {

    if (!isWalletConnected) return '0.00';

  

    const mockBalances = {

        'SOL': '12.45',

        'USDC': '1,250.00',

        'ETH': '2.18',

        'BTC': '0.156',

        'USDT': '500.00'

    };

    return mockBalances[symbol] || '0.00';

}



// Format price display

function formatPrice(price) {

    if (price < 1) {

        return `$${price.toFixed(4)}`;

    } else if (price < 1000) {

        return `$${price.toFixed(2)}`;

    } else {

        return `$${price.toLocaleString()}`;

    }

}



// Fallback mock data

function getMockAssets() {

    return [

        {

            symbol: 'SOL',

            name: 'Solana',

            icon: '◎',

            supplyAPY: '4.2%',

            borrowAPY: '6.8%',

            balance: '12.45',

            price: '$24.50'

        },

        {

            symbol: 'USDC',

            name: 'USD Coin',

            icon: '$',

            supplyAPY: '8.1%',

            borrowAPY: '12.3%',

            balance: '1,250.00',

            price: '$1.00'

        },

        {

            symbol: 'ETH',

            name: 'Ethereum',

            icon: 'Ξ',

            supplyAPY: '3.8%',

            borrowAPY: '5.9%',

            balance: '2.18',

            price: '$1,650.00'

        },

        {

            symbol: 'BTC',

            name: 'Bitcoin',

            icon: '₿',

            supplyAPY: '2.1%',

            borrowAPY: '4.5%',

            balance: '0.156',

            price: '$43,200.00'

        }

    ];

}



// Wallet connection functions

async function connectWallet() {

    try {

        if (typeof window.solana !== 'undefined') {

            const provider = window.solana;



            if (provider.isPhantom || provider.isSolflare || provider.isBackpack) {

                await provider.connect();

                userWalletAddress = provider.publicKey.toString();

                isWalletConnected = true;

                updateWalletUI();

                console.log('Connected to wallet:', userWalletAddress);

            }

        }

    } catch (error) {

        console.error('Wallet connection failed:', error);

        alert('Failed to connect wallet. Please ensure you have a Solana wallet installed.');

    }

}



function checkWalletConnection() {

    if (typeof window.solana !== 'undefined' && window.solana.isConnected) {

        userWalletAddress = window.solana.publicKey.toString();

        isWalletConnected = true;

        updateWalletUI();

    }

}



function updateWalletUI() {

    const walletBtn = document.querySelector('.wallet-btn');



    if (isWalletConnected && userWalletAddress) {

        const shortAddress = `${userWalletAddress.slice(0, 4)}...${userWalletAddress.slice(-4)}`;

        walletBtn.textContent = shortAddress;

        walletBtn.onclick = disconnectWallet;

    } else {

        walletBtn.textContent = 'Connect Wallet';

        walletBtn.onclick = connectWallet;

    }

}



function disconnectWallet() {

    if (typeof window.solana !== 'undefined') {

        window.solana.disconnect();

    }

    userWalletAddress = null;

    isWalletConnected = false;

    updateWalletUI();

    console.log('Wallet disconnected');

}



document.addEventListener('DOMContentLoaded', () => {

    const assetsGrid = document.querySelector('.assets-grid');



    // Initialize app

    initializeApp();



    async function initializeApp() {

        assetsGrid.innerHTML = '<div class="loading">Loading Solend market data...</div>';

        await fetchSolendData();

        renderAssets();

        setInterval(async () => {

            await fetchSolendData();

            renderAssets();

        }, 30000);

    }



    function renderAssets() {

        assetsGrid.innerHTML = '';



        const assetsToRender = solendAssets.length > 0 ? solendAssets : getMockAssets();

        assetsToRender.forEach(asset => {

            const assetCard = createAssetCard(asset);

            assetsGrid.appendChild(assetCard);

        });

    }



    function createAssetCard(asset) {

        const card = document.createElement('div');

        card.className = 'asset-card';

        card.onclick = () => openModal(asset);



        card.innerHTML = `

            <div class="asset-header">

                <div class="asset-icon">${asset.icon}</div>

                <div>

                    <div class="asset-name">${asset.name}<span class="asset-symbol">${asset.symbol}</span></div>

                    <div class="asset-price">${asset.price}</div>

                </div>

            </div>

            <div class="asset-stats">

                <div class="stat">

                    <div class="stat-label">Supply APY</div>

                    <div class="stat-value">${asset.supplyAPY}</div>

                </div>

                <div class="stat">

                    <div class="stat-label">Your Balance</div>

                    <div class="stat-value">${asset.balance} ${asset.symbol}</div>

                </div>

            </div>

        `;



        return card;

    }



    function openModal(asset) {

        // Modal opening logic

    }



    // Check if wallet is already connected on page load

    checkWalletConnection();

});