async function getUserBySearch() {
    const searchQuery = document.getElementById("user_search").value;

    if(searchQuery)
        window.location.replace('/search/' + searchQuery);
    else
        window.location.replace('/search');
}