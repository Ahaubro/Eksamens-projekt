

async function showUsername() {

    let username = document.getElementById("username")
    let firstname = document.getElementById("firstname")
    const res = await fetch(`/api/loggedInUser`);
    const user = await res.json();

    username.innerText = "Logged in as " + user.username
}
showUsername();


async function getUserBySearch() {
    const searchQuery = document.getElementById("user_search").value;
    
    //const userObjRes = await fetch(`/api/getUserByUsername/${username}`)
    //const userInformation = await userObjRes.json();

    //window.location.replace(`/search/${searchQuery}`);
    if(searchQuery)
        window.location.replace('/search/' + searchQuery);
    else
        window.location.replace('/search');

}