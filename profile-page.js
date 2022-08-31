"use strict";

const PREMIUM_PLAN = '62e286ce155f7600049ab645';

document.addEventListener("DOMContentLoaded", init);

function init() {
    MemberStack.onReady.then(function(member) {   
        if (member.loggedIn) {
            const userPlan = member.membership["id"];
            
            if (userPlan === PREMIUM_PLAN) checkProfileData(member);
        }
    })    
}

function checkProfileData(member) {
    if (!member.address || !member.city || !member.company || !member.country || !member.name || !member.vat || !member.zipcode) document.getElementById('profile-warning-message').classList.remove('hidden');
}