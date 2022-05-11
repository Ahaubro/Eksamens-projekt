import db from "./CreateConnection.js"
import bcrypt from "bcrypt";

const saltRounds = parseInt(process.env.SALTROUNDS);

const thorHashPass = await bcrypt.hash("1234", saltRounds);
const alexHashPass = await bcrypt.hash("0", saltRounds);

db.query(`DROP TABLE IF EXISTS users`);
db.query(`DROP TABLE IF EXISTS posts`);

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
        zipcode SMALLINT(4),
        profilecolor VARCHAR(7)
    );
`);

db.query(`
    CREATE TABLE IF NOT EXISTS posts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        text VARCHAR(500)
    );
`);

/* LAV TABLE TIL POSTS  */

db.query(`
    INSERT INTO users(username, email, password) VALUES ('Ahaubro', 'alex_haubro@hotmail.com', '${alexHashPass}'),
    ('Thorminathor', 'thorfa4444@gmail.com', '${thorHashPass}');
`);

db.query(`
    INSERT INTO posts(text) VALUES ('This is a test post'), ('This is another test post'), ('This is a third test post');
`);

db.end();