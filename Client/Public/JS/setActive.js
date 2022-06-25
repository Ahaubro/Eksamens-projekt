function setActive() {

    let currentPage = window.location.pathname.substring(1)
    if (currentPage === "") currentPage = "home"
    let aTags = document.getElementsByTagName('a')
    for (let i = 0; i < aTags.length; i++) {
        if (aTags[i].className === "active") {
            aTags[i].className = ""
        }

        document.getElementById(currentPage).className = "active"
    }
}
setActive();