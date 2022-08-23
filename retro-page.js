"use strict";

const FREEMIUM_PLAN = '62f4ec45de6d360004a97625';
const PREMIUM_PLAN = '62e286ce155f7600049ab645';

const productSlug = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
let userId;
let userPlan;
let alreadyBought = false;

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
    markAsFavorite();
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

/**
 * fetches user data including made purchases from the backend
 */
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
                const spinner = document.getElementById('spinner');
                // user has already bought this retro
                if (data.url) {
                    alreadyBought = true;
                    const downloadButton = document.getElementById('download-retro');
                    spinner.classList.remove('show');
                    downloadButton.classList.remove('hidden');
                    downloadButton.style.display = 'block';
                    downloadButton.href = data.url;      
                }
                // user has not yet bought this retro
                else {
                    const buyButton = document.getElementById('buy-retro');
                    spinner.classList.remove('show');
                    buyButton.classList.remove('hidden')
                    buyButton.style.display = 'block';
                    buyButton.addEventListener('click', buyRetro);
                }
                setCounter(data.totalPurchases, data.purchasesThisMonth);
            }).catch((error) => {
            console.error(error.message);
        });
    }
}

/**
 * sets a text saying users how many purchases they have left within their subscription plan 
 * @param {number of total purchases for freemium users} totalPurchases 
 * @param {number of purchases this month for premium users} purchasesThisMonth 
 */
function setCounter(totalPurchases, purchasesThisMonth) {
    const purchasesCounter = document.getElementById('purchases_counter');

    if (userPlan === PREMIUM_PLAN) {
        const purchasesLeftThisMonth = 5 - purchasesThisMonth;
        purchasesCounter.innerHTML = `Du kannst diesen Monat noch ${Math.max(purchasesLeftThisMonth,0)} Retros herunterladen.`
        
        // show single buy button only when no credits left AND when user has not yet bought retro
        if (purchasesLeftThisMonth === 0 && !alreadyBought) {
            createPaymentLink();
        }
    }
    else if (userPlan === FREEMIUM_PLAN) {
        const purchasesLeft = 3 - totalPurchases;
        purchasesCounter.innerHTML = `Du kannst mit deinem derzeitigen Abonnement noch ${Math.max(purchasesLeft,0)} Retros herunterladen.`
        
        // show single buy button only when no credits left AND when user has not yet bought retro
        if (totalPurchases === 0 && !alreadyBought) {
            createPaymentLink();
        }
    }
}

/**
 * fills the heart icon when the slugId of the current retro is found in the user's favorites
 */
function markAsFavorite() {
    MemberStack.onReady.then(async (member) => { 
        const metadata = await member.getMetaData(); 
        const favorites = metadata.favorites || []; 
  
        if (favorites.indexOf(productSlug) > -1) {
            const img = document.getElementById(`favorite_${productSlug}`);
        
            if (img) {
                img.src = "https://uploads-ssl.webflow.com/621ce6639b96713cece09d21/62fe4cf457b9ed32e24caa34_ri_heart-fill.svg";
            }
        }
    });
}

/**
 * adds or removes slugId from memberstack metadata and fills or empties heart icon to visualize the current status 
 */
function toggleFavorite() {
    MemberStack.onReady.then(async (member) => { 
        const metadata = await member.getMetaData(); 
        const favorites = metadata.favorites || []; 
        const index = favorites.indexOf(productSlug);
  
        if (index > -1) {
            favorites.splice(index, 1);
            const img = document.getElementById(`favorite_${productSlug}`);
        
            if (img) {
                img.src = "https://uploads-ssl.webflow.com/621ce6639b96713cece09d21/62fe4cf454fbe1866509a97e_ri_heart-line.svg";
            }
        }
        else {
            favorites.push(productSlug);
            const img = document.getElementById(`favorite_${productSlug}`);
        
            if (img) {
                img.src = "https://uploads-ssl.webflow.com/621ce6639b96713cece09d21/62fe4cf457b9ed32e24caa34_ri_heart-fill.svg";
            }
        }
        member.updateMetaData({favorites: favorites}) 
    });
}

function createPaymentLink() {
    fetch(`https://hnva3v8a12.execute-api.eu-west-2.amazonaws.com/test/payment-link/user/${userId}?slug=${productSlug}`, {
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
                if (data.url) {
                    const singleBuyButton = document.getElementById('single-buy-retro');
                    singleBuyButton.href = data.url;
                    singleBuyButton.classList.remove('hidden');
                    singleBuyButton.style.display = 'block';
                }
            }).catch((error) => {
            console.error(error.message);
        });
}
