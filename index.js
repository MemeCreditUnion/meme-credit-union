const appContent = document.getElementById('app-content');
const navItems = document.querySelectorAll('.bottom-nav .nav-item');

let walletAddress = null;

function truncateKey(key) {
  if (!key || key.length < 8) return 'N/A';
  return key.substring(0, 4) + '...' + key.substring(key.length - 4);
}

function updateWalletUI() {
  const headerButton = document.getElementById('connectWallet');
  const heroButton = document.getElementById('heroConnectWallet');

  const buttonText = walletAddress ? truncateKey(walletAddress) : 'Login';
  const className = walletAddress ? 'connected' : '';

  if (headerButton) {
    headerButton.textContent = buttonText;
    headerButton.className = 'wallet-connect-btn ' + className;
  }

  if (heroButton) {
    heroButton.textContent = buttonText;
    heroButton.className = 'wallet-connect-btn ' + className;
  }
}

// ✅ FULL PAGE CONTENT RESTORED
const pageContent = {
  home: `
    <section style="text-align:center;padding:60px;background:white;border-radius:12px;">
      <h1>Decentralizing Finance.</h1>
      <p>Your community-owned, Solana-native protocol.</p>
      <button id="heroConnectWallet" class="wallet-connect-btn">Login</button>
    </section>
  `,

  lending: `
    <h1 class="page-header">Lending & Borrowing</h1>
    <p style="text-align:center;">Coming Soon</p>
  `,

  dex: `
    <h1 class="page-header">DEX</h1>
    <a href="https://dex.memecreditunion.com" target="_blank" class="wallet-connect-btn">
      Enter DEX
    </a>
  `,

  flywheel: `
    <h1 class="page-header">Flywheel</h1>
    <p>Flywheel strategy overview restored.</p>
  `,

  staking: `
    <h1 class="page-header">$MCU Staking</h1>
    <p>Coming Soon</p>
  `
};

function renderPage(pageId) {
  const content = pageContent[pageId] || pageContent.home;
  appContent.innerHTML = content;
  updateWalletUI();
  updateActiveNavButton(pageId);

  const heroButton = document.getElementById('heroConnectWallet');
  if (heroButton) {
    heroButton.addEventListener('click', connectPhantom);
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateActiveNavButton(activePageId) {
  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.dataset.page === activePageId) {
      item.classList.add('active');
    }
  });
}

async function connectPhantom() {
  const solana = window.solana;

  if (walletAddress) {
    walletAddress = null;
    updateWalletUI();
    return;
  }

  if (!solana || !solana.isPhantom) {
    alert('Please install Phantom Wallet.');
    return;
  }

  try {
    const resp = await solana.connect();
    walletAddress = resp.publicKey.toString();
    updateWalletUI();
  } catch (e) {
    console.error(e);
  }
}

window.onload = function () {
  renderPage('home');
  document.getElementById('connectWallet').addEventListener('click', connectPhantom);
};
