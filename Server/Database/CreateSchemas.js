import db from "./CreateConnection.js"
import bcrypt from "bcrypt";

const saltRounds = parseInt(process.env.SALTROUNDS);

const thorHashPass = await bcrypt.hash("1234", saltRounds);
const alexHashPass = await bcrypt.hash("0", saltRounds);
const malteHashPass = await bcrypt.hash("0", saltRounds);

//Resetting if tables exists
db.query(`DROP TABLE IF EXISTS chat_messages`);
db.query(`DROP TABLE IF EXISTS likedPosts`);
db.query(`DROP TABLE IF EXISTS posts`);
db.query(`DROP TABLE IF EXISTS chatrooms`);
db.query(`DROP TABLE IF EXISTS friends`);
db.query(`DROP TABLE IF EXISTS users`);


//Users table
db.query(`
    CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL,
        password VARCHAR(150) NOT NULL,
        firstname VARCHAR(25),
        middlename VARCHAR(30),
        lastname VARCHAR(30),
        birthday DATE,
        address VARCHAR(50),
        country VARCHAR(50),
        city VARCHAR(45),
        zipcode VARCHAR(4),
        profilecolor VARCHAR(7),
        profilepicture VARCHAR(255)
    );
`);


// Posts table
db.query(`
    CREATE TABLE IF NOT EXISTS posts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        userId INT,
        text VARCHAR(500),
        likes INT,
        hearts INT,
        cares INT,
        date DATE,
        hours INT,
        minutes INT,
        categori VARCHAR(50),
        haveLiked BOOLEAN DEFAULT false,
        FOREIGN KEY(userId) REFERENCES users(id)
    );
`);


//Chatrooms table
db.query(`
    CREATE TABLE IF NOT EXISTS chatrooms (
        id INT PRIMARY KEY AUTO_INCREMENT,
        creatorId INT,
        name VARCHAR(80),
        max_message_length INT,
        FOREIGN KEY(creatorId) REFERENCES users(id)
    );
`);


// Posts table
db.query(`
    CREATE TABLE IF NOT EXISTS likedPosts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        userId INT,
        postId INT,
        reaction INT,
        FOREIGN KEY(userId) REFERENCES users(id),
        FOREIGN KEY(postId) REFERENCES posts(id)
    );
`);


// Messages table
db.query(`
    CREATE TABLE IF NOT EXISTS chat_messages (
        id INT PRIMARY KEY AUTO_INCREMENT,
        message VARCHAR(2000),
        userId INT,
        roomId INT,
        FOREIGN KEY(roomId) REFERENCES chatrooms(id),
        FOREIGN KEY(userId) REFERENCES users(id)
    );
`);


//Friends table
db.query(`
    CREATE TABLE IF NOT EXISTS friends (
        id INT AUTO_INCREMENT,
        userOne INT,
        userTwo INT,
        PRIMARY KEY(id),
        FOREIGN KEY(userOne) REFERENCES users(id),
        FOREIGN KEY(userTwo) REFERENCES users(id)
    );
`);


// Dummy data til db
db.query(`
    INSERT INTO users(username, email, password, profilepicture) VALUES ('Ahaubro', 'alex_haubro@hotmail.com', '${alexHashPass}', 'ppic.jpg'),
    ('Thorminathor', 'thorfa4444@gmail.com', '${thorHashPass}', 'PP.jpg'), ('malte', 'malte@hartvith.dk', '${malteHashPass}', 'Ca3pture.jpg');
`);

db.query(`
    INSERT INTO posts(text, userId, likes, date, hours, minutes, categori) VALUES ('At smiles.com we post whatever made us smile today!', 1, 3, "2022-05-30", 15, 36, 'home'), 
    ('It could be anything from meeting a cute dog, to having a secret admire!', 2, 3, "2022-05-30", 15, 38, 'home'),
    ('We just wish for people to share their positive feelings with the world', 1, 3, "2022-05-30", 15, 38, 'home'),
    ('Today i had a great date! I love all you can eat sushi', 2, 3, "2022-05-30", 16, 47, 'love'),
    ('Today we finally finished the project after 7 tough months!', 1, 3, "2022-05-30", 15, 47, 'work');
`);

db.query(`
    INSERT INTO chatrooms(creatorId, name, max_message_length) VALUES (1, 'Chatroom - Alfa', 200), (1, 'Chatroom - Beta', 400), (2, 'Chatroom - Delta', 600);
`);

db.end();