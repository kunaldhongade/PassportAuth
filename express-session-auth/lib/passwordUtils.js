const crypto = require("crypto");

function genPassword(password) {
  var salt = crypto.randomBytes(32).toString("hex");
  var genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return {
    salt: salt,
    hash: genHash,
  };
}

function validPassword(password, hash, salt) {
  var hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return hash === hashVerify;
}

/**
    genPassword that generates a password hash and salt using the crypto module in Node.js. Let's break down the code step by step:

    1. The function genPassword takes a password as an input parameter.

    2. It generates a random salt using the crypto.randomBytes method. The salt is a random string of characters that adds additional complexity to the password hash, making it more secure.

    3. The crypto.pbkdf2Sync method is used to generate the password hash. It takes several parameters:
    
        i. The password is the original password that needs to be hashed.
        
        ii. The salt is the random string generated in the previous step.

        iii. 10000 is the number of iterations used to derive the key. A higher number of iterations makes it more computationally expensive to crack the password.

        iv. 64 is the length of the derived key.

        v. "sha512" is the hashing algorithm used to generate the key.

    4. The crypto.pbkdf2Sync method returns a buffer, which is then converted to a hexadecimal string using the toString("hex") method.

    5. Finally, the function returns an object with two properties: salt and hash. The salt is the randomly generated string, and the hash is the derived password hash.

    This function can be used to securely store passwords in a database. By generating a unique salt for each password and using a strong hashing algorithm, it makes it difficult for attackers to reverse-engineer the original password from the stored hash.

    It's worth noting that this code snippet assumes that the crypto module has been imported and that the necessary dependencies are installed. Additionally, the code does not handle any error scenarios, so it's important to add proper error handling when using this function in a real-world application.

*/
module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;
