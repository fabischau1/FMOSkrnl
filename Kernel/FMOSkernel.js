// FMOSkernel.js

const FMOSkernel = (function () {
        let files = {};

        let folders = {};

        let selectedFile = null;
        let currentDraggedFile = null;

        function createFile() {
            const fileName = prompt("Filename:");
            if (fileName) {
                if (!files[fileName]) {
                    files[fileName] = "";
                    renderFiles();
                } else {
                    alert("File alredy exsists.");
                }
            }
        }

        function createFolder() {
          const folderName = prompt("Foldername:");
          if (folderName) {
            if (!folders[folderName]) {
              folders[folderName] = {};
              renderFiles();
            } else {
              alert("Ordner alredy exsists.");
            }
          }
        }

//render and create files and file management and file settings

function renderFiles() {
  const desktop = document.getElementById('desktop');
  desktop.innerHTML = '';
  for (const folderName in folders) {
    const folderIcon = document.createElement('div');
    folderIcon.className = 'icon';
	folderIcon.dataset.folder = folderName;
    folderIcon.innerHTML = folderName;
    folderIcon.onclick = () => openFolder(folderName);
    folderIcon.oncontextmenu = (e) => {
      selectedFile = folderName;
      showContextMenu(e);
      return false;
    };
    folderIcon.dataset.folder = folderName;
    desktop.appendChild(folderIcon);
  }
	const showFileNames = localStorage.getItem('fmosfilenamessetting') === 'true';

	for (const fileName in files) {
		const fileIcon = document.createElement('div');
		fileIcon.className = 'icon';

		// Only create and append the file label if showFileNames is true
		if (showFileNames) {
			const fileLabel = document.createElement('div');
			fileLabel.className = 'file-label';
			fileLabel.innerText = fileName;
			fileIcon.appendChild(fileLabel);
		}

		fileIcon.dataset.file = fileName;
		fileIcon.onclick = () => openFile(fileName);
		fileIcon.oncontextmenu = (e) => {
			selectedFile = fileName;
			showContextMenu(e);
			return false;
		};

		desktop.appendChild(fileIcon);
	}
	positionIcons();
}

function enableFileNames() {
    localStorage.setItem('fmosfilenamessetting', 'true');
    renderFiles();
}
function disableFileNames() {
    localStorage.setItem('fmosfilenamessetting', 'false');
    renderFiles();
}

        function openFile(fileName) {
		  new Audio('click.mp3').play();
          selectedFile = fileName;
          document.getElementById('editorTitle').innerText = `Editor - ${fileName}`;
          document.getElementById('fileContent').value = files[fileName];
          openWindow();
		  if (selectedFile && selectedFile.endsWith('.folder')) {
		    openfmosfolder()
		  }
        }

        function saveFile() {
			new Audio('click.mp3').play();
            if (selectedFile) {
                files[selectedFile] = document.getElementById('fileContent').value;
                alert('File saved.');
            }
        }

function deleteFile() {
  new Audio('click.mp3').play();
  if (selectedFile) {
    if (selectedFile.endsWith('.fsys')) {
      if (confirm('Are you sure you want to delete this system file?')) {
        if (confirm('This will delete the entire file: ' + selectedFile)) {
          delete files[selectedFile];
          closeWindow();
          renderFiles();
          selectedFile = null;
        }
      }
    } else {
      if (confirm('Are you sure you want to delete this file?')) {
        if (confirm('This will delete the entire file: ' + selectedFile)) {
          delete files[selectedFile];
          closeWindow();
          renderFiles();
          selectedFile = null;
        }
      }
    }
  }
}
    
		// Drag functionality for the window
        let isDragging = false;
        let offsetX, offsetY;

        document.querySelector('.window-header').addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - document.getElementById('editorWindow').offsetLeft;
            offsetY = e.clientY - document.getElementById('editorWindow').offsetTop;

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        });

        function handleMouseMove(e) {
            if (isDragging) {
                const newX = e.clientX - offsetX;
                const newY = e.clientY - offsetY;

                const maxX = window.innerWidth - document.getElementById('editorWindow').offsetWidth;
                const maxY = window.innerHeight - document.getElementById('editorWindow').offsetHeight;

                if (newX < 0) {
                    document.getElementById('editorWindow').style.left = '0';
                } else if (newX > maxX) {
                    document.getElementById('editorWindow').style.left = `${maxX}px`;
                } else {
                    document.getElementById('editorWindow').style.left = `${newX}px`;
                }

                if (newY < 0) {
                    document.getElementById('editorWindow').style.top = '0';
                } else if (newY > maxY) {
                    document.getElementById('editorWindow').style.top = `${maxY}px`;
                } else {
                    document.getElementById('editorWindow').style.top = `${newY}px`;
                }
            }
        }

        function handleMouseUp() {
            isDragging = false;
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }

        // Drag functionality for the icons
        let currentDraggedElement = null;

        document.querySelector('.desktop').addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('icon')) {
                currentDraggedElement = e.target;
                currentDraggedFile = e.target.dataset.file;
                e.target.classList.add('dragging');
            }
        });

        document.querySelector('.desktop').addEventListener('mousemove', (e) => {
            if (currentDraggedElement) {
                const newX = e.clientX - currentDraggedElement.offsetWidth / 2;
                const newY = e.clientY - currentDraggedElement.offsetHeight / 2;

                const maxX = window.innerWidth - currentDraggedElement.offsetWidth;
                const maxY = window.innerHeight - currentDraggedElement.offsetHeight;

                if (newX < 0) {
                    currentDraggedElement.style.left = '0';
                } else if (newX > maxX) {
                    currentDraggedElement.style.left = `${maxX}px`;
                } else {
                    currentDraggedElement.style.left = `${newX}px`;
                }

                if (newY < 0) {
                    currentDraggedElement.style.top = '0';
                } else if (newY > maxY) {
                    currentDraggedElement.style.top = `${maxY}px`;
                } else {
                    currentDraggedElement.style.top = `${newY}px`;
                }
            }
        });

        document.querySelector('.desktop').addEventListener('mouseup', () => {
            if (currentDraggedElement) {
                currentDraggedElement.classList.remove('dragging');
                currentDraggedElement = null;
                currentDraggedFile = null;
            }
        });
        function positionIcons() {
            const icons = document.querySelectorAll('.icon');
            const desktopWidth = document.getElementById('desktop').offsetWidth;
            const iconWidth = icons[0].offsetWidth;
            const iconHeight = icons[0].offsetHeight;
            let x = 10;
            let y = 10;

            icons.forEach((icon) => {
                icon.style.left = `${x}px`;
                icon.style.top = `${y}px`;
                x += iconWidth + 10;
                if (x > desktopWidth - iconWidth - 10) {
                    x = 10;
                    y += iconHeight + 10;
                }
            });
        }
		


