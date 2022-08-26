"use strict";

let userId;

document.addEventListener("DOMContentLoaded", init);

function init() {
    MemberStack.onReady.then(async(member) => {   
        if (member.loggedIn) {
            const metadata = await member.getMetaData(); 
            const favorites = metadata.favorites || []; 
            removeNonFavoriteRetros(favorites);
        }
    })
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