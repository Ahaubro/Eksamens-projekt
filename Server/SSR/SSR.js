import fs from "fs";

const SSR = {
    directory: '',
    loadFile: function(file){
        return fs.readFileSync('./public/' + this.directory + file)
        .toString();
    },
    replace: function(page, replacements){
        for(let key in replacements){
            let replacement = replacements[key];
            if(replacement){
                if(replacement[0] === '/')
                    replacement = this.loadFile(replacement);
                page = page.replace('%%' + key.toUpperCase() + '%%', replacement);
            }else
                page = page.replace('%%' + key.toUpperCase() + '%%', "");
        }
        return page;
    }
};

SSR.directory = '../../Client/Public/Components';
const headerTemplate = SSR.loadFile("/Header.html");
const header = SSR.replace(headerTemplate, {navbar: '/Navbar.html'});

function loggedInDependent(page, isLoggedIn){
    SSR.directory = '../../Client/Public/Components';
    if(isLoggedIn){
        return SSR.replace(page, {loggedIn: '/LoggedIn.html'})
    }else{
        return SSR.replace(page, {loggedIn: '/LoggedOut.html'})
    }
}



const pageStylesDirectory = './Css';
const homeStyles = `<link rel="stylesheet" type="text/css" href="${pageStylesDirectory}/HomeStyle.css">`;
const chatroomStyles = `<link rel="stylesheet" type="text/css" href="${pageStylesDirectory}/ChatroomStyle.css">`;
const smilePostsStyles = `<link rel="stylesheet" type="text/css" href="${pageStylesDirectory}/SmilePostsStyle.css">`;
const loginStyles = `<link rel="stylesheet" type="text/css" href="${pageStylesDirectory}/LoginStyle.css">`;
const editStyles = `<link rel="stylesheet" type="text/css" href="${pageStylesDirectory}/EditStyle.css">`;
const profileStyles = `<link rel="stylesheet" type="text/css" href="../Css/ProfileStyle.css">`;

SSR.directory = '../../Client/Public/Pages';
const templatePage_Template = SSR.loadFile('/TemplatePage.html');
const templatePage = SSR.replace(templatePage_Template, {header});

function loadProfilePage(user){
    SSR.directory = '../../Client/Public/Pages';
    const profilePage = SSR.replace(templatePage, {
        title: 'Smiles - ' + user.username + ' Profile',
        styles: profileStyles,
        content: '/Profile.html'
    });
    const {id} = user;
    return SSR.replace(profilePage, {id});
}

const homePage = SSR.replace(templatePage, {
    title: 'Smiles',
    styles: homeStyles,
    content: '/Home.html'
});

const chatroomsPage = SSR.replace(templatePage, {
    title: 'Smiles - Chatrooms',
    styles: chatroomStyles,
    content: '/Chatrooms.html'
});

const smilePostsPage = SSR.replace(templatePage, {
    title: 'Smiles - Smile Posts',
    styles: smilePostsStyles,
    content: '/SmilePosts.html'
});

const smilePostsPageOne = SSR.replace(templatePage, {
    title: 'Smiles - Smile Posts',
    styles: smilePostsStyles,
    content: '/SmilePostsOne.html'
});

const smilePostsPageTwo = SSR.replace(templatePage, {
    title: 'Smiles - Smile Posts',
    styles: smilePostsStyles,
    content: '/SmilePostsTwo.html'
});

const loginPage = SSR.replace(templatePage, {
    title: 'Smiles - Login',
    styles: loginStyles,
    content: '/Login.html'
});

const editPage = SSR.replace(templatePage, {
    title: 'Smiles - edit Profile',
    styles: editStyles,
    content: '/EditProfile.html'
})

export default {
    homePage,
    chatroomsPage,
    smilePostsPage,
    loginPage, 
    editPage,
    smilePostsPageOne,
    smilePostsPageTwo,
    loggedInDependent,
    loadProfilePage
};