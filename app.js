// Meme Credit Union — Site Scripts (extracted from inline)

// Smooth scrolling for internal links only
(function () {
  var anchors = document.querySelectorAll('a[href^="#"]');
  anchors.forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });
})();

// Copy contract address to clipboard
(function () {
  var copyBtn = document.getElementById('copyButton');
  if (!copyBtn) return;
  copyBtn.addEventListener('click', function () {
    var el = document.getElementById('contractAddress');
    if (!el) return;
    var contractAddress = (el.textContent || '').trim();
    if (!contractAddress) return;
    navigator.clipboard.writeText(contractAddress).then(function () {
      copyBtn.textContent = 'Copied';
      setTimeout(function () { copyBtn.textContent = 'Copy'; }, 2000);
    }).catch(function () {
      copyBtn.textContent = 'Error';
      setTimeout(function () { copyBtn.textContent = 'Copy'; }, 2000);
    });
  });
})();