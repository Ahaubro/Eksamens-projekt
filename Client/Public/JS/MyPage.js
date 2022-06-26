

let usernameForfriends = "";

const image_input = document.querySelector("#image_input")
let uploaded_image = "";

image_input.addEventListener("change", function () {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
        uploaded_image = reader.result;
        pic = document.getElementById("display_image").style.backgroundImage = `url(${uploaded_image})`;
    });
    reader.readAsDataURL(this.files[0]);
})




// CRUD posts
const postsDiv = document.getElementById("posts");
let posts;

loadPosts();

async function loadPosts() {
    const response = await fetch("/api/posts/loggedInUser");
    const result = await response.json();
    posts = result;
    postsDiv.innerHTML = "";
    for (let i in posts) {
        let { id, text, userId, date, hours, minutes } = posts[i];
        let reverseDate = date.split("-").reverse().join("-")

        minutes = formatTime(minutes);
        hours = formatTime(hours);
        const resObj = await fetch(`/api/getUserById/${userId}`);
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

    }
}


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

function openEdit(id) {
    const element = document.getElementById("edit" + id);
    const text = document.getElementById("text" + id).innerText;
    element.innerHTML = `<div id="edit${id}">
                <input id="input${id}" value="${text}">
                <button onclick="editPost(${id})">Save</button>
            </div>`;
}

async function editPost(id) {
    let resMessage = "";

    const firstResponse = await fetch(`/api/getPostByID/${id}`);
    const firstResult = await firstResponse.json();
    const post = firstResult;
    const userId = post.userId

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



async function deletePost(id) {
    let resMessage = "";

    const firstResponse = await fetch(`/api/getPostByID/${id}`);
    const firstResult = await firstResponse.json();
    const post = firstResult;
    const userId = post.userId

    const response = await fetch(`/api/posts/${id}/${userId}`, {
        method: "DELETE",
    });

    resMessage = await response.text();
    document.getElementById("response").innerText = resMessage

    loadPosts();
}


// MODAL

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

responseMessage = "";
getProfileInformation()
async function getProfileInformation() {
    const res = await fetch(`/api/loggedInUser`)
    const user = await res.json()


    usernameForfriends = user.username
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
    profile_picture.src = `../Images/Uploads/${user.profilepicture}`

};

// HER
async function getFriends() {
    const friendsDiv = document.getElementById("friends");
    let friendList;
    let users = [];
    let arr = [];

    const res = await fetch(`/api/Myfriends`);
    const result = await res.json();

    friendList = result;

    for (let friends in friendList) {
        const { userOne, userTwo } = friendList[friends];

        arr.push(userOne);
        arr.push(userTwo);
    }

    for (let i in arr) {

        const userOneRes = await fetch(`/api/getUserById/${arr.at(i)}`)
        const userOneResult = await userOneRes.json();

        if (userOneResult.username != usernameForfriends) {
            friendsDiv.innerHTML += `<p> ${userOneResult.username} </p>`;
        }
    }
}

getFriends();

async function saveChanges() {
    let user = {}
    let input = document.querySelector('input[type="file"]')

    user.username = uname.value
    if (pass.value) {
        if (pass.value !== null)
            user.password = pass.value
    }
    user.firstname = fname.value
    user.middlename = mname.value
    user.lastname = lname.value
    if (bday.value)
        user.birthday = bday.value

    user.address = address.value
    user.country = countrySelect.value
    user.city = city.value
    user.zipcode = zip.value
    user.profilecolor = colorSelect.value
    
    if(input.files[0] !== undefined)
    user.profilePicture = input.files[0].name



    if (pass.value != cpass.value)
        return alert("the two passwords are not the same")
    const res = await fetch(`/api/editProfile`, {
        headers: {
            "content-type": "application/json"
        },
        method: "PATCH",
        body: JSON.stringify(user)
    });

}

