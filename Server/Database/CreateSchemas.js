import db from "./CreateConnection.js"
import bcrypt from "bcrypt";

const saltRounds = 12;


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


/* LAV TABLE TIL POSTS  */


/*db.query(`
    INSERT INTO users(username, email, password) VALUES ('Ahaubro', 'alex_haubro@hotmail.com', '${alexHashPass}'), ('Thorminathor', 'thorfa4444@gmail.com', '${thorHashPass}');
`);*/

db.end();