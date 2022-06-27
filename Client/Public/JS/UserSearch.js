let searchInput = document.getElementById("search-input");
let searchResults = document.getElementById("search-results");

let query = window.location.pathname.substring(8)

let searchQuery = query;


//Displays new page containing search results
function newSearch() {
    let searchQuery = searchInput.value;
    window.location.href = '/search/' + searchQuery;
}


//when searched, we are redirected with newSearch, and then we fetch (with search) the results and displays them
async function search(searchQuery) {
    searchInput.value = searchQuery;
    const response = await fetch('/api/search/' + searchQuery);
    const users = await response.json();

    searchResults.innerHTML = "";
    for (let i in users) {
        searchResults.innerHTML += `
            <div>
                <b><a href="/profile/${users[i].id}">${users[i].username}</a></b>
            </div><br>
        `;
    }
}

search(searchQuery);