const ROOT_PATH = '/';
//____________________________________________________________________________________
        function renameFile() {
            if (selectedFile) {
                const newFileName = prompt("New Filename:", selectedFile);
                if (newFileName &&!files[newFileName]) {
                    files[newFileName] = files[selectedFile];
                    delete files[selectedFile];
                    selectedFile = newFileName;
                    renderFiles();
                } else {
                    alert('An error has occurred.');
                }
            }
        }

        function openWindow() {
            document.getElementById('editorWindow').style.display = 'flex';
            document.getElementById('fileContent').focus();
            window.scrollTo(0, 0);
        }

        function closeWindow() {
            document.getElementById('editorWindow').style.display = 'none';
            document.getElementById('fileContent').blur();
        }

        function showContextMenu(event) {
            const contextMenu = document.getElementById('contextMenu');
            contextMenu.style.top = `${event.clientY}px`;
            contextMenu.style.left = `${event.clientX}px`;
            contextMenu.style.display = 'block';
            document.addEventListener('click', hideContextMenu);
        }

        function hideContextMenu() {
            document.getElementById('contextMenu').style.display = 'none';
            document.removeEventListener('click', hideContextMenu);
        }

        // Add a function to close the HTML preview window
        function closeHTMLPreviewWindow() {
            document.getElementById('htmlPreviewWindow').style.display = 'none';
        }

		function executeHTML() {
			alert("be Carefull while running html")
			if (selectedFile && selectedFile.endsWith('.html') || selectedFile.endsWith('.png') || selectedFile.endsWith('.fak') || selectedFile.endsWith('.url')) {
				const htmlContent = files[selectedFile];
				const iframe = document.getElementById('htmlPreview');
				iframe.srcdoc = htmlContent;
				iframe.width = '100%';
				iframe.height = '550px'; // set height to 600px
				document.getElementById('htmlPreviewWindow').style.display = 'block';
			} else {
				alert('ERROR This Filetype can not run HTML.');
			}
		}

		// Update the executeJS function to call executeHTML for HTML files
		function executeJS() {
			alert("Be Carefull with running commands or code")
		    if (selectedFile && (selectedFile.endsWith('.fexe') || selectedFile.endsWith('.js') || selectedFile.endsWith('.py') || selectedFile.endsWith('.zfp') || selectedFile.endsWith('.fsys'))) {
		        try {
		            eval(files[selectedFile]);
		        } catch (error) {
		            alert(`ERROR: ${error.message}`);
		        }
		    } else if (selectedFile && selectedFile.endsWith('.html') || selectedFile.endsWith('.png') || selectedFile.endsWith('.fak') || selectedFile.endsWith('.url')) {
		        executeHTML();
		    } else {
		        alert("ERROR This Filetype can not run Javaskript.");
		    }
		}
        function saveFiles() {
            localStorage.setItem('files', JSON.stringify(files));
        }

        function loadFiles() {
            if (localStorage.getItem('files')) {
                files = JSON.parse(localStorage.getItem('files'));
            }
            renderFiles();
        }
		
