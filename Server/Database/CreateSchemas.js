import db from "./CreateConnection.js"
import bcrypt from "bcrypt";

const saltRounds = parseInt(process.env.SALTROUNDS);


const thorHashPass = await bcrypt.hash("1234", saltRounds);
const alexHashPass = await bcrypt.hash("0", saltRounds);

db.query(`
    CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50),
        email VARCHAR(100),
        password VARCHAR(150)
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
    INSERT INTO users(username, email, password) VALUES ('Ahaubro', 'alex_haubro@hotmail.com', '${alexHashPass}'), ('Thorminathor', 'thorfa4444@gmail.com', '${thorHashPass}');
`);
db.query(`
    INSERT INTO posts(text) VALUES ('This is a test post'), ('This is another test post'), ('This is a third test post');
`);

db.end();