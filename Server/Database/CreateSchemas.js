import db from "./CreateConnection.js"
import bcrypt from "bcrypt";

const saltRounds = parseInt(process.env.SALTROUNDS);

const thorHashPass = await bcrypt.hash("1234", saltRounds);
const alexHashPass = await bcrypt.hash("0", saltRounds);

//Resetting if tables exists
db.query(`DROP TABLE IF EXISTS messages`);
db.query(`DROP TABLE IF EXISTS posts`);
db.query(`DROP TABLE IF EXISTS users`);
db.query(`DROP TABLE IF EXISTS chatrooms`);


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
        date DATE,
        hours INT,
        minutes INT,
        categori VARCHAR(50),
        FOREIGN KEY(userId) REFERENCES users(id)
    );
`);

//Chatrooms table
db.query(`
    CREATE TABLE IF NOT EXISTS chatrooms (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(80)
    );
`);


// Dummy data til db
db.query(`
    INSERT INTO users(username, email, password) VALUES ('Ahaubro', 'alex_haubro@hotmail.com', '${alexHashPass}'),
    ('Thorminathor', 'thorfa4444@gmail.com', '${thorHashPass}');
`);

db.query(`
    INSERT INTO posts(text, userId, likes, date, hours, minutes, categori) VALUES ('At smiles.com we post whatever made us smile today!', 1, 3, "2022-05-30", 15, 36, 'home'), 
    ('It could be anything from meeting a cute dog, to having a secret admire!', 2, 3, "2022-05-30", 15, 38, 'home'),
    ('We just wish for people to share their positive feelings with the world', 1, 3, "2022-05-30", 15, 38, 'home'),
    ('Today i had a great date! I love all you can eat sushi', 2, 3, "2022-05-30", 16, 47, 'love'),
    ('Today we finally finished the project after 7 tough months!', 1, 3, "2022-05-30", 15, 47, 'work');
`);

db.query(`
    INSERT INTO chatrooms(name) VALUES ('Chatroom - Alfa'), ('Chatroom - Beta'), ('Chatroom - Delta');
`);

db.end();