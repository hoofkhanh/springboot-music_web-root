document.addEventListener('DOMContentLoaded', function(){
	document.getElementById('a-send-otp').addEventListener('click', function(){
		let email = document.getElementById('email').value;
		if(email != '' && ( email.includes('@gmail.com') || email.includes('sv.hcmunre.edu.vn'))){
			let url = '/artist/register/sendOtpToEmail?email='+email;
			
			fetch(url)

		}
	});
});