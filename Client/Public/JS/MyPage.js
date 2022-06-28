//For image upload and refresh
const image_input = document.querySelector("#image_input")
let uploaded_image = "";

image_input.addEventListener("change", function () {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
        uploaded_image = reader.result;
        pic = document.getElementById("display_image").style.backgroundImage = `url(${uploaded_image})`;
        pic2 = document.getElementById("profile_picture").style.backgroundImage = `url(${uploaded_image})`;
    });
    reader.readAsDataURL(this.files[0]);
})



const postsDiv = document.getElementById("posts");
let posts;

//Function that loads posts beloning to the logged in user
async function loadPosts() {
    const response = await fetch("/api/posts/loggedInUser");
    const result = await response.json();
    posts = result;
    postsDiv.innerHTML = "";

    posts.forEach( async (post) => {
        let {id, text, userId, date, hours, minutes } = post

        let reverseDate = date.split("-").reverse().join("-")

        minutes = formatTime(minutes);
        hours = formatTime(hours);
        const resObj = await fetch(`/api/users/${userId}`);
        const foundUser = await resObj.json();

        postsDiv.innerHTML += ` <br> 
            <article class="postArticle">
                <b id="username">${foundUser.username}</b>
                <br>
                <div id="edit${id}">
                    <span id="text${id}">${text}</span>
                    <br>
                    <button id="editPostBtn" onclick="openEdit(${id})"> Edit </button>
                    <button id="deletePostBtn" onclick="deletePost(${id})"> Delete </button>
                </div>
                <br>
                <br>
                <b id="date"> ${reverseDate} </b> <b id="time"> ${hours}:${minutes}</b>
                <br>
            </article> 
            <br>`;
    });
}

loadPosts();


//Function that creates new posts in the db
async function createPost() {
    const text = document.getElementById("createText").value;
    const categori = document.getElementById("categoriSelect").value;
    const response = await fetch("/api/posts", {
        headers: {
            "content-type": "application/json",
        },
        method: "POST",
        body: `{"text": "${text}", "categori": "${categori}"}`
    });
    const result = await response.json();
    loadPosts();
}


//Function that enables edit on posts
function openEdit(id) {
    const element = document.getElementById("edit" + id);
    const text = document.getElementById("text" + id).innerText;
    element.innerHTML = `<div id="edit${id}">
                <input id="input${id}" value="${text}">
                <button onclick="editPost(${id})">Save</button>
            </div>`;
}


//Function that edits post in the database
async function editPost(id) {
    let resMessage = "";

    const firstResponse = await fetch(`/api/posts/${id}`);
    const firstResult = await firstResponse.json();
    const userId = firstResult.userId

    const text = document.getElementById("input" + id).value;
    const response = await fetch(`/api/posts/` + id, {
        headers: {
            "content-type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify({ text, userId })
    });

    resMessage = await response.text();
    document.getElementById("response").innerText = resMessage

    loadPosts();
}


//Funtions that deletes a post in the db
async function deletePost(id) {
    let resMessage = "";

    const response = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
    });

    resMessage = await response.text();


    let snackbar = document.getElementById("snackbar");
    snackbar.className = "show";
    snackbar.innerText = resMessage
    snackbar.style.backgroundColor = "red"
    setTimeout(function () { snackbar.className = snackbar.className.replace("show", ""); }, 3000);

    loadPosts();
}


// Edit myPage modal

function showEditModal() {
    editModal.className = 'shown-modal';
}

function hideEditModal() {
    editModal.className = 'hidden-modal';
}

document.addEventListener('mouseup', function (event) {
    if (!editModal.contains(event.target))
        hideEditModal();
});


let thisProfilesUsername = "";
responseMessage = "";

//Function that reads profile information on the logged in user
async function getProfileInformation() {
    const res = await fetch(`/api/user/loggedin`)
    const user = await res.json()

    thisProfilesUsername = user.username
    uname.value = user.username
    fname.value = user.firstname
    mname.value = user.middlename
    lname.value = user.lastname
    bday.value = user.birthday
    address.value = user.address
    countrySelect.value = user.country
    city.value = user.city
    zip.value = user.zipcode
    colorSelect.value = user.profilecolor
    display_image.value = user.profilePicture

    document.getElementById("welcome").innerText = "Hello " + user.username + ", welcome to your page"

    display_image.style.backgroundImage = `url('../Images/Uploads/${user.profilepicture}')`
    profile_picture.style.backgroundImage = `url('../Images/Uploads/${user.profilepicture}')`
};

getProfileInformation()


// Get friends from db using session ID, and display friends on myPage
async function getFriends() {
    const friendsDiv = document.getElementById("friends");
    let friendList;
    let friendArr = [];

    const res = await fetch(`/api/friends/myfriends`);
    const result = await res.json();

    friendList = result;

    for (let friends in friendList) {
        const { userOne, userTwo } = friendList[friends];
        friendArr.push(userOne);
        friendArr.push(userTwo);
    }

    for (let i in friendArr) {
        const userOneRes = await fetch(`/api/users/${friendArr.at(i)}`)
        const userOneResult = await userOneRes.json();
        console.log()

        if (userOneResult.username != thisProfilesUsername) {
            friendsDiv.innerHTML += `<p> ${userOneResult.username} </p>`;
        }
    }
}

getFriends();


//Saves inputs from modal to the correct user in the database
async function saveChanges() {
    let user = {}
    let input = document.querySelector('input[type="file"]')

    user.username = uname.value;
    if (pass.value) {
        if (pass.value !== null)
            user.password = pass.value;
    };

    user.firstname = fname.value;
    user.middlename = mname.value;
    user.lastname = lname.value;
    if (bday.value) user.birthday = bday.value;

    user.address = address.value;
    user.country = countrySelect.value;
    user.city = city.value;
    user.zipcode = zip.value;
    user.profilecolor = colorSelect.value;

    if (input.files[0] !== undefined) user.profilePicture = input.files[0].name;

    if (pass.value != cpass.value) return alert("the two passwords are not the same");

    await fetch(`/api/users`, {
        headers: {
            "content-type": "application/json"
        },
        method: "PATCH",
        body: JSON.stringify(user)
    });

}

