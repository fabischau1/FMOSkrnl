//FMOS terminal

const FMOSterminal = (function () {
//TERMINAL________________________________________________________________________________________
        function Terminal() {
			alert("WARNING DONT EXECUTE CODE FROM STRANGERS")
            document.getElementById('neonTerminal').style.display = 'flex';
            document.getElementById('neonTerminalInput').focus();
            window.scrollTo(0, 0);
        }

        function HideTerminal() {
            document.getElementById('neonTerminal').style.display = 'none';
        }

        function toggleTerminalFullscreen() {
            const terminal = document.getElementById('neonTerminal');
            if (terminal.style.width === '100vw' && terminal.style.height === '100vh') {
                terminal.style.width = '400px';
                terminal.style.height = '300px';
                terminal.style.top = '50px';
                terminal.style.left = '50px';
            } else {
                terminal.style.width = '100vw';
                terminal.style.height = '100vh';
                terminal.style.top = '0';
                terminal.style.left = '0';
            }
        }

        function runNeonTerminalJS() {
            const code = document.getElementById('neonTerminalInput').value;
            try {
                eval(code);
            } catch (error) {
                alert(`ERROR: ${error.message}`);
            }
        }

        let isDraggingTerminal = false;
        let terminalOffsetX, terminalOffsetY;

        document.querySelector('.neon-terminal-header').addEventListener('mousedown', (e) => {
            isDraggingTerminal = true;
            terminalOffsetX = e.clientX - document.getElementById('neonTerminal').offsetLeft;
            terminalOffsetY = e.clientY - document.getElementById('neonTerminal').offsetTop;

            document.addEventListener('mousemove', handleTerminalMouseMove);
            document.addEventListener('mouseup', handleTerminalMouseUp);
        });

        function handleTerminalMouseMove(e) {
            if (isDraggingTerminal) {
                const newX = e.clientX - terminalOffsetX;
                const newY = e.clientY - terminalOffsetY;

                const maxX = window.innerWidth - document.getElementById('neonTerminal').offsetWidth;
                const maxY = window.innerHeight - document.getElementById('neonTerminal').offsetHeight;

                if (newX < 0) {
                    document.getElementById('neonTerminal').style.left = '0';
                } else if (newX > maxX) {
                    document.getElementById('neonTerminal').style.left = `${maxX}px`;
                } else {
                    document.getElementById('neonTerminal').style.left = `${newX}px`;
                }

                if (newY < 0) {
                    document.getElementById('neonTerminal').style.top = '0';
                } else if (newY > maxY) {
                    document.getElementById('neonTerminal').style.top = `${maxY}px`;
                } else {
                    document.getElementById('neonTerminal').style.top = `${newY}px`;
                }
            }
        }

        function handleTerminalMouseUp() {
            isDraggingTerminal = false;
            document.removeEventListener('mousemove', handleTerminalMouseMove);
            document.removeEventListener('mouseup', handleTerminalMouseUp);
        }
    // Public API
    return {
        handleTerminalMouseUp,
		handleTerminalMouseMove,
		runNeonTerminalJS,
		toggleTerminalFullscreen,
		Terminal,
		HideTerminal,
    };
})();