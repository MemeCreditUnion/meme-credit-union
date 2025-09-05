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