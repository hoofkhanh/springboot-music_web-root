document.addEventListener('DOMContentLoaded', function(){
	document.getElementById('a-send-otp').addEventListener('click', function(){
		let email = document.getElementById('email').value;
		if(email != '' && email.includes('@gmail.com')){
			let url = '/artist/forgetPassword/sendOtpToEmail?email='+email;
			fetch(url);
		}
	});
});