const appContent = document.getElementById("app-content");
const navItems = document.querySelectorAll(".nav-item");

let walletAddress = null;

function truncateKey(key) {
  if (!key || key.length < 8) return "N/A";
  return key.slice(0, 4) + "..." + key.slice(-4);
}

function updateWalletUI() {
  const btn = document.getElementById("connectWallet");
  btn.textContent = walletAddress ? truncateKey(walletAddress) : "Login";
}

async function connectPhantom() {
  const solana = window.solana;

  if (!solana || !solana.isPhantom) {
    alert("Install Phantom Wallet");
    return;
  }

  try {
    const resp = await solana.connect();
    walletAddress = resp.publicKey.toString();
    updateWalletUI();
  } catch (err) {
    console.error("Connection failed", err);
  }
}

function renderPage(page) {
  const pages = {
    home: "<h1 style='text-align:center'>Home</h1>",
    lending: "<h1 style='text-align:center'>Lending Coming Soon</h1>",
    dex: "<h1 style='text-align:center'>DEX</h1>",
    flywheel: "<h1 style='text-align:center'>Flywheel</h1>",
    staking: "<h1 style='text-align:center'>Staking Coming Soon</h1>"
  };

  appContent.innerHTML = pages[page] || pages.home;
}

window.onload = () => {
  renderPage("home");

  document
    .getElementById("connectWallet")
    .addEventListener("click", connectPhantom);
};
