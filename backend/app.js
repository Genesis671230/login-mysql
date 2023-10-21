const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();

// Configure MySQL connection.
const db = mysql.createConnection({
  host: "127.0.0.1",
  database: "login",
  user: "root",
  password: "admin",
  port: 3306,
});

db.connect((err) => {
  //   if (err) throw new Error(err);
  //   console.log("Connected");
  //   db.query("CREATE DATABASE if NOT EXISTS mydb", (error) => {
  //     if (error) throw new Error(err);
  //     console.log("DATABASE created/exists");
  //     db.changeUser({ database: "mydb" }, (er) => {
  //       if (er) throw new Error(err);
  //       createTable();
  //     });
  //   });
  if (err) throw new Error(err);
  console.log("connected ");
});

const createTable = () => {
  db.query(
    `CREATE TABLE if NOT EXISTS usersdata (
        id INT  AUTO_INCREMENT NOT NULL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
    )`,
    (err) => {
      if (err) throw new Error(err);

      console.log("TABLE Created/Exists");
    }
  );
};

app.use(bodyParser.json());
app.use(express.json());
let corsOptions = {
  origin: ["http://127.0.0.1:5500"],
  
};

app.use(cors(corsOptions));
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*"); // Replace '*' with your front-end origin if necessary
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   next();
// });

app.get("/users", async (req, res) => {
  const user = db.query("SELECT * FROM usersdata", (err, rows) => {
    if (err) {
      console.log(err.message);
    } else {
      // console.log(rows);
      res.status(200).json(rows);
    }
  });

  //   res.status(200).json({ msg: "wonderland" });
});
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const values = [username, email, password];
  const sql = "INSERT INTO usersdata VALUES (?, ?, ?)";

  //   db.query("SELECT * FROM usersdata WHERE username = ? OR email = ? ", [username, email], (err,data) => {
  //     if (err) {
  //         console.log("we have error");
  //         res.status(400).json(err);
  //     }
  //     if(data.length){

  //         console.log("we have the data");
  //         //   console.log(result);
  //         res.status(200).json("USER already exists");
  //     }

  db.query(
    "INSERT INTO usersdata(`username`,`email`,`password`) VALUES (?)",
    [values],
    (err, data) => {
      if (err) {
        console.log("we have error 21321321");
        return res.json(err);
      }
      return res.status(200).json("USER HAS BEEN CREATED");
    }
  );

  //   })

  //   res.status(200).json({ msg: "wonderland" });
});
app.put("/update-user:id", async (req, res) => {
  const { username, email, password } = req.body;
  console.log(req.body);
  const user = [username, email, password];
  const id = req.params.id;
  // db.query(
  //   `UPDATE usersdata SET ? WHERE id = ${id}`,
  //   { username, email, password },
  //   (err, result) => {
  //     if (err) {
  //       console.log(err.message);
  //       res.end();
  //     } else {
  //       console.log(result);
  //     }
  //   }
  // );

  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  // jwt.verify(token, "jwtkey", (err, userInfo) => {
    // if (err) return res.status(403).json("Token is not valid!");

    const postId = req.params.id;
    const q =
      "UPDATE posts SET `username`=?,`email`=?,`password`=? WHERE `id` = ?";

    // const values = [req.body.title, req.body.desc, req.body.img, req.body.cat];

    db.query(q, [...user, id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("Post has been updated.");
    });
  // });


  //   res.status(200).json({ msg: "wonderland" });
});


app.post("/login", async (req, res) => {
  //CHECK USER
  const { username, password } = req.body;
  const q = "SELECT * FROM usersdata WHERE username = ?";

  db.query(q, [username], (err, data) => {
      if (err) {
          return res.status(500).json({ message: "Internal server error", error: err });
      }

      if (data.length === 0) {
          return res.status(404).json({ message: "User not found" });
      }

      const storedPassword = data[0].password; // Assuming this is the hashed password in the database

      // Check if the entered password matches the stored password
      
      if (req.body.password !== storedPassword) {
          return res.status(400).json({ message: "Wrong username or password" ,state:[storedPassword,req.body.password]});
      }
    // const isPasswordCorrect = password == data[0]?.password;
    // console.log(isPasswordCorrect);
    // if (!isPasswordCorrect) return res.status(400).json("Wrong username or password!");

    const token = jwt.sign({ id: data[0].id }, "jwtkey");
    const { password, ...other } = data[0];

    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(other);
    // res.status(200).json("Login success",data);
  });
})

app.post("/logout", async (req, res) => {
  res
    .clearCookie("access_token", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .json("User has been logged out.");
})


app.delete("/deleteuser/:id", async (req, res) => {
        // const token = req.cookies.access_token;
        // if (!token) return res.status(401).json("Not authenticated!");
      
        // jwt.verify(token, "jwtkey", (err, userInfo) => {
        //   if (err) return res.status(403).json("Token is not valid!");
      
          const userId = req.params.id;
          console.log(userId,"this is user id");
          const q = "DELETE FROM usersdata WHERE `id` = ?";
      
          db.query(q, [userId], (err, data) => {
            if (err) return res.status(403).json("You can delete only your user!");
      
            return res.json("User has been deleted!");
          });
        // });
 
})

// Register a new user.
// app.post("/register", async (req, res) => {
//   const { username, email, password } = req.body;

//   const sqlSearch = "SELECT * FROM usersdata WHERE username = ?";
//   const search_query = mysql.format(sqlSearch, [username]);

//   const sqlInsert = "INSERT INTO usersdata VALUES (0,?,?,?)";
//   const insert_query = mysql.format(sqlInsert, [username, email, password]);

//   const newUser = { username, email, password };
//   await db.query(search_query, async (err, result) => {
//     if (err) res.status(400).json(err);
//     console.log("------> Search Results");
//     console.log(result.length);
//     if (result.length != 0) {
//       db.release();
//       console.log("------> User already exists");
//       res.sendStatus(409);
//     } else {
//       await db.query(insert_query, (err, result) => {
//         db.release();
//         if (err) res.status(400).json(err);
//         console.log("--------> Created new User");
//         console.log(result.insertId);
//         res.sendStatus(201);
//       });
//     }
//   });
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
