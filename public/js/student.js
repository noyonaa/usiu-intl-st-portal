// var userID ;

// console.log("HERE")
var id;
async function getStudentInfo() {
    const url = '/get-session-user'
    const response = await fetch(url, { method: 'GET' })
    const data = await response.json()
    console.log(data);
    populateDetails(data)
    console.log("Received student details: "+ data)
}

getStudentInfo()


function populateDetails(detail) {
    id = detail.id_number
    document.getElementById('ID').innerText = detail.id_number
    document.getElementById('Full_Name').innerText = detail.full_name
    document.getElementById('email').innerText = detail.email
    getPassStatus(id)
}

  
async function getPassStatus(idno) {
  const response = await fetch(`/get-student-pass?id=${idno}`)
  const data = await response.json()
  populatePassInfo(data)
}

function populatePassInfo(data1) {
  console.log(data1)
  const passStatusElement = document.getElementById('PassStatus');
  passStatusElement.innerText = data1.status || '';
  console.log(passStatusElement.innerText)
}

// function populatePassInfo(data1) {
//     document.getElementById('PassStatus').innerText = data1[0].status
//     console.log("here: "+ document.getElementById('PassStatus').innerText)
//     console.log(document.getElementById('PassStatus').innerText)
//   }
// async function getStudentPasses(id){
//     const response = await fetch(`/get-student-pass?id=${id}`)
//     const data = await response.json()
//     populatePassInfo(data)
//     makeGraph(data)
// }

// function populatePassInfo(passes){
//     let cards = document.getElementById('cards')

//     for (let i = 0; i < passes.length; i++) {
//         const element = passes[i];
//         let p1 = document.createElement('p')
//         p1.classList = 'mb-1'
//         p1.style.fontSize = '0.77rem'
//         p1.innerText = element.Name
//         let p2 = document.createElement('p')
//         p2.classList = 'mb-1'
//         p2.innerText = `${element.pass_number}`
//         let p3 = document.createElement('p')
//         p3.classList = 'txt'
//         p3.innerHTML = `${element.pass_number} ${element.exp_date}`
//         cards.appendChild(p1)
//         cards.appendChild(p2)
//         cards.appendChild(p3)
//     }
// }