function openDiscordLink(url) {
    window.open(url, '_blank');
}

function restartOS(url) {
    window.location.href = url;
}
function apps() {
  const selectionWindow = document.getElementById('apps-window');
  selectionWindow.classList.toggle('active');
}

function settings3() {
  const selectionWindow = document.getElementById('settings3-window');
  selectionWindow.classList.toggle('active');
}

function settings1() {
  const selectionWindow = document.getElementById('settings1-window');
  selectionWindow.classList.toggle('active');
}
function settings2() {
  const selectionWindow = document.getElementById('settings2-window');
  selectionWindow.classList.toggle('active');
}
//stlye settings
function uploadFile() {
  const input = document.createElement('input');
  input.type = 'file';
  input.onchange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const fileContent = e.target.result;
      const fileName = file.name;
      files[fileName] = fileContent;
      renderFiles();
    };
    reader.readAsText(file);
  };
  input.click();
}
//____________________________________________________________________________________

function getFullPath(folderPath, folderName) {
    return `${folderPath}/${folderName}`.replace('//', '/');
}

let currentPath = ROOT_PATH;

function showCurrentFolder() {
    const folderName = currentPath.split('/').pop() || '/';
    alert(`Current folder: ${folderName}\nPath: ${currentPath}`);
}

function checkIfPathExists(path) {
    const allKeys = Object.keys(localStorage);
    return allKeys.includes(`FMOSfolder${path}`);
}

function saveFolderWithPath() {
    const folderPath = prompt("Enter folder path (e.g., /path/to/folder):", ROOT_PATH);
    const folderName = prompt("Enter folder name:");

    if (folderPath && folderName) {
        const pathSegments = folderPath.split('/').filter(Boolean);
        let currentFullPath = ROOT_PATH;

        for (const segment of pathSegments) {
            currentFullPath = getFullPath(currentFullPath, segment);
            if (!checkIfPathExists(currentFullPath)) {
                alert(`The path "${currentFullPath}" does not exist.`);
                return;
            }
        }

        // Save the folder if all paths exist
        const fullPath = getFullPath(folderPath, folderName);
        const storageKey = `FMOSfolder${fullPath}`;
        localStorage.setItem(storageKey, JSON.stringify(files));
        alert(`Folder saved at ${fullPath}`);
    } else {
        alert("Folder path or name is invalid.");
    }
}


function saveFolderWithNameOnly() {
    const folderName = prompt("Enter folder name:");
    if (folderName) {
        const fullPath = getFullPath(ROOT_PATH, folderName);
        const storageKey = `FMOSfolder${fullPath}`;
        localStorage.setItem(storageKey, JSON.stringify(files));
        alert(`Folder saved at ${fullPath}`);
    } else {
        alert("Folder name is invalid.");
    }
}

function loadFolderWithPath() {
    const folderPath = prompt("Enter folder path (e.g., /path/to/folder):", ROOT_PATH);
    if (folderPath) {
        const storageKey = `FMOSfolder${folderPath}`;
        const folderContent = localStorage.getItem(storageKey);
        if (folderContent) {
            files = JSON.parse(folderContent);
			currentPath = folderPath;
            folders = {};
            renderFiles();
        } else {
            alert('Folder not found at the specified path.');
        }
    } else {
        alert('Folder path is invalid.');
    }
}

function loadFolderWithNameOnly() {
    const folderName = prompt("Enter folder name:");

    if (folderName) {
        const fullPath = getFullPath(currentPath, folderName);
        const storageKey = `FMOSfolder${fullPath}`;
        const folderContent = localStorage.getItem(storageKey);

        if (folderContent) {
            files = JSON.parse(folderContent);
            folders = {};
            
            currentPath = fullPath;

            renderFiles();
            alert(`Connected to folder at: ${currentPath}`);
        } else {
            alert('Folder not found.');
        }
    } else {
        alert('Folder name is invalid.');
    }
}

