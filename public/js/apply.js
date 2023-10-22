var id;
var student_name;
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

async function getStudentInfo() {
    const url = '/get-session-user'
    const response = await fetch(url, { method: 'GET' })
    const data = await response.json()
    console.log(data);
    // getStudentPasses(data.id_number)
    populateDetails(data)
}

getStudentInfo()

function populateDetails(detail) {
    id = detail.id_number
    student_name = detail.full_name
}

async function applyPass(){
    const url = '/apply-pass'
    const formData = new FormData();
    
    // Get the file input element
    // const fileInput = document.getElementById("fileInput");
    // const file = fileInput.files[0]; // Get the first selected file (ZIP file)

    formData.append('id_number',id)
    formData.append('full_name',student_name)
    formData.append('imm_status',document.getElementById("imm_status").value)
    formData.append('type',document.getElementById("type").value)
    
    console.log(document.getElementById("police_clearance").files[0])

    formData.append("file", document.getElementById("police_clearance").files[0]);
    formData.append("file", document.getElementById("biodata").files[0]);
    formData.append("file", document.getElementById("id_photo").files[0]);
    // const data = {
    //     id_number: id,
    //     full_name: student_name,
    //     imm_status: document.getElementById("imm_status").value,
    //     type: document.getElementById("type").value,
    // }


    // Create a FormData object to send both JSON data and the file to the server
    // formData.append("data", JSON.stringify(data));

    const options = {
        method: "POST",
        // headers:{
        //     'Content-Type': 'application/json'
        // },
        body: formData,
    };
    

    const response = await fetch(url, options);
    const outcome = await response.json();
    if (response.status === 401)
        display(outcome.message)
    if (response.status === 200)
        display("Application added")
}

document.getElementById('Application').addEventListener('submit', e => {
    e.preventDefault()
    console.log("Applying")
    applyPass()
})
