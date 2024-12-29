  // Disable Right-Click (context menu)
  document.addEventListener("contextmenu", function(e) {
    e.preventDefault();
  });

  // Disable F12 and Ctrl+Shift+I (DevTools) keyboard shortcuts
  document.onkeydown = function(e) {
    // Block F12
    if (e.keyCode == 123) {
      return false;
    }
    // Block Ctrl + Shift + I (DevTools shortcut)
    else if (e.ctrlKey && e.shiftKey && e.keyCode == 73) {
      return false;
    }
    // Block Ctrl + Shift + J (DevTools shortcut)
    else if (e.ctrlKey && e.shiftKey && e.keyCode == 74) {
      return false;
    }
    // Block Ctrl + U (View Source)
    else if (e.ctrlKey && e.keyCode == 85) {
      return false;
    }
  };

 
