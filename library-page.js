"use strict";

const PREMIUM_PLAN = 'pln_premium-plan--s3z90fgo';
const FREEMIUM_PLAN= 'pln_freemium-plan-9nz80fpd';

let userId;
let isPremiumMember = false;
let memberstack;
let stage = 'prod';

function checkProfileData(member) {
  if (!member.address || !member.city || !member.company || !member.country || !member.name || !member.vat || !member.zipCode) document.getElementById('profile-warning').classList.remove('hidden');
}

document.addEventListener("DOMContentLoaded", init);

async function init() {
  if (window.location.href.includes('agilifyme.webflow.io')) stage = 'dev';

  memberstack = window.$memberstackDom;
  const { data: member } = await memberstack.getCurrentMember();
  userId = member.id;
  setUserPlan(member.planConnections);

  if (isPremiumMember) checkProfileData(member.customFields);
  getUserData();
}

function setUserPlan(planConnections) {
  planConnections.forEach(plan => {
      if (plan.active && plan.planId === PREMIUM_PLAN) isPremiumMember = true;
  })
}

function getUserData() {
	const token = memberstack.getMemberCookie();
  
	if (userId && token) {
    fetch(`https://57v71m7hlk.execute-api.eu-central-1.amazonaws.com/${stage}/user/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'X-API-KEY': 'X1TzzImCOV773jjVVxRla6bf3jY7huLI4R9vFiXc',
    },
  })
  .then((response) => response.json())
  .then((data) => {
    setCounter(data.totalPurchases, data.purchasesThisMonth);
    setPurchasedTags(data.purchases);
    markFavorites();
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}
}

function setCounter(totalPurchases, purchasesThisMonth) {
    const purchasesCounter = document.getElementById('purchases_counter');

    if (isPremiumMember) {
        const purchasesLeftThisMonth = Math.max(5 - purchasesThisMonth, 0);
        purchasesCounter.innerText = `${purchasesLeftThisMonth} Download(s) frei`;
    }
    else {
        const purchasesLeft = Math.max(3 - totalPurchases, 0);
        purchasesCounter.innerText = `${purchasesLeft} Download(s) frei`;
    }
    purchasesCounter.classList.remove('hidden');
}

function setPurchasedTags(purchases) {
    purchases.forEach(purchase => {
        const tag = document.getElementById(purchase);

        if (tag) {
            tag.innerText = 'Bereits gekauft';
        }
    });
}

async function markFavorites() {
  const { data: jsonData } = await memberstack.getMemberJSON();
  const favorites = jsonData?.favorites || []; 

  favorites.forEach(slug => {
    const img = document.getElementById(`favorite_${slug}`);
    const modalImg = document.getElementById(`modal_favorite_${slug}`);
    
    if (img) {
      img.src = "https://uploads-ssl.webflow.com/621ce6639b96713cece09d21/631059e0179147363045ceb7_ri_heart-fill.svg";
    }
    if (modalImg) {
      modalImg.src = "https://uploads-ssl.webflow.com/621ce6639b96713cece09d21/631059e0179147363045ceb7_ri_heart-fill.svg";
    }
  })
}

async function toggleFavorite(slug) {
  const { data: jsonData } = await memberstack.getMemberJSON();
  const favorites = jsonData?.favorites || [];
  const index = favorites.indexOf(slug);

  if (index > -1) {
    favorites.splice(index, 1);
    const img = document.getElementById(`favorite_${slug}`);
    const modalImg = document.getElementById(`modal_favorite_${slug}`);
    
    if (img) {
      img.src = "https://uploads-ssl.webflow.com/621ce6639b96713cece09d21/62fe4cf454fbe1866509a97e_ri_heart-line.svg";
    }
    if (modalImg) {
      modalImg.src = "https://uploads-ssl.webflow.com/621ce6639b96713cece09d21/62fe4cf454fbe1866509a97e_ri_heart-line.svg";
    }
  }
  else {
    favorites.push(slug);
    const img = document.getElementById(`favorite_${slug}`);
    const modalImg = document.getElementById(`modal_favorite_${slug}`);
    
    if (img) {
      img.src = "https://uploads-ssl.webflow.com/621ce6639b96713cece09d21/631059e0179147363045ceb7_ri_heart-fill.svg";
    }
    if (modalImg) {
      modalImg.src = "https://uploads-ssl.webflow.com/621ce6639b96713cece09d21/631059e0179147363045ceb7_ri_heart-fill.svg";
    }
  }
  memberstack.updateMemberJSON({ json: { favorites: favorites } }) ;
}