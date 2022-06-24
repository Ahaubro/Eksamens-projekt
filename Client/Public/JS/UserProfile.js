const userId = document.getElementById("userid").innerText;

const postsDiv = document.getElementById("posts");
let posts;

// Til friends
let loadedUsername;

async function loadPosts(){
    const response = await fetch("/api/posts/byUserId/"+userId);
    const result = await response.json();
    posts = result;
    postsDiv.innerHTML = ""; 
    for(let i in posts){
        const {id, text, userId, date, hours, minutes} = posts[i];

        const resObj = await fetch(`/api/getUserById/${userId}`);
        const foundUser = await resObj.json();
       
        postsDiv.innerHTML += ` <br> 
        <article class="postArticle">
            <b id="username">${foundUser.username}</b>
            <br>
            <div>
                <span id="text${id}">${text}</span>
            </div>
            <br>
            <br>
            <b id="date"> ${date} </b> <b id="time"> ${hours}:${minutes}</b>
            <br>
        </article> 
        <br>`;
    }
}

loadPosts();

// MODAL

function showInfoModal() {
    infoModal.className = 'shown-modal';
}

function hideInfoModal() {
    infoModal.className = 'hidden-modal';
}

document.addEventListener('mouseup', function(event) {
    if (!infoModal.contains(event.target))
        hideInfoModal();
});

responseMessage = "";
getProfileInformation()
async function getProfileInformation() {
    const res = await fetch("/api/getUserById/" + userId);
    const user = await res.json()

    loadedUsername = user.username

    uname.innerText = user.username
    fname.innerText = user.firstname
    mname.innerText = user.middlename
    lname.innerText = user.lastname
    bday.innerText = user.birthday
    address.innerText = user.address
    country.innerText = user.country
    city.innerText = user.city
    zip.innerText = user.zipcode
    pcolor.innerText = user.profilecolor

    document.getElementById("welcome").innerText = "Hello, welcome to " + user.username + "'s page";

    
    profile_picture_div.style.backgroundImage = `url('../Images/Uploads/${user.profilepicture}')`
    
    
};

async function addFriend() {
    const userTwoId = userId

    const res = await fetch(`/api/friends/`, {
        headers: {
            "content-type": "application/json",
        },
        method: "POST",
        body: `{"userTwoId": "${userTwoId}"}`
    })


    response = document.getElementById("responseMessage");
    response.innerText= await res.text();
}

async function getFriends() {
    const friendsDiv = document.getElementById("friends");
    let friendList;
    let users = [];
    let arr = [];
    let userNameList = [];

    const res = await fetch(`/api/profileFriends/${userId}`);
    const result = await res.json();

    friendList = result;


    for(let friends in friendList) {
        const { userOne, userTwo } = friendList[friends];

        arr.push(userOne);
        arr.push(userTwo); 
    }

    for(let i in arr) {
        const userOneRes = await fetch(`/api/getUserById/${arr.at(i)}`)
        const userOneResult = await userOneRes.json();

        if(userOneResult.username != loadedUsername) {
            userNameList.push(userOneResult.username)
        }
    }
    // Eventuelt udskift med filter funktion doh
    let uniqueList = [];
    userNameList.forEach((element) => {
        if (!uniqueList.includes(element)) {
            uniqueList.push(element);
        }
    });

    for(let i in uniqueList) {
        friendsDiv.innerHTML+=`<p> ${uniqueList[i]} </p>`;
    }
}

getFriends();
