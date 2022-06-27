//Set the navbar element to active when you are on the current page
function setActive() {
    let currentPage = window.location.pathname.substring(1)

    if (currentPage === "") currentPage = "home"
    let aTags = document.getElementsByTagName('a')

    if (currentPage.includes("home") || currentPage.includes("smileposts") || currentPage.includes("chatrooms") || currentPage.includes("mypage")) {
        for (let i = 0; i < aTags.length; i++) {
            if (aTags[i].className === "active") {
                aTags[i].className = ""
            }
            document.getElementById(currentPage).className = "active"
        }
    }
}

setActive();


let responseMessage = "";

//Function that logs out user from the active session
async function logout() {
    const res = await fetch(`/auth/logout`);

    if (res.status == 201) {
        responseMessage = await res.text();
        document.getElementById("response").innerText = responseMessage

        setTimeout(() => {
            window.location.replace("/")
        }, 2000);
    } else {
        responseMessage = await res.text();

        document.getElementById("response").innerText = responseMessage
    }
}
