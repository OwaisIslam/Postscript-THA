localStorage.clear();

let correctRow = false;

var apiURL = "https://api.postscript.io/api/v2/subscribers";

const getOptions = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer sk_6cd914fbb2c682a0626e85de06faed40'
    }
};

fetch(apiURL, getOptions)
    .then(res => res.json())
    .then(function(res) {
        let numberOfSubs = res.subscribers.length;
        const tableBody = document.querySelector('tbody');

        // Loop through the subscribers and log their details
        for (let i = 0; i < numberOfSubs; i++) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <th scope="row" class="phoneNum">${res.subscribers[i].phone_number}</th>
                <td>${res.subscribers[i].email}</td>
                <td>${moment(res.subscribers[i].created_at).format('MM/DD/YYYY')}</td>
                <td>${res.subscribers[i].tags.join(', ')}</td>
                <td><input type="text" class="form-control" placeholder="Add Tag"></td>
                <td><button class="btn btn-primary">Add Tag</button></td>
            `;
            tableBody.appendChild(row);
        }
        
        // Set the id of the table body and each row
        tableBody.id = "subsTable";
        var rows = document.getElementById("subsTable").rows;
        for (let i = 0; i < rows.length; i++){
            rows[i].id = "addTagText" + (i+1);
        }
    })


// Add event listener to the button to handle click event
$(document).on('click', 'button', function() {

    let row = $(this).closest('tr');
    let input = row.find('input[type="text"]');
    let tag = input.val();
    let subID = "";

    fetch(apiURL, getOptions)
        .then(res => res.json())
        .then(function(res) {
            for (let i = 0; i < res.subscribers.length; i++) {
                console.log("in for");
                if (res.subscribers[i].phone_number == row.find('.phoneNum').text()) {
                    console.log("in if");
                    // Add the tag to the subscriber
                    res.subscribers[i].tags.push(tag);

                    subID = res.subscribers[i].id;

                    const patchOptions = {
                        method: 'PATCH',
                        headers: {
                            accept: 'application/json',
                            'content-type': 'application/json',
                            Authorization: 'Bearer sk_6cd914fbb2c682a0626e85de06faed40'
                        },
                        body: JSON.stringify({
                            properties: {
                                key: 'value'},
                                tags: [tag]
                            })
                    };

                    fetch(apiURL + "/" + subID, patchOptions)
                        .then(res => res.json())
                        .then(function(res) {
                            correctRow = true;
                            console.log("correctRow in fetch: " + correctRow);
                            if (correctRow) {
                                alert("Tag added successfully!");
                            } else {
                                alert("Tag was not added as corresponding 'Add Tag' button in the row must be clicked!");
                            }
                            //location.reload();                          
                        })
                        .catch(err => console.error(err));

                    i = res.subscribers.length;
                }
            }
        })
        .catch(err => console.error(err));

        console.log("final correctRow: " + correctRow);
});