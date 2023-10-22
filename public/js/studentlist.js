const results_body = document.querySelector('#results');

    load_data();

    function load_data()
    {
        const request = new XMLHttpRequest();

        request.open(`get`, `/get_student_list`);

        let html = '';

        request.onreadystatechange = () => {
            if(request.readyState === XMLHttpRequest.DONE && request.status === 200)
            {
                const results = JSON.parse(request.responseText);

                results.forEach(result => {
                    html += `
                    <tr>
                        <td>`+result.id_number+`</td>
                        <td contenteditable onblur="update_student_data(this, 'full_name', '`+result.id_number+`')">`+result.full_name+`</td>
                        <td contenteditable onblur="update_student_data(this, 'email', '`+result.id_number+`')">`+result.email+`</td>
                        <td><button type="button" class="btn btn-danger btn-sm" onclick="update_student_data(`+result.id_number+`)">Edit Student data</button></td>
                        <td><button type="button" class="btn btn-danger btn-sm" onclick="delete_student_data(`+result.id_number+`)">Delete Record</button></td>
                    </tr>
                    `;
                });

                html += `
                <tr>
                    <td></td>
                    <td contenteditable id_number="imm_status_data"></td>
                    <td contenteditable id_number="type_data"></td>
                    <td contenteditable id_number="status_data"></td>
                    <td><button type="button" class="btn btn-success btn-sm" onclick="add_data()">Add</button></td>
                </tr>
                `;

                results_body.innerHTML = html;
            }
        };

        request.send();
    }


    function update_student_data(element, variable_name, id)
    {
        const param = `variable_name=`+variable_name+`&variable_value=`+element.innerText+`&id_number=`+id+``;

        const request = new XMLHttpRequest();

        request.open(`POST`, `/update_student_data`, true);

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
    function delete_student_data(id)
    {
        if(confirm("Are you sure you want to remove it?"))
        {
            const param = `id=`+id+``;

            const request = new XMLHttpRequest();

            request.open('POST', `/delete_student_data`, true);

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

    