localStorage.clear();

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
                <td><button class="btn btn-primary">Submit</button></td>
            `;
            tableBody.appendChild(row);
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

                if (res.subscribers[i].phone_number == row.find('.phoneNum').text()) {
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
                            location.reload();                          
                        })
                        .catch(err => console.error(err));

                    i = res.subscribers.length;
                }
            }
    })
        .catch(err => console.error(err));
});