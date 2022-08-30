"use strict";

const PREMIUM_PLAN = '62e286ce155f7600049ab645';
let userId;

document.addEventListener("DOMContentLoaded", init);

function init() {
    MemberStack.onReady.then(async(member) => {   
        if (member.loggedIn) {
            if (userPlan === PREMIUM_PLAN) checkProfileData(member);
            const metadata = await member.getMetaData(); 
            const favorites = metadata.favorites || []; 
            if (!favorites.length) {
                document.getElementById('no-favorites').classList.remove('hidden');
            }
            removeNonFavoriteRetros(favorites);
        }
    })
}

function checkProfileData(member) {
    if (!member.address || !member.city || !member.company || !member.country || !member.name || !member.vat || !member.zipcode) document.getElementById('profile-warning').classList.remove('hidden');
}

function removeNonFavoriteRetros(favorites) {
    const allRetroElements = document.querySelectorAll('p[role="id_finder"]');
    const allRetroSlugs = [];

    allRetroElements.forEach(el => {
        allRetroSlugs.push(el.id);
    });

    allRetroSlugs.forEach(slug => {
        // if slug does not exist in favorites, remove the whole element
        if (favorites.indexOf(slug) === -1) {
            const tag = document.getElementById(slug);
            const divToDelete = tag.closest('div[role="listitem"]');

            if (divToDelete) {
                divToDelete.remove();
            }
        }        
    });
}