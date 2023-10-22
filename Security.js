const crypto = require('crypto')

function EncPass(password) {
    const secret = 'very-secret-password-password'
    let cipher = crypto.createCipher('aes-128-cbc', secret);
    let hash = cipher.update(password, 'utf8', 'hex')
    hash += cipher.final('hex');
    return hash
}

//Function to decrypt Password
function decPassword(encryptedPassword) {
    const secret = 'very-secret-password-password'
    var mykey = crypto.createDecipher('aes-128-cbc', secret);
    var mystr = mykey.update(encryptedPassword, 'hex', 'utf8')
    mystr += mykey.final('utf8');
    return mystr
}


module.exports = {
    EncPass:EncPass,
    decPassword :decPassword
}