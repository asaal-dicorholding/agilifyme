"use strict";

const FREEMIUM_PLAN = '62f4ec45de6d360004a97625';
const PREMIUM_PLAN = '62e286ce155f7600049ab645';

let userId;
let userPlan;

MemberStack.onReady.then(function(member) {   
	if (member.loggedIn) {
        userId = member["id"];
        userPlan = member.membership["id"];
	}
})

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
  .then((response) => response.json())
  .then((data) => {
    setCounter(data.totalPurchases, data.purchasesThisMonth);
    setPurchasedTags(data.purchases);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}
}

function setCounter(totalPurchases, purchasesThisMonth) {
    const purchasesCounter = document.getElementById('purchases_counter');

    if (userPlan === PREMIUM_PLAN) {
        const purchasesLeftThisMonth = 5 - purchasesThisMonth;
        purchasesCounter.innerText = `${purchasesLeftThisMonth} Downloads frei`
    }
    else if (userPlan === FREEMIUM_PLAN) {
        const purchasesLeft = 3 - totalPurchases;
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