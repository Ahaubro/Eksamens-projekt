function setActive() {

    let currentPage = window.location.pathname.substring(1)
    if (currentPage === "") currentPage = "home"
    let aTags = document.getElementsByTagName('a')
    console.log(currentPage)
    console.log(aTags.length)
    for (let i = 0; i < aTags.length; i++) {
        console.log("each atag", aTags[i])
        if (aTags[i].className === "active") {
            console.log("atag to edit", aTags[i])
            aTags[i].className = ""
        }

        document.getElementById(currentPage).className = "active"
    }
}
setActive();