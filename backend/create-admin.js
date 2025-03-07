// const bcrypt = require('bcryptjs');

// async function hashPassword(password) {
//     const salt = await bcrypt.genSalt(10);
//     const hash = await bcrypt.hash(password, salt);
//     console.log('Hashed password:', hash);
// }

// hashPassword('password');

const crypto = require('crypto');

// Generate a random value
const randomValue = crypto.randomBytes(64).toString('hex');

// Output it to the console
console.log(randomValue);