const socket = io();

//socket that changes the reaction count when changed in db
socket.on("reaction-change", ({ id, likeCount, heartCount, careCount }) => {
    let likeCountElement = document.getElementById("likes-count" + id)
    let heartCountElement = document.getElementById("hearts-count" + id)
    let careCountElement = document.getElementById("cares-count" + id)

    likeCountElement.innerText = likeCount || "0"
    heartCountElement.innerText = heartCount || "0"
    careCountElement.innerText = careCount || "0"
})


const postsDiv = document.getElementById("posts");
let posts;
let id, numberArray = ""


//Function that loads posts and likes from db along with some html representatio
async function loadPosts() {
    const response = await fetch("/api/posts");
    const result = await response.json();
    posts = result;
    postsDiv.innerHTML = "";

    const likedResponse = await fetch(`/api/likedposts/`);
    const likedResult = await likedResponse.json();
    likedPosts = likedResult

    let categorySelection = document.getElementById("category-selection").value;
    for (let i in posts) {
        const { id, text, userId, date, categori } = posts[i];
        let { minutes, hours } = posts[i];
        let reverseDate = date.split("-").reverse().join("-")

        minutes = formatTime(minutes);
        hours = formatTime(hours);

        if (categori === categorySelection || categorySelection === "all" && categori !== "home") {
            const likes = posts[i].likes || 0;
            const hearts = posts[i].hearts || 0;
            const cares = posts[i].cares || 0;

            const resObj = await fetch(`/api/users/${userId}`);
            const foundUser = await resObj.json();

            let SecondPostPart = ""
            const firstPostPart = `
                    <br> 
                        <div class="post-div">
                        <b id="username"><a href="./profile/${userId}">${foundUser.username}</a>&nbsp;- ${categori} post</b>
                        <br>
                        <span id="text${id}">${text}</span>
                        <br>
                        <br>
                        <div id="info-and-reaction">
                        <b id="date"> ${reverseDate} </b> `
            const numberArray = [likes, hearts, cares]

            if (likedPosts.find((likedPost) => likedPost.postId === id && likedPost.reaction === 0)) {
                SecondPostPart += ` 
                        <div id="reaction_count${id}">
                            ${reactionArrayForPosts(id, numberArray, "activeReaction", 0)}
                            ${reactionArrayForPosts(id, numberArray, "disabledButton", 1)}
                            ${reactionArrayForPosts(id, numberArray, "disabledButton", 2)}
                        </div>`
            } else if (likedPosts.find((likedPost) => likedPost.postId == id && likedPost.reaction === 1)) {
                SecondPostPart += `
                        <div id="reaction_count${id}">
                            ${reactionArrayForPosts(id, numberArray, "disabledButton", 0)}
                            ${reactionArrayForPosts(id, numberArray, "activeReaction", 1)}
                            ${reactionArrayForPosts(id, numberArray, "disabledButton", 2)}
                        </div>`
            } else if (likedPosts.find((likedPost) => likedPost.postId == id && likedPost.reaction === 2)) {
                SecondPostPart += `
                        <div id="reaction_count${id}">
                            ${reactionArrayForPosts(id, numberArray, "disabledButton", 0)}
                            ${reactionArrayForPosts(id, numberArray, "disabledButton", 1)}
                            ${reactionArrayForPosts(id, numberArray, "activeReaction", 2)}
                        </div>`
            } else {
                SecondPostPart += `
                        <div id="reaction_count${id}">
                            ${reactionArrayForPosts(id, numberArray, "enabledButton", 0)}
                            ${reactionArrayForPosts(id, numberArray, "enabledButton", 1)}
                            ${reactionArrayForPosts(id, numberArray, "enabledButton", 2)}
                        </div> `;
            }
            const thirdPostPart = `<b id="time"> ${hours}:${minutes}</b>
                                        </div>
                                        <br>   
                                        </div>`

            postsDiv.innerHTML += firstPostPart + SecondPostPart + thirdPostPart;
        }
    }
}

loadPosts();


