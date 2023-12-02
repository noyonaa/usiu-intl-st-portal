//Function to check email
function checkEmail(email) {
  var filter = /^([a-zA-Z0-9_\.\-])+\@usiu\.ac\.ke$/;

  if (!filter.test(email)) {
    return false;
  } else {
    return true;
  }
}

function isOnlyDigits(string) {
  for (let i = 0; i < string.length; i++) {
    var ascii = string.charCodeAt(i);
    if (ascii < 48 || ascii > 57) {
      return false;
    }
    }
    if (string.length != 6) {
        return false;
  }
  return true;
}

module.exports = {
  checkEmail: checkEmail,
  isOnlyDigits: isOnlyDigits,
};
