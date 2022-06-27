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
        setTimeout(function () { snackbar.className = snackbar.className.replace("show", ""); }, 3000);

        setTimeout(() => {
            window.location.replace("/smileposts")
        }, 1000);


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

    let snackbar = document.getElementById("snackbar");
    snackbar.className = "show";

    if (email.includes("@") && email.includes(".")) {
        let check = email.split("@")
        let check2 = check[1].split(".")

        if (check[0] && check2[0] && check2[1]) {
            if (username && password && password.length > 0) {
                user.email = email;
                user.username = username;
                user.password = password;


                const res = await fetch(`/auth/signup`, {
                    headers: {
                        "content-type": "application/json"
                    },
                    method: "POST",
                    body: JSON.stringify(user)
                });

                if (res.status == 201) {

                    responseMessage = await res.text();
                    snackbar.style.backgroundColor = "rgb(141, 238, 84)"
                    snackbar.innerText = responseMessage
                    setTimeout(function () { snackbar.className = snackbar.className.replace("show", ""); }, 3000);

                    setTimeout(() => {
                        window.location.replace("/login")
                    }, 1000);

                } else {

                    responseMessage = await res.text();
                    snackbar.style.backgroundColor = "red"
                    snackbar.innerText = responseMessage
                    setTimeout(function () { snackbar.className = snackbar.className.replace("show", ""); }, 3000);
                }

            } else {
                snackbar.style.backgroundColor = "red"
                snackbar.innerText = "You must fill out all the information"
                setTimeout(function () { snackbar.className = snackbar.className.replace("show", ""); }, 3000);
            }
        } else {
            snackbar.style.backgroundColor = "red"
            snackbar.innerText = "Check if it is the correct email"
            setTimeout(function () { snackbar.className = snackbar.className.replace("show", ""); }, 3000);
        }
    } else {
        snackbar.style.backgroundColor = "red"
        snackbar.innerText = "You have to have both \"@\" and \".\" in your email"
        setTimeout(function () { snackbar.className = snackbar.className.replace("show", ""); }, 3000);
    }
}



// MODAL

function showRegisterModal() {
    registerModal.className = 'shown-modal';
}

function hideRegisterModal() {
    registerModal.className = 'hidden-modal';
}

document.addEventListener('mousedown', function (event) {
    if (!registerModal.contains(event.target))
        hideRegisterModal();
});



