// Login function 
async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    let user = {};
    let responseMessage = "";

    if (username && password) {
        user.username = username;
        user.password = password;
    }

    const res = await fetch(`/auth/login`, {
        headers: {
            "content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(user),
    });

    let snackbar = document.getElementById("snackbar");
    snackbar.className = "show";

    if (res.status == 201) {
        responseMessage = await res.text();

        snackbar.style.backgroundColor = "rgb(141, 238, 84)";
        snackbar.innerText = responseMessage

        setTimeout(() => {
            window.location.replace("/smileposts")
        }, 1000);

        
        setTimeout(function () { snackbar.className = snackbar.className.replace("show", ""); }, 3000);
    } else {
        responseMessage = await res.text();

        snackbar.style.backgroundColor = "red"
        snackbar.innerText = responseMessage
        setTimeout(function () { snackbar.className = snackbar.className.replace("show", ""); }, 3000);
    }
}


// Register funktion 
async function register() {
    const email = document.getElementById("reg_email").value;
    const username = document.getElementById("reg_username").value;
    const password = document.getElementById("reg_password").value;
    let user = {};
    let responseMessage = "";

    if (username && password && email) {
        user.email = email;
        user.username = username;
        user.password = password;
    }

    const res = await fetch(`/auth/signup`, {
        headers: {
            "content-type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(user)
    });



    if (res.status == 201) {
        responseMessage = await res.text();
        document.getElementById("response").innerText = responseMessage

        setTimeout(() => {
            window.location.replace("/login")
        }, 1000);
    } else {
        responseMessage = await res.text();
        document.getElementById("response").innerText = responseMessage

    }
}



// MODAL

function showRegisterModal() {
    registerModal.className = 'shown-modal';
}

function hideRegisterModal() {
    registerModal.className = 'hidden-modal';
}

document.addEventListener('mouseup', function (event) {
    if (!registerModal.contains(event.target))
        hideRegisterModal();
});



