import db from "./CreateConnection.js"

db.query(`
    CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50),
        email VARCHAR(100),
        password VARCHAR(150)
    );
`);


/* LAV TABLE TIL POSTS  */


db.query(`
    INSERT INTO users(username, email, password) VALUES ('Ahaubro', 'alex_haubro@hotmail.com', '0'), ('Thorminathor', 'thorfa4444@gmail.com', '1234');
`);

db.end();