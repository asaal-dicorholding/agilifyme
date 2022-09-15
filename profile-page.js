"use strict";

const PREMIUM_PLAN = 'pln_premium-plan-3a1gw084x';

document.addEventListener("DOMContentLoaded", init);

async function init() {
    const memberstack = window.$memberstackDom;
    const { data: member } = await memberstack.getCurrentMember();
  
    isPremiumMember(member.planConnections) ? checkProfileData(member.customFields) : removeRequiredAttributes();
}

function isPremiumMember(planConnections) {
    let result = false;

    planConnections.forEach(plan => {
        if (plan.active && plan.planId === PREMIUM_PLAN) result = true;
    });

    return result;
}
  

function checkProfileData(member) {
    if (!member.address || !member.city || !member.company || !member.country || !member.name || !member.vat || !member.zipCode) document.getElementById('profile-warning-message').classList.remove('hidden');
}

function removeRequiredAttributes() {
    document.getElementById('company-name-input').required = false;
    document.getElementById('vat-input').required = false;
    document.getElementById('address-input').required = false;
    document.getElementById('zip-code-input').required = false;
    document.getElementById('city-input').required = false;
    document.getElementById('country-input').required = false;
}

var Webflow = Webflow || [];
Webflow.push(function() {

  // === Custom Form Handling ===
  
  // unbind webflow form handling
  $(document).off('submit');

  // new form handling
  $('#wf-form-Delete-Account').submit(e => {
    e.preventDefault();
    if (window.confirm('Bist Du Dir sicher, dass Du die Löschung deines Accounts beantragen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.')) {
        return true;
    }
    return false;
  });
});