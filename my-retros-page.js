"use strict";

const PREMIUM_PLAN = '62e286ce155f7600049ab645';
let userId;

MemberStack.onReady.then(function(member) {   
	if (member.loggedIn) {
        userId = member["id"];

        if (userPlan === PREMIUM_PLAN) checkProfileData(member);
	}
})

function checkProfileData(member) {
    if (!member.address || !member.city || !member.company || !member.country || !member.name || !member.vat || !member.zipcode) document.getElementById('profile-warning').classList.remove('hidden');
}

document.addEventListener("DOMContentLoaded", init);

function init() {
	getUserData();
}

function getUserData() {
	const token = MemberStack.getToken();
    
	if (userId && token) {
        fetch(`https://hnva3v8a12.execute-api.eu-west-2.amazonaws.com/test/user/${userId}`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
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