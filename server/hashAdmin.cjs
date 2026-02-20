const bcrypt = require("bcrypt");

bcrypt.hash("Admin@12345", 10).then((hash) => {
  console.log(hash);
});

// this file is for forgot password, encrypted one password paste in mongodb