
let chatroomsDiv = document.getElementById("chatroomsList");
let chatrooms;
const contentDiv = document.getElementById("content");

// Chatrooms
let currentRoomId = 0;

async function loadMessages() {
    const response = await fetch("/api/chat_messages/" + currentRoomId);
    const oldMessages = await response.json();
    messages.innerHTML = "";
    for (let i in oldMessages) {
        const { userId, username, message } = oldMessages[i];
        messages.innerHTML += `<p><a href="/profile/${userId}"><b>${username}:</a></b> ${message}</p>`;
    }
}

const socket = io();
socket.on("recieved-message", ({ username, message, roomId }) => {
    if (currentRoomId == roomId) {
        messages.innerHTML += `<p><b>${username}:</b> ${message}</p>`;
    }
    loadMessages();
});



async function sendMessage(roomId) {
    document.getElementById("response").innerText = "";
    const messageInput = document.getElementById("messageInput");
    const message = messageInput.value;
    let msgMaxLength = Number(document.getElementById("msgMaxLength").innerText);
    if (message.length > msgMaxLength)
        document.getElementById("response").innerText = `Message can not be over ${msgMaxLength} characters`;
    else {
        const response = await fetch("/api/chat_messages", {
            headers: { "content-type": "application/json" },
            method: "POST",
            body: JSON.stringify({ message, roomId })
        });
        const username = await response.text();
        socket.emit("sent-message", { username, message, roomId });
        messageInput.value = "";
        updateMessageLength();
    }
}


function updateMessageLength() {
    let messageInput = document.getElementById("messageInput");
    let lengthLimit = document.getElementById("lengthLimit");
    let msgLength = document.getElementById("msgLength");
    let msgMaxLength = Number(document.getElementById("msgMaxLength").innerText);
    msgLength.innerText = messageInput.value.length;
    if (messageInput.value.length > msgMaxLength && lengthLimit.style.color != "red")
        lengthLimit.style.color = "red";
    else if (messageInput.value.length <= msgMaxLength && lengthLimit.style.color != "black")
        lengthLimit.style.color = "black";
}


async function loadChatrooms(chatroomsDiv) {

    const response = await fetch("/api/chatrooms");
    const result = await response.json();
    chatrooms = result;
    chatroomsDiv.innerHTML = "";
    for (let i in chatrooms) {
        const { id, name, username, creatorId } = chatrooms[i];
        chatroomsDiv.innerHTML += `<p>
                <button onclick="joinRoom(${id}, '${name}')" id="chatroom${id}" class="chatroomBtns"> <h2>${name}</h2></button><br>
                <span>By <a href="./profile/${creatorId}">${username}</a><span>
            </p>`;
    }
}

loadChatrooms(chatroomsDiv);


async function joinRoom(id, name) {
    const response = await fetch("/api/chatrooms/" + id);
    const chatroom = await response.json();

    currentRoomId = id;

    contentDiv.innerHTML = `
            <h1> ${name} </h1>
            <div id="messages"></div>

            <input placeholder="Message" id="messageInput" onkeyup="updateMessageLength()"/>
            <span id="lengthLimit"><span id="msgLength">0</span>/<span id="msgMaxLength">${chatroom.max_message_length}</span></span>
            <button id="sendBtn" onclick="sendMessage(${id})">Send Message</button>
            <button id="leaveBtn" onclick="leaveChatroom()">Leave Chatroom</button>
        `;
    loadMessages();
}

function leaveChatroom() {
    currentRoomId = 0;
    contentDiv.innerHTML = ` 
            <h1>Chatrooms</h1>
            <div id="chatroomsList"></div>
            <label>Name: </label><input id="chatroomName"/>
            <label>Message Length: </label><input type="number" id="chatroomMessageLength"/>
            <button onclick="createChatroom()">Create</button>
        `;

    let chatroomsDiv = document.getElementById("chatroomsList");

    loadChatrooms(chatroomsDiv);
}

async function createChatroom() {
    document.getElementById("response").innerText = "";
    let chatroomsDiv = document.getElementById("chatroomsList");
    const name = document.getElementById("chatroomName").value;
    const maxMsgLength = Number(document.getElementById("chatroomMessageLength").value);
    if (maxMsgLength <= 100 || maxMsgLength >= 2000)
        return document.getElementById("response").innerText = "Max message length must be between 100 and 2000";

    const response = await fetch("/api/chatrooms", {
        headers: { "content-type": "application/json" },
        method: "POST",
        body: JSON.stringify({ name, maxMsgLength })
    });
    const result = await response.text();
    document.getElementById("response").innerText = result;
    loadChatrooms(chatroomsDiv);
}

// Modal
function showChatroomModal() {
    chatroom_modal.className = 'shown-chatroom_modal';
}

function hideChatroomModal() {
    chatroom_modal.className = 'hidden-modal';
}

document.addEventListener('mouseup', function (event) {
    if (!chatroom_modal.contains(event.target))
        hideChatroomModal();
});