// var userID ;

// console.log("HERE")
var id;
async function getOfficialInfo() {
    const url = '/get-session-user'
    const response = await fetch(url, { method: 'GET' })
    const data = await response.json()
    console.log(data);
    populateDetails(data)
    console.log("Received official details: "+ data)
}

getOfficialInfo()


function populateDetails(detail) {
    id = detail.off_id
    document.getElementById('ID').innerText = detail.off_id
    document.getElementById('Full_Name').innerText = detail.off_name
    document.getElementById('email').innerText = detail.off_email
}

