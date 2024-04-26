document.addEventListener('DOMContentLoaded', function(){
	let currentURL = window.location.href;
	if(currentURL.includes('thanks') && currentURL.includes('message=Successful')){
		fetch('/artist/artists/buyPackgeOfTurnOffAd');
		
		setTimeout(function() {
			window.location.href = 'http://localhost:8081/artist/index';
		}, 5500);
	}else{
		window.location.href = 'http://localhost:8081/artist/index';
	}
	
});