//Function containing array of reaction button html representation 
function reactionArrayForPosts(id, numberArray, condition, index) {

    if (condition === "activeReaction") {
        const activeReactionArray = [
            `<div id="like-count"> 
                    <div id="like-div">
                        <button id="like-button" onclick="removeReaction(${id}, 'likes', [${numberArray}])">😍</button> <div id="remove-like" onclick="removeReaction(${id}, 'likes', [${numberArray}])" >X</div>
                    </div>  
                        <b id="likes-count${id}">${numberArray[0]}</b> 
                </div>`,

            `<div id="heart-count"> 
                    <div id="heart-div">
                        <button id="heart-button" onclick="removeReaction(${id}, 'hearts', [${numberArray}])">❤️</button> <div id="remove-heart" onclick="removeReaction(${id}, 'hearts', [${numberArray}])" >X</div>
                    </div>  
                        <b id="hearts-count${id}">${numberArray[1]}</b>  
                </div>`,

            `<div id="care-count"> 
                    <div id="care-div">
                        <button id="care-button" onclick="removeReaction(${id}, 'cares', [${numberArray}])">🥰</button> <div id="remove-care" onclick="removeReaction(${id}, 'cares', [${numberArray}])" >X</div>
                    </div> 
                        <b id="cares-count${id}">${numberArray[2]}</b> 
                </div>`
        ]

        return activeReactionArray[index]

    } if (condition === "disabledButton") {
        const disabledButtonsArray = [
            `<div id="like-count"> 
                    <div id="like-div">
                        <button id="like-button" disabled>😍</button>
                    </div>
                         <b id="likes-count${id}">${numberArray[0]}</b> 
                </div>`,

            `<div id="heart-count"> 
                    <div id="heart-div">
                        <button id="heart-button" disabled>❤️</button>
                    </div> 
                        <b id="hearts-count${id}">${numberArray[1]}</b>  
                </div> `,

            `<div id="care-count"> 
                    <div id="care-div">
                        <button id="care-button" disabled>🥰</button>
                    </div> 
                        <b id="cares-count${id}">${numberArray[2]}</b> 
                </div>`]
        return disabledButtonsArray[index]

    } if (condition === "enabledButton") {
        const enableButtonsArray = [
            `<div id="like-count"> 
                    <div id="like-div">
                        <button id="like-button" onclick="addReaction(${id}, 'likes', [${numberArray}])">😍</button>
                    </div>  
                    <b id="likes-count${id}">${numberArray[0]}</b>  
                </div>`,

            `<div id="heart-count"> 
                    <div id="heart-div">
                        <button id="heart-button" onclick="addReaction(${id}, 'hearts', [${numberArray}])">❤️</button>
                    </div> 
                    <b id="hearts-count${id}">${numberArray[1]}</b>  
                </div> `,

            `<div id="care-count"> 
                    <div id="care-div">
                        <button id="care-button" onclick="addReaction(${id}, 'cares', [${numberArray}])">🥰</button>
                    </div> 
                    <b id="cares-count${id}">${numberArray[2]}</b> 
                </div>`]

        return enableButtonsArray[index]
    }
}


//add a reaction to a post, and then disables the rest of the buttons so you cant react put another reaction on the post
async function addReaction(id, reaction, numberArray) {

    if (reaction === "likes") {
        const html = `
                    ${reactionArrayForPosts(id, numberArray, "activeReaction", 0)}
                    ${reactionArrayForPosts(id, numberArray, "disabledButton", 1)}
                    ${reactionArrayForPosts(id, numberArray, "disabledButton", 2)}
                `;
        document.getElementById(`reaction_count${id}`).innerHTML = html;
    }
    if (reaction === "hearts") {

        const html = `
                    ${reactionArrayForPosts(id, numberArray, "disabledButton", 0)}
                    ${reactionArrayForPosts(id, numberArray, "activeReaction", 1)}
                    ${reactionArrayForPosts(id, numberArray, "disabledButton", 2)}
                `
        document.getElementById(`reaction_count${id}`).innerHTML = html;
    }
    if (reaction === "cares") {

        const html = `
                    ${reactionArrayForPosts(id, numberArray, "disabledButton", 0)}
                    ${reactionArrayForPosts(id, numberArray, "disabledButton", 1)}
                    ${reactionArrayForPosts(id, numberArray, "activeReaction", 2)}
                `
        document.getElementById(`reaction_count${id}`).innerHTML = html;
    }

    await fetch(`/api/likedposts/addReaction/${id}`, {
        headers: {
            "content-type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify({ reaction })
    });

    socket.emit("reactions", { id, likeCount: numberArray[0], heartCount: numberArray[1], careCount: numberArray[2] })

}

//removes a reaction from a post, and enables all buttons to be pressed again
async function removeReaction(id, reaction, numberArray) {

    document.getElementById(`reaction_count${id}`).innerHTML = `
        ${reactionArrayForPosts(id, numberArray, "enabledButton", 0)}
        ${reactionArrayForPosts(id, numberArray, "enabledButton", 1)}
        ${reactionArrayForPosts(id, numberArray, "enabledButton", 2)}
        `

    await fetch(`/api/likedposts/removeReaction/${id}`, {
        headers: {
            "content-type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify({ reaction })
    });

    await fetch(`/api/likedposts/` + id, {
        method: "DELETE",
    });

    socket.emit("reactions", { id, likeCount: numberArray[0], heartCount: numberArray[1], careCount: numberArray[2] })

}

