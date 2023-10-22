const path = window.location.href.split('/')
const applicationID = path[path.length - 1]

$("#menu-toggle").click(function (e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
});
$("#menu-toggle-2").click(function (e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled-2");
    $('#menu ul').hide();
});

function initMenu() {
    $('#menu ul').hide();
    $('#menu ul').children('.current').parent().show();
    //$('#menu ul:first').show();
    $('#menu li a').click(
        function () {
            var checkElement = $(this).next();
            if ((checkElement.is('ul')) && (checkElement.is(':visible'))) {
                return false;
            }
            if ((checkElement.is('ul')) && (!checkElement.is(':visible'))) {
                $('#menu ul:visible').slideUp('normal');
                checkElement.slideDown('normal');
                return false;
            }
        }
    );
}
$(document).ready(function () {
    initMenu();
});


const createNotification = (message, type) => {
    console.log(message, type);
    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.innerText = message;
    toast.classList.add(type);
    toasts.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3000);
};


async function getApplications() {
    const response = await fetch('/get-application/' + applicationID)
    const data = await response.json()
    // console.log(data)
    // console.log(data[0].Email)
    populateTable(data)
    getApplicant(data[0].Email, data[0].Passport_ID, data[0].Email)
    getUserPassport(data[0].Passport_ID)
}
getApplications()


function populateTable(applications) {
    console.error(applications)
    const table = document.getElementById('table')
    document.getElementById('download').addEventListener('click', e => {
        downloadForm(applications[0].ID)
    })
    document.getElementById('downloadReceipt').addEventListener('click', e => {
        downloadReceipt(applications[0].ID)
    })
    document.getElementById('downloadVisa').addEventListener('click', e => {
        downloadVisa(applications[0].ID)
    })
    if (applications[0].Receipt && applications[0].Receipt.data) {
        document.getElementById('downloadReceipt').style.display = 'block'
    }
    else{
        document.getElementById('downloadReceipt').style.display = 'none'
    }
    if (applications[0].visa && applications[0].visa.data) {
        document.getElementById('downloadVisa').style.display = 'block'
    }
    else{
        document.getElementById('downloadVisa').style.display = 'none'
    }
    for (let index = 0; index < applications.length; index++) {
        const application = applications[index];
        const row = document.createElement('tr')
        const application_id = document.createElement('td')
        const applicant_email = document.createElement('td')
        const application_visa_type = document.createElement('td')
        const applicant_destionation = document.createElement('td')
        const application_status = document.createElement('td')
        const application_edit = document.createElement('td')
        //   const application_action = document.createElement('td')
        //   const viewMore = document.createElement('a')
        application_id.innerText = application.ID
        applicant_email.innerText = application.Email
        applicant_email.id = 'email'
        application_visa_type.innerText = application.Visa_type
        application_visa_type.id = 'visa_type'
        applicant_destionation.innerText = application.Country_Name
        applicant_destionation.id = 'destination'
        application_status.innerText = application.Status
        application_edit.innerText = application.Edit

        // document.getElementById('download').


        // const downloadCell = document.createElement('td')
        // const downloadButton = document.createElement('button')
        // downloadButton.setAttribute('class','button')
        // downloadButton.setAttribute('id','download')
        // downloadButton.addEventListener('click',e=>{
        //     downloadForm(application.ID)
        // })
        // const textDownloadButton = document.createTextNode('Download')
        // downloadButton.appendChild(textDownloadButton)
        // downloadCell.appendChild(downloadButton)

        row.appendChild(application_id)
        row.appendChild(applicant_email)
        row.appendChild(applicant_destionation)
        row.appendChild(application_visa_type)
        row.appendChild(application_status)
        row.appendChild(application_edit)
        table.appendChild(row)
    }
}

function populateApplicant(applicant, passport, email) {

    console.log(applicant)
    const table = document.getElementById('table2')

    const row = document.createElement('tr')
    const name = document.createElement('td')
    let nameText = document.createTextNode(applicant.Name)
    name.appendChild(nameText)

    let imgTD = document.createElement('td')
    let img = document.createElement('img')
    img.src = '/passport-image/' + passport
    img.classList = 'passport-photo'
    imgTD.appendChild(img)


    let idTD = document.createElement('td')
    let imgID = document.createElement('img')
    imgID.src = '/user_id/' + email
    imgID.classList = 'passport-photo'
    idTD.appendChild(imgID)

    let phone = document.createElement('td')
    let phoneText = document.createTextNode(applicant.Phone)
    phone.appendChild(phoneText)


    row.appendChild(name)
    row.appendChild(imgTD)
    row.appendChild(idTD)
    row.appendChild(phone)
    table.appendChild(row)

}


