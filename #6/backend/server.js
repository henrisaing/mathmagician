const sqlite3 = require('sqlite3').verbose();
const sqlite = require('sqlite');
const express = require('express');
const fs = require('fs');
const html = require('html');
var cors = require('cors');
//StAuth10244: I Henri Saing, 000132162 certify that this material is my original work. No other person's work has been used without due acknowledgement. I have not made my work available to anyone else.

const dbname = 'math.db';
const port = 3000;
const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

if(fs.existsSync(dbname)){
  clearDB(dbname);
}else{
  createDB(dbname);
}

app.post('/login', async function(req, res){
  const db = await sqlite.open({
    filename : dbname,
    driver : sqlite3.Database
  });
  let username = req.body.username;
  let password = req.body.password;

  const result = await db.all("SELECT username, password  FROM Users WHERE username = ? AND password = ?", [username, password]);
  if(result.length > 0){
    res.status(200);
    res.send({"status": "success", "user": req.body.username});
  }else{
    res.status(200);
    res.send({"status": "failure"});
  }

  db.close();
});

app.post("/signup", async function(req, res, next)
{
  const db = await sqlite.open({
    filename : dbname,
    driver : sqlite3.Database
  });
  if(req.body.username.trim() == "" || req.body.password.trim() == ""){
    res.status(500);
    res.send({"status": "Username/password cannot be blank!"});
  }else{
   await db.run("INSERT OR IGNORE INTO Users (username, password, score) VALUES(?, ?, ?)", [req.body.username, req.body.password, 0]);

   const result = await db.all("SELECT username, password  FROM Users WHERE username = ? AND password = ?", [req.body.username, req.body.password]);

   if(result.length > 0){
    res.status(200);
    res.send({"status": "success", "user": req.body.username});
   }else{
    res.status(200);
    res.send({"status": "Username unavailable"});
   }
  }
  db.close();
});

app.post("/answer", async function(req, res){
  const db = await sqlite.open({
    filename : dbname,
    driver : sqlite3.Database
  });
  let a = req.body.a;
  let b = req.body.b;
  let c = req.body.c;

  const score = await db.all("SELECT username, score FROM Users WHERE username = ?", [req.body.user]);
  console.log(score);

  if((a + b) == c){
    await db.all("UPDATE Users SET score = score + 1 WHERE username = ?", [req.body.user]);
    res.status(200);
    res.send({"status": "correct"});
  }else{
    res.status(200);
    res.send({"status": "incorrect"});
  }
  

  db.close();
});

app.get("/question", function(req, res){
  let a = Math.floor(Math.random() * 100) + 1;
  let b = Math.floor(Math.random() * 100) + 1;
  res.status(200);
  res.send({"status": "success", "a": a, "b":b});
});

app.get("/leaders", async function(req, res){
  const db = await sqlite.open({
    filename : dbname,
    driver : sqlite3.Database
  });

  const score = await db.all("SELECT username, score FROM Users ORDER BY score DESC LIMIT 10");

  console.log(score);
  res.status(200);
  res.send(score);
  // res.send("");
});

app.get("/test", function(req, res){
  res.status(200);
  res.send({"status": "hello world"});
});

/**
 * Creates database table called Users
 * @param {string} input containing database file location/name
 */
async function createDB(input){
  const db = await sqlite.open({
      filename : input,
      driver : sqlite3.Database
  });

  await db.exec("CREATE TABLE Users (username TEXT UNIQUE, password TEXT, score INTEGER)");

  db.close();
}

/**
* Clears database table named users.
* @param {String} input containing database file location/name
*/
async function clearDB(input){
  const db = await sqlite.open({
      filename : input,
      driver : sqlite3.Database
  });

  await db.run('DELETE FROM Users');

  db.close();
}

app.listen(port);