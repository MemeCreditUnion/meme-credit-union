document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        console.log('Clicked internal link: ' + this.getAttribute('href'));
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
        // Close mobile menu after clicking a link
        const mobileMenu = document.getElementById('mobileMenu');
        mobileMenu.classList.add('hidden');
    });
});

document.getElementById('copyButton').addEventListener('click', function () {
    const contractAddress = document.getElementById('contractAddress').textContent;
    navigator.clipboard.writeText(contractAddress).then(() => {
        this.textContent = 'Copied!';
        setTimeout(() => {
            this.textContent = 'Copy Address';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
        this.textContent = 'Error';
        setTimeout(() => {
            this.textContent = 'Copy Address';
        }, 2000);
    });
});

document.getElementById('menuButton').addEventListener('click', function () {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('hidden');
    mobileMenu.classList.toggle('active');
});

// Handle GIF load failures
document.querySelectorAll('.giphy-embed').forEach(iframe => {
    iframe.addEventListener('error', () => {
        const parent = iframe.parentElement;
        parent.querySelector('.gif-fallback').style.display = 'block';
        iframe.style.display = 'none';
    });
});
document.querySelectorAll('.popcat-gif img').forEach(img => {
    img.addEventListener('error', () => {
        const parent = img.parentElement;
        parent.querySelector('.gif-fallback').style.display = 'block';
        img.style.display = 'none';
    });
});
