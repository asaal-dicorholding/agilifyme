"use strict";

const FREEMIUM_PLAN = '62f4ec45de6d360004a97625';
const PREMIUM_PLAN = '62e286ce155f7600049ab645';

const productSlug = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);

let userId;
let userPlan;
let alreadyBought = false;
let spinner;

function checkProfileData(member) {
    if (!member.address || !member.city || !member.company || !member.country || !member.name || !member.vat || !member.zipcode) document.getElementById('profile-warning').classList.remove('hidden');
}

document.addEventListener("DOMContentLoaded", init);

function init() {
    MemberStack.onReady.then(function(member) {   
        if (member.loggedIn) {
            userId = member["id"];
            userPlan = member.membership["id"];
            if (userPlan === PREMIUM_PLAN) checkProfileData(member);
            spinner = document.getElementById('spinner');
	        getUserData();
            markAsFavorite();
        }
    })
}

function buyRetro() {
    document.getElementById('purchases_counter').classList.add('hidden');
    document.getElementById('buy-retro').classList.add('hidden');
    spinner.classList.add('show');

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
                document.getElementById('purchases_counter').classList.add('hidden');
                document.getElementById('buy-retro').classList.add('hidden');
                getUserData();
            }
        }).catch((error) => {
            console.error(error.message);
            getUserData();
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

                // user has already bought this retro
                if (data.url) {
                    alreadyBought = true;
                    document.getElementById('download-section').classList.remove('hidden');
                    const downloadButton = document.getElementById('download-retro');
                    spinner.classList.remove('show');
                    downloadButton.href = data.url;
                }
                else {
                    setCounter(data.totalPurchases, data.purchasesThisMonth);
                    spinner.classList.remove('show');
                }
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
        const purchasesLeftThisMonth = Math.max(5 - purchasesThisMonth, 0);
        purchasesCounter.innerHTML = `Du kannst diesen Monat noch ${purchasesLeftThisMonth} Retros herunterladen.`
        
        // show buy button if credits left
        if (purchasesLeftThisMonth > 0) {
            const buyButton = document.getElementById('buy-retro');
            spinner.classList.remove('show');
            buyButton.classList.remove('hidden');
            buyButton.addEventListener('click', buyRetro);
        } 
        else {
            // show single buy button only when no credits left AND when user has not yet bought retro
            if (!alreadyBought) {
                const createPaymentLinkElement = document.getElementById('create-payment-link');
                createPaymentLinkElement.classList.remove('hidden');
                createPaymentLinkElement.addEventListener('click', createPaymentLink);
            }
        }
    }
    else if (userPlan === FREEMIUM_PLAN) {
        const purchasesLeft = Math.max(3 - totalPurchases, 0);
        purchasesCounter.innerHTML = `Du kannst mit deinem derzeitigen Abonnement noch ${purchasesLeft} Retros herunterladen.`
        
        // show buy button if credits left
        if (purchasesLeft > 0) {
            const buyButton = document.getElementById('buy-retro');
            spinner.classList.remove('show');
            buyButton.classList.remove('hidden');
            buyButton.addEventListener('click', buyRetro);
        } 
        else {
            // show single buy button only when no credits left AND when user has not yet bought retro
            if (!alreadyBought) {
                const createPaymentLinkElement = document.getElementById('create-payment-link');
                createPaymentLinkElement.classList.remove('hidden');
                createPaymentLinkElement.addEventListener('click', createPaymentLink);
            }
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
                img.src = "https://uploads-ssl.webflow.com/621ce6639b96713cece09d21/631059e0179147363045ceb7_ri_heart-fill.svg";
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
                img.src = "https://uploads-ssl.webflow.com/621ce6639b96713cece09d21/631059e0179147363045ceb7_ri_heart-fill.svg";
            }
        }
        member.updateMetaData({favorites: favorites}) 
    });
}

/**
 * calls the backend in order to retrieve a stripe payment link which is then used as link for the single buy button
 */
function createPaymentLink() {
    const token = MemberStack.getToken();

    if (userId && token) {
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
                        document.getElementById('create-payment-link').classList.add('hidden');
                        const singleBuyButton = document.getElementById('single-buy-retro');
                        spinner.classList.remove('show');
                        singleBuyButton.href = data.url;
                        singleBuyButton.classList.remove('hidden');
                        singleBuyButton.style.display = 'block';
                    }
                }).catch((error) => {
                console.error(error.message);
            });
        }
}
