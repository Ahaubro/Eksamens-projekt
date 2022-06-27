const postsDiv = document.getElementById("posts");
let posts;


//Function that loads welcoming posts on home.html
async function loadPosts() {
    const response = await fetch("/api/postsHome");
    const result = await response.json();
    posts = result;
    postsDiv.innerHTML = "";
    for (let i in posts) {
        const { id, text, userId, date, hours, minutes, categori } = posts[i];

        if (categori === 'home') {
            const res = await fetch(`/api/getUsername/${userId}`);
            const foundUsername = await res.text();
            postsDiv.innerHTML += ` <br> 
                <article class="postArticle">
                    <b id="username">${foundUsername}</b>
                    <br>
                    <span id="text${id}">${text}</span>
                    <br>
                    <br>
                    <b id="date"> ${date} </b> <b id="time"> ${hours}:${minutes}</b>
                    <br>
                </article> 
            <br>`;
        }
    }
}

loadPosts();

