"use strict";

const PREMIUM_PLAN = 'pln_premium-plan-3a1gw084x';
const FREEMIUM_PLAN= 'pln_freemium-plan-y91h108t5';

const productSlug = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);

let userId;
let isPremiumMember = false;
let alreadyBought = false;
let spinner;
let memberstack;

document.addEventListener("DOMContentLoaded", init);

async function init() {
    memberstack = window.$memberstackDom;
    const { data: member } = await memberstack.getCurrentMember();

    userId = member.id;
    setUserPlan(member.planConnections);
    spinner = document.getElementById('spinner');
    getUserData();
    markAsFavorite();
}

function setUserPlan(planConnections) {
    planConnections.forEach(plan => {
        if (plan.active && plan.planId === PREMIUM_PLAN) isPremiumMember = true;
    })
}

function buyRetro() {
    document.getElementById('purchases_counter').classList.add('hidden');
    document.getElementById('buy-retro').classList.add('hidden');
    spinner.classList.add('show');

	const data = { "slug": productSlug };  
    const token = memberstack.getMemberCookie();
  
    if (userId && token) {
        fetch(`https://57v71m7hlk.execute-api.eu-central-1.amazonaws.com/v1/user/${userId}`, {
        method: 'PUT', 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'X-API-KEY': 'X1TzzImCOV773jjVVxRla6bf3jY7huLI4R9vFiXc',
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
	const token = memberstack.getMemberCookie();
  
	if (userId && token) {
        fetch(`https://57v71m7hlk.execute-api.eu-central-1.amazonaws.com/v1/retro-url/user/${userId}?slug=${productSlug}`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'X-API-KEY': 'X1TzzImCOV773jjVVxRla6bf3jY7huLI4R9vFiXc',
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

    if (isPremiumMember) {
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
    else {
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
async function markAsFavorite() {
    const { data: jsonData } = await memberstack.getMemberJSON();
    const favorites = jsonData?.favorites || []; 
  
    if (favorites.indexOf(productSlug) > -1) {
        const img = document.getElementById(`favorite_${productSlug}`);
    
        if (img) {
            img.src = "https://uploads-ssl.webflow.com/621ce6639b96713cece09d21/631059e0179147363045ceb7_ri_heart-fill.svg";
        }
    }
}

/**
 * adds or removes slugId from memberstack metadata and fills or empties heart icon to visualize the current status 
 */
async function toggleFavorite() {
    const { data: jsonData } = await memberstack.getMemberJSON();
    const favorites = jsonData?.favorites || [];
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
    memberstack.updateMemberJSON({ json: { favorites: favorites } }) ;
}

/**
 * calls the backend in order to retrieve a stripe payment link which is then used as link for the single buy button
 */
function createPaymentLink() {
    const token = memberstack.getMemberCookie();

    if (userId && token) {
        fetch(`https://57v71m7hlk.execute-api.eu-central-1.amazonaws.com/v1/payment-link/user/${userId}?slug=${productSlug}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'X-API-KEY': 'X1TzzImCOV773jjVVxRla6bf3jY7huLI4R9vFiXc',
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
