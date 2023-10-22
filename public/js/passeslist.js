const results_body = document.querySelector('#results');

    load_data();


    function load_data()
    {
        const request = new XMLHttpRequest();

        request.open(`get`, `/get_pass_data`);

        let html = '';

        request.onreadystatechange = () => {
            if(request.readyState === XMLHttpRequest.DONE && request.status === 200)
            {
                const results = JSON.parse(request.responseText);

                results.forEach(result => {
        
                    html += `
                    <tr>
                        <td>`+result.id_number+`</td>
                        <td contenteditable onblur="update_pass_data(this, 'pass_number', '`+result.id_number+`')">`+result.pass_number+`</td>
                        <td contenteditable onblur="update_pass_data(this, 'exp_date', '`+result.id_number+`')">`+result.exp_date+`</td>
                        <td><button type="button" class="btn btn-danger btn-sm" onclick="delete_data(`+result.id_number+`)">Delete Record</button></td>
                    </tr>
                    `;
                });

                results_body.innerHTML = html;
            }
        };

        request.send();
    }


    function update_pass_data(element, variable_name, id)
    {
        
        const param = `variable_name=`+variable_name+`&variable_value=`+element.innerText+`&id_number=`+id+``;

        const request = new XMLHttpRequest();

        request.open(`POST`, `/update_pass_data`, true);

        //Send the proper header information along with the request
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        request.onreadystatechange = () => {

            if(request.readyState === XMLHttpRequest.DONE && request.status === 200)
            {

                alert('Status Updated');

            }

        };

        request.send(param);
    }
    function delete_data(id)
    {
        if(confirm("Are you sure you want to remove it?"))
        {
            const param = `id=`+id+``;

            const request = new XMLHttpRequest();

            request.open('POST', `/delete_data`, true);

            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

            request.onreadystatechange = () => {

                if(request.readyState === XMLHttpRequest.DONE && request.status === 200)
                {
                    alert('Data Deleted');

                    load_data();
                }

            };

            request.send(param);
        }
    }

    