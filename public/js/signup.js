function toggleForm() {
    let container = document.querySelector('.container');
    let section = document.querySelector('section');
    container.classList.toggle('active');
    section.classList.toggle('active');
}

function display(message) {
    let err = document.querySelector('.pop-up')
    err.classList.toggle('hide')
    let Message = document.querySelector('.message')
    Message.innerText = message
}

if (document.getElementById('close')) {
    let close_btn = document.getElementById('close')
    close_btn.onclick = () => {
        document.querySelector('.pop-up').classList.toggle('hide')
    }
}

//Function to check email
function checkEmail(email) {

    var filter = /^([a-zA-Z0-9_\.\-])+\@usiu\.ac\.ke$/;

    if (!filter.test(email)) {
        display('Please provide a valid USIU email address')
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
    return true;
}

//function to signup students
async function SignUp_Students() {
    const url = '/signup-student'
    const data = {
        full_name: document.getElementById('full_name').value,
        id_number: document.getElementById('id_number').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
    }

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };
    const response = await fetch(url, options);
    const outcome = await response.json();
    if (response.status === 401)
        display(outcome.message)
    if (response.status === 200)
        display("New Student added")
        setTimeout(()=>{window.location.href = '/login-page'},2000)

}

document.getElementById('Student').addEventListener('submit', e => {
    e.preventDefault()
    var idnum = document.getElementById('id_number').value

    console.log(idnum)
    console.log("Signing up")
    if (checkEmail(document.getElementById('email').value)== false){
        alert ("Please enter a USIU Email Address");
    }
    else if (document.getElementById('password').value !== document.getElementById('password2').value)
        // display('Your two passwords are not the same')
        console.log("Passwords are not the same")
    else if (document.getElementById('password').value.length < 8)
        // display('Password should be at least 8 characters')
        console.log("Password is too short. should be minimum 8 characters")
    else if (document.getElementById('id_number').value.length != 6)
        console.log("ID number should be 6 numbers long")
    else if (isOnlyDigits(idnum)==false){
        console.log("ID number must have only numerical digits")
    }
    else
        SignUp_Students()
})

