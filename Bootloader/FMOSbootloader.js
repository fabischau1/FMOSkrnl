// FMOSbootloader.js

const FMOSbootloader = (function () {

function bootscreen(url) {
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.style.position = 'fixed';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.zIndex = '9999';

    document.body.appendChild(iframe);

    setTimeout(() => {
        document.body.removeChild(iframe);
    }, 5000);
}
    // Public API
    return {
        bootscreen,
    };
})();