function deleteFolderWithPath() {
    const folderPath = prompt("Enter folder path to delete (e.g., /path/to/folder):", ROOT_PATH);
    if (folderPath) {
        const storageKey = `FMOSfolder${folderPath}`;
        if (localStorage.getItem(storageKey)) {
            localStorage.removeItem(storageKey);
            alert(`Folder at ${folderPath} has been deleted.`);
        } else {
            alert('Folder not found at the specified path.');
        }
    } else {
        alert('Folder path is invalid.');
    }
}

function deleteFolderWithNameOnly() {
    const folderName = prompt("Enter folder name to delete:");
    if (folderName) {
        const fullPath = getFullPath(ROOT_PATH, folderName);
        const storageKey = `FMOSfolder${fullPath}`;
        if (localStorage.getItem(storageKey)) {
            localStorage.removeItem(storageKey);
            alert(`Folder '${folderName}' has been deleted.`);
        } else {
            alert('Folder not found.');
        }
    } else {
        alert('Folder name is invalid.');
    }
}

function deleteAllFolders() {
    const allKeys = Object.keys(localStorage);
    const fmosFolderKeys = allKeys.filter(key => key.startsWith('FMOSfolder'));
    if (fmosFolderKeys.length === 0) {
        alert('No folders to delete.');
        return;
    }
    if (confirm('Are you sure you want to delete all folders?')) {
        fmosFolderKeys.forEach(key => localStorage.removeItem(key));
        alert('All folders have been deleted, and the root path "/" has been reset.');
    }
}

function showAllFolders() {
    const allKeys = Object.keys(localStorage);
    const fmosFolderKeys = allKeys.filter(key => key.startsWith('FMOSfolder'));
    if (fmosFolderKeys.length === 0) {
        alert('No folders found.');
        return;
    }
    const folderNames = fmosFolderKeys.map(key => key.replace('FMOSfolder', ''));
    alert(`Folders:\n${folderNames.join('\n')}`);
}

function savedesktopWithCustomName() {
    const customName = prompt("Desktop Name:");
    if (customName) {
        const storageKey = `FMOSdesktop${customName}`;
        localStorage.setItem(storageKey, JSON.stringify(files));
        alert(`Files Saved In ${storageKey}`);
    }
}

function loaddesktopContent() {
    const desktopname = prompt("Desktop Name:");
    if (desktopname) {
        const storageKey = `FMOSdesktop${desktopname}`;
        const folderContent = localStorage.getItem(storageKey);

        if (folderContent) {
            files = JSON.parse(folderContent);
            // Reset the existing folders
            folders = {};

            // Render files and folders
            renderFiles();
        } else {
            alert('No Folder Found With That Name.');
        }
    }
}

function showAllFMOSdesktopNames() {
    const allKeys = Object.keys(localStorage);
    const fmosFolderKeys = allKeys.filter(key => key.startsWith('FMOSdesktop'));

    if (fmosFolderKeys.length === 0) {
        alert('Nothing Found.');
        console.log('No FMOSdesktop entries found.');
        return;
    }

    const folderNames = fmosFolderKeys.map(key => key.replace('FMOSdesktop', ''));
    const message = folderNames.join('\n');

    alert(`FMOSdesktop entries:\n${message}`);
    console.log('FMOSdesktop entries:');
    console.log(message);
}
function deleteAllFMOSdesktopItems() {
    const allKeys = Object.keys(localStorage);
    const fmosFolderKeys = allKeys.filter(key => key.startsWith('FMOSdesktop'));

    if (fmosFolderKeys.length === 0) {
        alert('No Folders To Delete.');
        console.log('No FMOSdesktop entries found to delete.');
        return;
    }

    const confirmation = confirm('Are you sure you want to delete all FMOSdesktop entries? This action cannot be undone.');

    if (!confirmation) {
        alert('Operation cancelled.');
        console.log('Operation cancelled.');
        return;
    }

    fmosFolderKeys.forEach(key => localStorage.removeItem(key));

    alert('All FMOSdesktop entries have been deleted.');
    console.log('The following FMOSdesktop entries have been deleted:');
    console.log(fmosFolderKeys.join('\n'));
}

function deleteSpecificdesktop() {
    const desktopname = prompt('Enter the name of the folder to delete:');

    if (!desktopname) {
        alert('An error has occurred.');
        return;
    }

    const folderKey = `FMOSdesktop${desktopname}`;

    if (!localStorage.getItem(folderKey)) {
        alert('Folder Does Not Ecsist');
        return;
    }

    deletedesktopContents(folderKey);
    localStorage.removeItem(folderKey);

    alert(`Folder '${desktopname}' has been deleted.`);
    console.log(`Folder '${desktopname}' and its contents have been deleted.`);
}

