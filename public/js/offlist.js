const results_body = document.querySelector('#results');

    load_data();

    function load_data()
    {
        const request = new XMLHttpRequest();

        request.open(`get`, `/get_official_list`);

        let html = '';

        request.onreadystatechange = () => {
            if(request.readyState === XMLHttpRequest.DONE && request.status === 200)
            {
                const results = JSON.parse(request.responseText);

                results.forEach(result => {
                    html += `
                    <tr>
                        <td>`+result.off_id+`</td>
                        <td contenteditable onblur="update_official_data(this, 'full_name', '`+result.off_id+`')">`+result.off_name+`</td>
                        <td contenteditable onblur="update_official_data(this, 'email', '`+result.off_id+`')">`+result.off_email+`</td>
                        <td><button type="button" class="btn btn-danger btn-sm" onclick="update_official_data(`+result.off_id+`)">Edit official data</button></td>
                        <td><button type="button" class="btn btn-danger btn-sm" onclick="delete_official_data(`+result.off_id+`)">Delete Record</button></td>
                    </tr>
                    `;
                });

                // html += `
                // <tr>
                //     <td></td>
                //     <td contenteditable off_id="imm_status_data"></td>
                //     <td contenteditable off_id="type_data"></td>
                //     <td contenteditable off_id="status_data"></td>
                //     <td><button type="button" class="btn btn-success btn-sm" onclick="add_data()">Add</button></td>
                // </tr>
                // `;

                results_body.innerHTML = html;
            }
        };

        request.send();
    }


    function update_student_data(element, variable_name, id)
    {
        const param = `variable_name=`+variable_name+`&variable_value=`+element.innerText+`&off_id=`+id+``;

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

    