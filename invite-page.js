"use strict";

const PREMIUM_PLAN = 'pln_premium-plan--s3z90fgo';

document.addEventListener("DOMContentLoaded", init);

async function init() {
  const memberstack = window.$memberstackDom;
  const { data: member } = await memberstack.getCurrentMember();
  
  if (isPremiumMember(member.planConnections)) checkProfileData(member.customFields);
}

function isPremiumMember(planConnections) {
  let result = false;

  planConnections.forEach(plan => {
      if (plan.active && plan.planId === PREMIUM_PLAN) result = true;
  });

  return result;
}

function checkProfileData(member) {
    if (!member.address || !member.city || !member.company || !member.country || !member.name || !member.vat || !member.zipCode) document.getElementById('profile-warning').classList.remove('hidden');
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
    const sender = evt.target['userEmail']?.value; 
    
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