// FMOSreset.js

const FMOSreset = (function () {
function resetos() {
	alert("WARNING")
	alert("THIS WILL DELETE ALL PERMANENTLY SAVED FILES")
	alert("WARNING")
	alert("THIS WILL DELETE THE PASSWORD")
	const userConfirmed = confirm("Do You Realy Want To Delete The Password And Files From FMOS?");
    
    // Überprüfen, welche Taste der Benutzer gedrückt hat
    if (userConfirmed) {
        localStorage.removeItem('password');
		localStorage.removeItem('files');
		deleteAllFMOSdesktopItems()
    } else {
        // Aktion ausführen, wenn der Benutzer auf "Abbrechen" klickt (optional)
        console.log("Aktion abgebrochen.");
		showError('Action Canceled.');
    }
}
    // Public API
    return {
        resetos,
    };
})();