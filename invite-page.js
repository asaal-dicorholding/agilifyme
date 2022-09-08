"use strict";

const PREMIUM_PLAN = 'pln_premium-plan-3a1gw084x';

document.addEventListener("DOMContentLoaded", init);

function init() {
  const memberstack = window.$memberstackDom;
  const { data: member } = await memberstack.getCurrentMember();
  const userPlan = member.planConnections[0].planId;
  
  if (userPlan === PREMIUM_PLAN) checkProfileData(member.customFields);
}

function checkProfileData(member) {
    if (!member.address || !member.city || !member.company || !member.country || !member.name || !member.vat || !member.zipcode) document.getElementById('profile-warning').classList.remove('hidden');
}

var Webflow = Webflow || [];
Webflow.push(function() {

  // === Custom Form Handling ===
  
  // unbind webflow form handling
  $(document).off('submit');

  // new form handling
  $('form').submit(function(evt) {

    evt.preventDefault();
    const recipient = evt.target['invitedEmail']?.value;
    const sender = evt.target['userEmail']?.value; console.log(sender);
    
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