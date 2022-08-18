"use strict";

const FREEMIUM_PLAN = '62f4ec45de6d360004a97625';
const PREMIUM_PLAN = '62e286ce155f7600049ab645';

const productSlug = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
let userId;
let userPlan;

MemberStack.onReady.then(function(member) {   
	if (member.loggedIn) {
        console.log(member["id"]);
        userId = member["id"];
        userPlan = member.membership["id"];
	}
})

document.addEventListener("DOMContentLoaded", init);

function init() {
	getUserData();
}

function buyRetro() {
	const data = { "slug": productSlug };  
    const token = MemberStack.getToken();
  
    if (userId && token) {
        fetch(`https://hnva3v8a12.execute-api.eu-west-2.amazonaws.com/test/user/${userId}`, {
        method: 'PUT', 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
        }).then((response) => {
            if (response.ok) {
                return response.json()
            } 
            throw new Error(response.message);
        }).then((data) => {
            console.log('Success:', data);
            if (data) {
                // TODO: add spinner while buying process
                // TODO: resolve without reload
                window.location.reload();
            }
        }).catch((error) => {
            console.error(error.message);
        });
    }
}

function getUserData() {
	const token = MemberStack.getToken();
  
	if (userId && token) {
        fetch(`https://hnva3v8a12.execute-api.eu-west-2.amazonaws.com/test/retro/user/${userId}?slug=${productSlug}`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        },
        }).then((response) => {
            if (response.ok) {
                return response.json()
            }
            throw new Error(response.message);
        }).then((data) => {
            console.log('Success:', data);
            // user has already bought this retro
            if (data.url) {
                const downloadButton = document.getElementById('download-retro');
                downloadButton.classList.remove('hidden');
                downloadButton.href = data.url;      
            }
            else {
                const buyButton = document.getElementById('buy-retro');
                buyButton.classList.remove('hidden')
                buyButton.addEventListener('click', buyRetro);
            }
            setCounter(data.totalPurchases, data.purchasesThisMonth);
        }).catch((error) => {
        console.error(error.message);
    });
}
}

function setCounter(totalPurchases, purchasesThisMonth) {
    const purchasesCounter = document.getElementById('purchases_counter');

    if (userPlan === PREMIUM_PLAN) {
        const purchasesLeftThisMonth = 5 - purchasesThisMonth;
        purchasesCounter.innerHTML = `Du kannst diesen Monat noch ${purchasesLeftThisMonth} Retros herunterladen.`
    }
    else if (userPlan === FREEMIUM_PLAN) {
        const purchasesLeft = 3 - totalPurchases;
        purchasesCounter.innerHTML = `Du kannst mit deinem derzeitigen Abonnement noch ${purchasesLeft} Retros herunterladen.`
    }
}