function deletedesktopContents(folderKey) {
    const allKeys = Object.keys(localStorage);
    const folderKeys = allKeys.filter(key => key.startsWith(folderKey));

    folderKeys.forEach(key => localStorage.removeItem(key));
}
//____________________________________________________________________________________
function openfmosfolder() {
    if (selectedFile && selectedFile.endsWith('.folder')) {
        const folderName = selectedFile.slice(0, -'.folder'.length);

        const fullPath = getFullPath(currentPath, folderName);
        const storageKey = `FMOSfolder${fullPath}`;
        const folderContent = localStorage.getItem(storageKey);

        if (folderContent) {
            files = JSON.parse(folderContent);
            folders = {};

            currentPath = fullPath;

            renderFiles();
            alert(`Connected to folder at: ${currentPath}`);
        } else {
            alert('Folder not found.');
        }
    } else {
        alert('Selected file is not a valid folder.');
    }
}
//____________________________________________________________________________________

  const desktop = document.getElementById('desktop');
  let selection = null;
  let startX = 0;
  let startY = 0;

  // Define color and border properties
  const borderWidth = '2px'; // Border width

  desktop.addEventListener('mousedown', (event) => {
    if (event.button !== 0) return; // only handle left mouse button
    startX = event.clientX;
    startY = event.clientY;
    selection = document.createElement('div');
    selection.className = 'selected';
    selection.style.position = 'absolute'; // Ensure positioning is absolute
    selection.style.left = `${startX}px`;
    selection.style.top = `${startY}px`;
    selection.style.width = '0px';
    selection.style.height = '0px';
    selection.style.borderWidth = borderWidth;
    desktop.appendChild(selection);
  });

  document.addEventListener('mousemove', (event) => {
    if (event.buttons !== 1) return; // only handle mouse move while left mouse button is pressed
    if (!selection) return; // nothing to select
    const x = event.clientX;
    const y = event.clientY;
    const width = Math.abs(x - startX);
    const height = Math.abs(y - startY);
    const left = Math.min(x, startX);
    const top = Math.min(y, startY);
    selection.style.left = `${left}px`;
    selection.style.top = `${top}px`;
    selection.style.width = `${width}px`;
    selection.style.height = `${height}px`;

    // Check if the selection intersects with any file
    const files = document.querySelectorAll('.file');
    files.forEach((file) => {
      const fileLeft = file.offsetLeft;
      const fileTop = file.offsetTop;
      const fileWidth = file.offsetWidth;
      const fileHeight = file.offsetHeight;

      if (
        left < fileLeft + fileWidth &&
        top < fileTop + fileHeight &&
        left + width > fileLeft &&
        top + height > fileTop
      ) {
        // If the selection intersects with the file, add the 'selected' class to it
        file.classList.add('selected');
      } else {
        // Otherwise, remove the 'selected' class from the file
        file.classList.remove('selected');
      }
    });
  });

  document.addEventListener('mouseup', (event) => {
    if (event.button !== 0) return; // only handle left mouse button
    if (!selection) return; // nothing to select

    // Remove the selection element from the DOM
    selection.remove();
    selection = null; // Clear the selection reference
  });
    // Public API
    return {
		checkIfPathExists,
		showCurrentFolder,
		getFullPath,
		openfmosfolder,
		loadFolderWithNameOnly,
		loadFolderWithPath,
		saveFolderWithNameOnly,
		saveFolderWithPath,
		showAllFolders,
		deleteAllFolders,
		deleteFolderWithNameOnly,
		deleteFolderWithPath,
		deleteAllFMOSdesktopItems,
		showAllFMOSdesktopNames,
		loaddesktopContent,
		savedesktopWithCustomName,
		deletedesktopContents,
		deleteSpecificdesktop,
		settings3,
		settings1,
		settings2,
		uploadFile,
		apps,
		openDiscordLink,
		restartOS,
		loadFiles,
		saveFiles,
		executeJS,
		executeHTML,
		closeWindow,
		showContextMenu,
		hideContextMenu,
		closeHTMLPreviewWindow,
		renameFile,
		openWindow,
		handleMouseMove,
		handleMouseUp,
		positionIcons,
		createFile,
		renderFiles,
		enableFileNames,
		disableFileNames,
		openFile,
		saveFile,
		deleteFile,
    };
})();