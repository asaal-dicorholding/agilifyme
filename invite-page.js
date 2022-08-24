"use strict";

MemberStack.onReady.then(function(member) {   
	if (member.loggedIn) {
        console.log(member["id"]);
        userId = member["id"];
        userPlan = member.membership["id"];
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
    alert("Your custom action here");
    sumbmitInvite();
  });
});



function sumbmitInvite() {
    const token = MemberStack.getToken();

    if (userId && token) {
        alert("Invite");
        // fetch(`https://hnva3v8a12.execute-api.eu-west-2.amazonaws.com/test/voucher-request`, {
        // method: 'POST', 
        // headers: {
        //     'Content-Type': 'application/json',
        //     'Authorization': `Bearer ${token}`,
        // },
        // body: { sender: string, recipient: string},
        // }).then((response) => {
        //     if (response.ok) {
                
        //     } 
        //     throw new Error(response.message);
        // }).then((data) => {

        //     if (data) {

        //     }
        // }).catch((error) => {
        //     console.error(error.message);
        // });
    }
}