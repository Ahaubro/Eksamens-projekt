loadPosts();

const postsDiv = document.getElementById("posts");
let posts;
let id, numberArray = ""

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

    } if (condition === "removeReaction") {
        const removeReactionArray = [
            `<div id="like-count"> 
                    <div id="like-div">
                        <button id="like-button" onclick="addReaction(${id}, 'likes', [${numberArray}])">😍</button> 
                    </div>  
                    <b id="likes-count">${numberArray[0]}</b> 
                </div>`,

            `<div id="heart-count"> 
                    <div id="heart-div">
                        <button id="heart-button" onclick="addReaction(${id}, 'hearts', [${numberArray}])">❤️</button>
                    </div>  
                    <b id="hearts-count">${numberArray[1]}</b>  
                </div>`,

            `<div id="care-count"> 
                    <div id="care-div">
                        <button id="care-button" onclick="addReaction(${id}, 'cares', [${numberArray}])">🥰</button>
                    </div> 
                    <b id="cares-count">${numberArray[2]}</b> 
                </div>`
        ]
        return removeReactionArray[index]

    } if (condition === "disabledButton") {
        const disabledButtonsArray = [
            `<div id="like-count"> 
                    <div id="like-div">
                        <button id="like-button" disabled>😍</button>
                    </div>
                         <b id="likes-count">${numberArray[0]}</b> 
                </div>`,

            `<div id="heart-count"> 
                    <div id="heart-div">
                        <button id="heart-button" disabled>❤️</button>
                    </div> 
                        <b id="hearts-count">${numberArray[1]}</b>  
                </div> `,

            `<div id="care-count"> 
                    <div id="care-div">
                        <button id="care-button" disabled>🥰</button>
                    </div> 
                        <b id="care-count">${numberArray[2]}</b> 
                </div>`]
        return disabledButtonsArray[index]

    } if (condition === "enabledButton") {
        const enableButtonsArray = [
            `<div id="like-count"> 
                    <div id="like-div">
                        <button id="like-button" onclick="addReaction(${id}, 'likes', [${numberArray}])">😍</button>
                    </div>  
                    <b id="likes-count">${numberArray[0]}</b>  
                </div>`,

            `<div id="heart-count"> 
                    <div id="heart-div">
                        <button id="heart-button" onclick="addReaction(${id}, 'hearts', [${numberArray}])">❤️</button>
                    </div> 
                    <b id="hearts-count">${numberArray[1]}</b>  
                </div> `,

            `<div id="care-count"> 
                    <div id="care-div">
                        <button id="care-button" onclick="addReaction(${id}, 'cares', [${numberArray}])">🥰</button>
                    </div> 
                    <b id="care-count">${numberArray[2]}</b> 
                </div>`]
        return enableButtonsArray[index]
    }
}

