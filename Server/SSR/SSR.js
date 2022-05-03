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
            if(replacement[0] === '/'){
                replacement = this.loadFile(replacement);
            }
            page = page.replace('%%' + key.toUpperCase() + '%%', replacement);
        }
        return page;
    }
};

SSR.directory = '../../Client/Public/Components';
const headerTemplate = SSR.loadFile("/Header.html");
const header = SSR.replace(headerTemplate, {navbar: '/Navbar.html'});

SSR.directory = '../../Client/Public/Pages';
const templatePage_Template = SSR.loadFile('/TemplatePage.html');
const templatePage = SSR.replace(templatePage_Template, {header});

const homePage = SSR.replace(templatePage, {
    title: 'Smiles',
    content: '/Home.html'
});

const chatroomsPage = SSR.replace(templatePage, {
    title: 'Smiles - Chatrooms',
    content: '/Chatrooms.html'
});

const smilePostsPage = SSR.replace(templatePage, {
    title: 'Smiles - Smile Posts',
    content: '/SmilePosts.html'
});

const loginPage = SSR.replace(templatePage, {
    title: 'Smiles - Login',
    content: '/Login.html'
});

export default {
    homePage,
    chatroomsPage,
    smilePostsPage,
    loginPage
};