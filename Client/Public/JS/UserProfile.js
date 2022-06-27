const userId = document.getElementById("userid").innerText;

//Show if a user is online or offline 
async function checkUserOnline(userId) {
    const response = await fetch("/api/getUserById/" + userId);
    const foundUser = await response.json()

    const active = document.getElementById("status-emoji")
    let bol = "0"
    if (foundUser.loggedin === 1) {
        console.log("kommer den ind her?")
        active.innerText = "🟢"
        bol = 1
    }
    
    
}

checkUserOnline(userId)

const postsDiv = document.getElementById("posts");
let posts;

//Loads post written by the user being visited
async function loadPosts() {
    const response = await fetch("/api/posts/byUserId/" + userId);
    const result = await response.json();
    posts = result;
    postsDiv.innerHTML = "";
    for (let i in posts) {
        const { id, text, userId, date, hours, minutes } = posts[i];

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


// User profile information modal
function showInfoModal() {
    infoModal.className = 'shown-modal';
}

function hideInfoModal() {
    infoModal.className = 'hidden-modal';
}

document.addEventListener('mouseup', function (event) {
    if (!infoModal.contains(event.target))
        hideInfoModal();
});


responseMessage = "";
let loadedUsername;

// Loads user profile information for display
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


    profile_picture.src = `../Images/Uploads/${user.profilepicture}`


};

getProfileInformation()


// Adds the visited user profile as a friend
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
    response.innerText = await res.text();
}


// Displays the users friends
async function getFriends() {
    const friendsDiv = document.getElementById("friends");
    let friendList;
    let friendArr = [];

    const res = await fetch(`/api/profileFriends/${userId}`);
    const result = await res.json();

    friendList = result;

    for (let friends in friendList) {
        const { userOne, userTwo } = friendList[friends];
        friendArr.push(userOne);
        friendArr.push(userTwo);
    }

    for (let i in friendArr) {
        const userOneRes = await fetch(`/api/getUserById/${friendArr.at(i)}`)
        const userOneResult = await userOneRes.json();

        if (userOneResult.username != loadedUsername) {
            friendsDiv.innerHTML += `<p> ${userOneResult.username} </p>`;
        }
    }
}

getFriends();
