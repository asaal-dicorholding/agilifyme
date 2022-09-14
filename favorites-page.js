"use strict";

const PREMIUM_PLAN = 'pln_premium-plan-3a1gw084x';
let userId;
let memberstack;

document.addEventListener("DOMContentLoaded", init);

async function init() {
    memberstack = window.$memberstackDom;
    const { data: member } = await memberstack.getCurrentMember();

    userId = member.id;
  
    if (isPremiumMember(member.planConnections)) checkProfileData(member.customFields);

    const { data: jsonData } = await memberstack.getMemberJSON();
    const favorites = jsonData?.favorites || []; 

    if (!favorites.length) {
        document.getElementById('spinner').classList.remove('show');
        document.getElementById('no-favorites').classList.remove('hidden');
    }
    removeNonFavoriteRetros(favorites);
    getUserData();
}

function getUserData() {
	const token = memberstack.getMemberCookie();
  
	if (userId && token) {
        fetch(`https://57v71m7hlk.execute-api.eu-central-1.amazonaws.com/v1/user/${userId}`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'X-API-KEY': 'X1TzzImCOV773jjVVxRla6bf3jY7huLI4R9vFiXc',
            },
        })
        .then((response) => response.json())
        .then((data) => {
            setPurchasedTags(data.purchases);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
}

function isPremiumMember(planConnections) {
    let result = false;

    planConnections.forEach(plan => {
        if (plan.active && plan.planId === PREMIUM_PLAN) result = true;
    });

    return result;
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
    document.getElementById('spinner').classList.remove('show');
    document.getElementById('retro-wrapper').classList.remove('hidden');

    if (favorites.length === 0) document.getElementById('no-favorites').classList.remove('hidden');
}

async function removeFavorite(slug) {
    const { data: jsonData } = await memberstack.getMemberJSON();
    const favorites = jsonData?.favorites || [];
    const index = favorites.indexOf(slug);

    if (index > -1) {
        favorites.splice(index, 1);
        memberstack.updateMemberJSON({ json: { favorites: favorites } }) ;
        removeNonFavoriteRetros(favorites);
    }    
}

function setPurchasedTags(purchases) {
    purchases.forEach(purchase => {
        const tag = document.getElementById(`bought_${purchase}`);

        if (tag) {
            tag.innerText = 'Bereits gekauft';
        }
    });
}