async function loadPosts() {
    const response = await fetch("/api/posts");
    const result = await response.json();
    posts = result;
    postsDiv.innerHTML = "";

    const likedResponse = await fetch(`/api/likedPosts/`);
    const likedResult = await likedResponse.json();
    likedPosts = likedResult

    let categorySelection = document.getElementById("category-selection").value;
    for (let i in posts) {
        const { id, text, userId, date, categori } = posts[i];
        let { minutes, hours } = posts[i];
        const reverseDate = date.split("-").reverse().join("-")

        minutes = formatTime(minutes);
        hours = formatTime(hours);

        if (categori === categorySelection || categorySelection === "all" && categori !== "home") {
            const likes = posts[i].likes || 0;
            const hearts = posts[i].hearts || 0;
            const cares = posts[i].cares || 0;
            const resObj = await fetch(`/api/getUserById/${userId}`);
            const foundUser = await resObj.json();
            let SecondPostPart = ""
            const firstPostPart = `
                    <br> 
                        <div class="post-div">
                        <b id="username"><a href="./userProfile/${userId}">${foundUser.username}</a>&nbsp;- ${categori} post</b>
                        <br>
                        <span id="text${id}">${text}</span>
                        <br>
                        <br>
                        <div id="info-and-reaction">
                        <b id="date"> ${reverseDate} </b> `
            const numberArray = [likes, hearts, cares]

            if (likedPosts.find((post) => post.postId == id && post.reaction === 0)) {
                SecondPostPart += ` 
                        <div id="reaction-count${id}">
                            ${reactionArrayForPosts(id, numberArray, "activeReaction", 0)}
                            ${reactionArrayForPosts(id, numberArray, "disabledButton", 1)}
                            ${reactionArrayForPosts(id, numberArray, "disabledButton", 2)}
                        </div>`
            } else if (likedPosts.find((post) => post.postId == id && post.reaction === 1)) {
                SecondPostPart += `
                        <div id="reaction-count${id}">
                            ${reactionArrayForPosts(id, numberArray, "disabledButton", 0)}
                            ${reactionArrayForPosts(id, numberArray, "activeReaction", 1)}
                            ${reactionArrayForPosts(id, numberArray, "disabledButton", 2)}
                        </div>`
            } else if (likedPosts.find((post) => post.postId == id && post.reaction === 2)) {
                SecondPostPart += `
                        <div id="reaction-count${id}">
                            ${reactionArrayForPosts(id, numberArray, "disabledButton", 0)}
                            ${reactionArrayForPosts(id, numberArray, "disabledButton", 1)}
                            ${reactionArrayForPosts(id, numberArray, "activeReaction", 2)}
                        </div>`
            } else {
                SecondPostPart += `
                        <div id="reaction-count${id}">
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

async function addReaction(id, reaction, numberArray) {

    if (reaction === "likes") {
        numberArray[0]++;
        const html = `
                    ${reactionArrayForPosts(id, numberArray, "activeReaction", 0)}
                    ${reactionArrayForPosts(id, numberArray, "disabledButton", 1)}
                    ${reactionArrayForPosts(id, numberArray, "disabledButton", 2)}
                `;
        document.getElementById(`reaction-count${id}`).innerHTML = html;
    }
    if (reaction === "hearts") {
        numberArray[1]++;
        const html = `
                    ${reactionArrayForPosts(id, numberArray, "disabledButton", 0)}
                    ${reactionArrayForPosts(id, numberArray, "activeReaction", 1)}
                    ${reactionArrayForPosts(id, numberArray, "disabledButton", 2)}
                `
        document.getElementById(`reaction-count${id}`).innerHTML = html;
    }
    if (reaction === "cares") {
        numberArray[2]++;
        const html = `
                    ${reactionArrayForPosts(id, numberArray, "disabledButton", 0)}
                    ${reactionArrayForPosts(id, numberArray, "disabledButton", 1)}
                    ${reactionArrayForPosts(id, numberArray, "activeReaction", 2)}
                `
        document.getElementById(`reaction-count${id}`).innerHTML = html;
    }

    const response = await fetch(`/api/postsOnlyLikes/${id}`, {
        headers: {
            "content-type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify({ reaction })
    });

}

async function removeReaction(id, reaction, numberArray) {

    if (reaction === "likes") {
        numberArray[0]--;
        document.getElementById(`reaction-count${id}`).innerHTML = `
                    ${reactionArrayForPosts(id, numberArray, "removeReaction", 0)}
                    ${reactionArrayForPosts(id, numberArray, "enabledButton", 1)}
                    ${reactionArrayForPosts(id, numberArray, "enabledButton", 2)}
                    `
    } if (reaction === "hearts") {
        numberArray[1]--;
        document.getElementById(`reaction-count${id}`).innerHTML = `
                    ${reactionArrayForPosts(id, numberArray, "enabledButton", 0)}
                    ${reactionArrayForPosts(id, numberArray, "removeReaction", 1)}
                    ${reactionArrayForPosts(id, numberArray, "enabledButton", 2)}
                    `
    } if (reaction === "cares") {
        numberArray[2]--;
        document.getElementById(`reaction-count${id}`).innerHTML = `
                    ${reactionArrayForPosts(id, numberArray, "enabledButton", 0)}
                    ${reactionArrayForPosts(id, numberArray, "enabledButton", 1)}
                    ${reactionArrayForPosts(id, numberArray, "removeReaction", 2)}
                `
    }
    const response = await fetch(`/api/postsOnlyUnLikes/${id}`, {
        headers: {
            "content-type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify({ reaction })
    });

    const deleteResponse = await fetch(`/api/unlike/` + id, {
        method: "DELETE",
    });


}

async function checkLikedPosts() {
    const res = await fetch(`/api/likedPosts`);
}

function formatTime(time) {

    if (time < 10) {

        return '0' + time;
    }

    return time;
}

