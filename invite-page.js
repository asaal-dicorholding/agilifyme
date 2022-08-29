"use strict";

var Webflow = Webflow || [];
Webflow.push(function() {

  // === Custom Form Handling ===
  
  // unbind webflow form handling
  $(document).off('submit');

  // new form handling
  $('form').submit(function(evt) {

    evt.preventDefault();
    const recipient = evt.target['Eingeladener-Nutzer']?.value;
    const sender = evt.target['Nutzer']?.value;
    
    if (recipient && sender) {
      if (recipient.split('@')[1] === sender.split('@')[1]) {
        return true;
      }
      else {
        alert('Die Domain der eingegebenen E-Mail stimmt nicht mit der eigenen überein.');
        return false;
      }
    }
    return false;
  });
});