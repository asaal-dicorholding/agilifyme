"use strict";

const PREMIUM_PLAN = 'pln_premium-plan-3a1gw084x';
let userId;
let memberstack;

function checkProfileData(member) {
    if (!member.address || !member.city || !member.company || !member.country || !member.name || !member.vat || !member.zipcode) document.getElementById('profile-warning').classList.remove('hidden');
}

document.addEventListener("DOMContentLoaded", init);

async function init() {
    memberstack = window.$memberstackDom;
    const { data: member } = await memberstack.getCurrentMember();
    userId = member.id;
  
    if (isPremiumMember(member.planConnections)) checkProfileData(member.customFields);
    getUserData();
}

function isPremiumMember(planConnections) {
    let result = false;

    planConnections.forEach(plan => {
        if (plan.active && plan.planId === PREMIUM_PLAN) result = true;
    });

    return result;
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
        .then((response) => {
            if (response.ok) {
                return response.json()
            }
            throw new Error(response.message);
            })
        .then((data) => {
            if (!data.purchases.length) {
                document.getElementById('no-purchases').classList.remove('hidden');
            }
            removeNonPurchasedRetros(data.purchases);
            const purchasedRetros = document.getElementById('my-retros');
            const spinner = document.getElementById('spinner');
            // show spinner while loading
            spinner.classList.remove('show');
            // show retros when loaded
            purchasedRetros.classList.remove('hidden');
            
        })
        .catch((error) => {
            console.error(error.message);
        });
        }
}

function removeNonPurchasedRetros(purchases) {
    const allRetroElements = document.querySelectorAll('p[role="id_finder"]');


    const allRetroSlugs = [];

    allRetroElements.forEach(el => {
        allRetroSlugs.push(el.id);
    });

    allRetroSlugs.forEach(slug => {
        // if slug does not exist in purchases, remove the whole element
        if (purchases.indexOf(slug) === -1) {
            const tag = document.getElementById(slug);
            const divToDelete = tag.closest('div[role="listitem"]');

            if (divToDelete) {
                divToDelete.remove();
            }
        }        
    });
}