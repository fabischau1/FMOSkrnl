// FMOSapp.js

const FMOSapp = (function () {

function app(url) { 
  const iframeWindow = document.createElement('div');
  iframeWindow.className = 'windowstore';
  iframeWindow.innerHTML = `
    <div class="window-header" style="display: flex; justify-content: space-between; align-items: center;">
      <span>App</span>
      <div style="display: flex; gap: 5px;">
        <button onclick="toggleFullscreenstore()" style="background:none; border:none; color: #ff5c5c; font-size: 16px;" class="redlightcolor">🗖</button>
        <button onclick="closeeeeeeeeeeee()" style="background:none; border:none; color: #ff5c5c; font-size: 16px;" class="redlightcolor">X</button>
      </div>
    </div>
    <div class="window-body">
      <iframe id="iframe" frameborder="0" width="100%" height="550px" src="${url}"></iframe>
      <div class="resize-handle"></div>
    </div>
  `;
  document.body.appendChild(iframeWindow);
  iframeWindow.style.top = '50px';
  iframeWindow.style.left = '50px';
  iframeWindow.style.display = 'block';

  iframeWindow.classList.add('animate-in');

  let isDragging = false;
  let offsetX, offsetY;

  iframeWindow.querySelector('.window-header').addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - iframeWindow.offsetLeft;
    offsetY = e.clientY - iframeWindow.offsetTop;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  });

  function handleMouseMove(e) {
    if (isDragging) {
      const newX = e.clientX - offsetX;
      const newY = e.clientY - offsetY;

      iframeWindow.style.top = `${newY}px`;
      iframeWindow.style.left = `${newX}px`;
    }
  }

  function handleMouseUp() {
    isDragging = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }

  let isResizing = false;
  let startX, startY, startWidth, startHeight;

  iframeWindow.querySelector('.resize-handle').addEventListener('mousedown', (e) => {
    isResizing = true;
    startX = e.clientX;
    startY = e.clientY;
    startWidth = iframeWindow.offsetWidth;
    startHeight = iframeWindow.offsetHeight;

    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeUp);
  });

  function handleResizeMove(e) {
    if (isResizing) {
      const newWidth = startWidth + (e.clientX - startX);
      const newHeight = startHeight + (e.clientY - startY);

      iframeWindow.style.width = `${newWidth}px`;
      iframeWindow.style.height = `${newHeight}px`;

      const iframe = iframeWindow.querySelector('#iframe');
      iframe.style.width = `${newWidth}px`;
      iframe.style.height = `${newHeight - 20}px`;
    }
  }

  function handleResizeUp() {
    isResizing = false;
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeUp);
  }
}

function closeapp() {
  document.querySelector('.windowstore').remove();
}

function toggleFullscreen() {
  const iframeWindow = document.querySelector('.windowstore');
  const iframe = document.querySelector('#iframe');
  
  if (iframeWindow.classList.contains('fullscreen')) {
    iframeWindow.classList.remove('fullscreen');
    iframeWindow.style.top = '50px';
    iframeWindow.style.left = '50px';
    iframeWindow.style.width = '600px';
    iframeWindow.style.height = '600px';
    iframe.style.width = '100%';
    iframe.style.height = '550px';
  } else {
    iframeWindow.classList.add('fullscreen');
    iframeWindow.style.top = '0';
    iframeWindow.style.left = '0';
    iframeWindow.style.width = '100vw';
    iframeWindow.style.height = '100vh';
    iframe.style.width = '100%';
    iframe.style.height = 'calc(100vh - 20px)';
  }
}
    // Public API
    return {
        app,
		toggleFullscreen,
		closeapp,
		handleResizeUp,
		handleResizeMove,
		handleMouseUp,
		handleMouseMove,
    };
})();