async function addPass(){
    const url = '/add-pass'
    const data = {
        id_number: document.getElementById("id_number").value,
        pass_number: document.getElementById("pass_number").value,
        exp_date: document.getElementById("exp_date").value,
    }
    

    const options = {
        method: "POST",
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    };
    

    const response = await fetch(url, options);
    const outcome = await response.json();
    if (response.status === 401)
        console.log("err")
    if (response.status === 200)
        console.log("Pass added")
}

document.getElementById('AddPass').addEventListener('submit', e => {
    e.preventDefault()
    console.log("Adding pass")
    addPass()
})
