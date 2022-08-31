"use strict";

const FREEMIUM_PLAN = '62f4ec45de6d360004a97625';
const PREMIUM_PLAN = '62e286ce155f7600049ab645';

let userId;
let userPlan;

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
    }
  })
	getUserData();
  // TODO: add event listener to heart button/image
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

    if (userPlan === PREMIUM_PLAN) {
        const purchasesLeftThisMonth = Math.max(5 - purchasesThisMonth, 0);
        purchasesCounter.innerText = `${purchasesLeftThisMonth} Downloads frei`
    }
    else if (userPlan === FREEMIUM_PLAN) {
        const purchasesLeft = Math.max(3 - totalPurchases, 0);
        purchasesCounter.innerText = `${purchasesLeft} Downloads frei`
    }
}

function setPurchasedTags(purchases) {
    purchases.forEach(purchase => {
        const tag = document.getElementById(purchase);

        if (tag) {
            tag.innerText = 'Bereits gekauft';
        }
    });
}

function markFavorites() {
  MemberStack.onReady.then(async (member) => { 
      const metadata = await member.getMetaData(); 
      const favorites = metadata.favorites || []; 
      
      favorites.forEach(slug => {
        const img = document.getElementById(`favorite_${slug}`);
        
        if (img) {
          img.src = "https://uploads-ssl.webflow.com/621ce6639b96713cece09d21/62fe4cf457b9ed32e24caa34_ri_heart-fill.svg";
        }
      })
  });
}

function toggleFavorite(slug) {
  MemberStack.onReady.then(async (member) => { 
      const metadata = await member.getMetaData(); 
      const favorites = metadata.favorites || []; 
      const index = favorites.indexOf(slug);

      if (index > -1) {
        favorites.splice(index, 1);
        const img = document.getElementById(`favorite_${slug}`);
        
        if (img) {
          img.src = "https://uploads-ssl.webflow.com/621ce6639b96713cece09d21/62fe4cf454fbe1866509a97e_ri_heart-line.svg";
        }
      }
      else {
        favorites.push(slug);
        const img = document.getElementById(`favorite_${slug}`);
        
        if (img) {
          img.src = "https://uploads-ssl.webflow.com/621ce6639b96713cece09d21/62fe4cf457b9ed32e24caa34_ri_heart-fill.svg";
        }
      }
      member.updateMetaData({favorites: favorites}) 
  });
}