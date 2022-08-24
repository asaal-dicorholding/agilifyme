"use strict";

let userId;
let sender;

MemberStack.onReady.then(function(member) {   
	if (member.loggedIn) {
        userId = member["id"];
        sender = member["email"]
	}
})

var Webflow = Webflow || [];
Webflow.push(function() {

  // === Custom Form Handling ===
  
  // unbind webflow form handling
  $(document).off('submit');

  // new form handling
  $('form').submit(function(evt) {
    evt.preventDefault();
    const recipient = evt.target.email.value;
    
    if (recipient.split('@')[1] === sender.split('@')[1]) {
      sumbmitInvite(recipient);
    }
    else {
      alert('Die Domain der eingegebenen E-Mail stimmt nicht mit der eigenen überein.');
    }
  });
});



function sumbmitInvite(recipient) {
    const token = MemberStack.getToken();
    const requestData = { sender: sender, recipient: recipient }
    const button = document.getElementById('send_invite_button');

    if (userId && token) {
      button.disabled = true;

      fetch(`https://hnva3v8a12.execute-api.eu-west-2.amazonaws.com/test/voucher-request`, {
      method: 'POST', 
      headers: {
          'Content-Type': 'application/json',
          //'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(requestData),
      }).then((response) => {
          if (response.ok) {
              document.getElementById('success_message').classList.remove('hidden');
              button.classList.add('hidden');
          } 
          else {
            throw new Error(response.message);
          }
      }).catch((error) => {
        document.getElementById('error_message').classList.remove('hidden');
        console.error(error.message);
      });
    }
}