"use strict";

let userId;

MemberStack.onReady.then(function(member) {   
	if (member.loggedIn) {
        userId = member["id"];
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
        .then((response) => {
            if (response.ok) {
                return response.json()
            }
            throw new Error(response.message);
            })
        .then((data) => {
            removeNonPurchasedRetros(data.purchases);
        })
        .catch((error) => {
            console.error(error.message);
        });
        }
}

function removeNonPurchasedRetros(purchases) {
    purchases.forEach(purchase => {
        const tag = document.getElementById(purchase);
        const divToDelete = tag.closest('div[role="listitem"]');

        if (divToDelete) {
            divToDelete.classList.remove('hidden');
        }
    });
}