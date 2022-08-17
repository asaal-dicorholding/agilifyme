"use strict";

const productSlug = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
let userId;

MemberStack.onReady.then(function(member) {   
	if (member.loggedIn) {
  console.log(member["id"]);
		userId = member["id"]
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
})
.then((response) => response.json())
.then((data) => {
  console.log('Success:', data);
  if (data) {
  // TODO: add spinner while buying process
  // TODO: resolve without reload
  	window.location.reload();
  }
})
.catch((error) => {
  console.error('Error:', error);
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
  })
  .then((response) => response.json())
  .then((data) => {
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
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}
}
