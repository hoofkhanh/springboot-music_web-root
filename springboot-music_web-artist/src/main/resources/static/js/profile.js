document.addEventListener('DOMContentLoaded', function(){
	let followerList = document.getElementById('followerList');
	if(followerList.value != null){
		followerList.value =followerList.value.substring(1, followerList.value.length -1);
	}
	
	let followingList = document.getElementById('followingList');
	if(followingList.value != null){
		followingList.value =followingList.value.substring(1, followingList.value.length -1);
	}
});