async function getApplicant(email, passport, email) {
    // console.log(email)
    const response = await fetch(`/get-applicant/${email}`)
    const data = await response.json()
    // console.log(data)
    populateApplicant(data[0], passport, email)
}


async function getUserPassport(passportID) {
    const response = await fetch('/get-applicant-passport?passportID=' + passportID)
    const data = await response.json()
    // console.log(data)
    populateForm(data)
}

function populateForm(passport) {
    document.getElementById('passport_id').value = passport[0].Passport_ID
    document.getElementById('date_of_issue').value = passport[0].Date_of_Issue.slice(0, 10)
    document.getElementById('date_of_expiry').value = passport[0].Date_of_Expiry.slice(0, 10)
    document.getElementById('country-select').value = passport[0].Country_Name
    document.getElementById('passport_type').value = passport[0].Type
}


async function downloadForm(formId) {

    try {
        const response = await fetch(`/get-form-application/${formId}`);
        if (!response.ok) {
            const errorData = await response.json();
            createNotification(errorData.message, 'error');
            return;
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        // Create an anchor element and trigger a download
        const a = document.createElement('a');
        a.href = url;
        a.download = response.headers.get('Content-Disposition').split('=')[1].replace(/"/g, ''); // Extract the filename from the Content-Disposition header
        a.click();

        // Clean up the URL and the anchor element
        URL.revokeObjectURL(url);
        a.remove();
    } catch (error) {
        console.error('Error downloading form:', error);
    }
}


document.getElementById('requestEditFrom').addEventListener('submit', e => {
    e.preventDefault();
    const edit = document.getElementById('edit').value
    console.log(edit)
    requestEdit(edit)
})

async function requestEdit(edit) {
    const response = await fetch('/request-edit', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            edit: edit,
            applicationID: applicationID,
            email: document.getElementById('email').innerText
        })
    })
    const data = await response.json()
    console.log(data)
    if (response.status === 200) {
        createNotification(data.message, 'success')
    }
    else {
        createNotification(data.message, 'error')
    }
}

document.getElementById('changeStatusForm').addEventListener('submit', e => {
    e.preventDefault();
    const status = document.getElementById('status').value
    changeStatus(status)
})

async function changeStatus(status) {
    const response = await fetch('/change-status', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            status: status,
            applicationID: applicationID,
            email: document.getElementById('email').innerText,
            destination: document.getElementById('destination').innerText,
            visa_type: document.getElementById('visa_type').innerText
        })
    })
    const data = await response.json()
    console.log(data)
    if (response.status === 200) {
        createNotification(data.message, 'success')
    }
    else {
        createNotification(data.message, 'error')
    }
}


async function downloadReceipt(applicationID) {

    try {
        const response = await fetch(`/get-receipt/${applicationID}`);
        if (!response.ok) {
            const errorData = await response.json();
            createNotification(errorData.message, 'error');
            return;
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        // Create an anchor element and trigger a download
        const a = document.createElement('a');
        a.href = url;
        a.download = response.headers.get('Content-Disposition').split('=')[1].replace(/"/g, ''); // Extract the filename from the Content-Disposition header
        a.click();

        // Clean up the URL and the anchor element
        URL.revokeObjectURL(url);
        a.remove();
    } catch (error) {
        console.error('Error downloading form:', error);
    }
}

async function downloadVisa(applicationID) {

    try {
        const response = await fetch(`/get-visa/${applicationID}`);
        if (!response.ok) {
            const errorData = await response.json();
            createNotification(errorData.message, 'error');
            return;
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        // Create an anchor element and trigger a download
        const a = document.createElement('a');
        a.href = url;
        a.download = response.headers.get('Content-Disposition').split('=')[1].replace(/"/g, ''); // Extract the filename from the Content-Disposition header
        a.click();

        // Clean up the URL and the anchor element
        URL.revokeObjectURL(url);
        a.remove();
    } catch (error) {
        console.error('Error downloading form:', error);
    }
}


document.getElementById('uploadVisaForm').addEventListener('submit',e=>{
    e.preventDefault();
    const visa = document.getElementById('visa_file').files[0]
    uploadVisa(visa)
})

async function uploadVisa(visa){
    const formData = new FormData()
    formData.append('visa',visa)
    formData.append('applicationID',applicationID)
    const response = await fetch('/upload-visa/'+applicationID,{
        method:'PUT',
        body:formData
    })
    const data = await response.json()
    console.log(data)
    if(response.status === 200){
        createNotification(data.message,'success')
    }
    else{
        createNotification(data.message,'error')
    }
}