import db from "./CreateConnection.js"
import bcrypt from "bcrypt";

const saltRounds = parseInt(process.env.SALTROUNDS);

const thorHashPass = await bcrypt.hash("1234", saltRounds);
const alexHashPass = await bcrypt.hash("0", saltRounds);

//Resetting if tables exists
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
        profilePicture LONGBLOB
    );
`);

// Posts table
db.query(`
    CREATE TABLE IF NOT EXISTS posts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        userId INT,
        text VARCHAR(500),
        date DATE,
        hours INT,
        minutes INT,
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
    INSERT INTO posts(text, userId) VALUES ('This is a test post', 1), ('This is another test post', 2), ('This is a third test post', 1);
`);

db.query(`
    INSERT INTO chatrooms(name) VALUES ('Chatroom - Alfa'), ('Chatroom - Beta'), ('Chatroom - Delta');
`);

db.end();