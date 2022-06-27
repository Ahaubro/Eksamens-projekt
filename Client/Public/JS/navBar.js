async function getUserBySearch() {
    const searchQuery = document.getElementById("user_search").value;
    window.location.replace('/search/' + searchQuery);
}