let searchInput = document.getElementById("search-input");
let searchResults = document.getElementById("search-results");

let searchQuery = "%%QUERY%%";
search(searchQuery);

function newSearch(){
    let searchQuery = searchInput.value;
    window.location.href = '/search/' + searchQuery;
}

async function search(searchQuery){
    searchInput.value = searchQuery;
    const response = await fetch('/api/search/' + searchQuery);
    const users = await response.json();
    showResults(users);
}

function showResults(users){
    searchResults.innerHTML = "";
    for(let i in users){
        searchResults.innerHTML += `
            <div>
                <b><a href="/profile/${users[i].id}">${users[i].username}</a></b>
            </div><br>
        `;
    }
}