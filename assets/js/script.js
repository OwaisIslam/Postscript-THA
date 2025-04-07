localStorage.clear();

var apiURL = "https://api.postscript.io/api/v2/subscribers";

class Subscribers {
    constructor(phone_number, email, created_at, tags) {
        this.phone_number = phone_number;
        this.email = email;
        this.created_at = created_at;
        this.tags = tags;
    }
}
const subsList = [];

const itemsPerPage = 5;
let currentPage = 1;
const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;
const paginatedItems = subsList.slice(startIndex, endIndex);
const pageNumbers = [];
const pageList = $(".pagination");

const prevPage = () => {
    const pageCount = Math.ceil(subsList.length / itemsPerPage);

    checkPage();
    
    if (currentPage > 1) {
        $("#prev-li")[0].classList.remove('disabled');
        currentPage--;
        updateTable();
    } else {
        $("#prev-li")[0].classList.add('disabled');
    }
}

const nextPage = () => {
    const pageCount = Math.ceil(subsList.length / itemsPerPage);

    checkPage();

    if (currentPage < pageCount) {
        currentPage++;
        updateTable();
    } else {
        $("#next-li")[0].classList.add('disabled');
    }
}

const updateTable = () => {
    const pageCount = Math.ceil(subsList.length / itemsPerPage);
    const tableBody = document.querySelector('tbody');
    tableBody.innerHTML = '';
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = subsList.slice(startIndex, endIndex);
    paginatedItems.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <th scope="row" class="phoneNum">${item.phone_number}</th>
            <td>${item.email}</td>
            <td>${moment(item.created_at).format('MM/DD/YYYY')}</td>
            <td>${item.tags.join(', ')}</td>
            <td><input type="text" class="form-control" placeholder="Add Tag"></td>
            <td><button class="btn btn-primary">Submit</button></td>
        `;
        tableBody.appendChild(row);
    });

    $('#current-page').text("On Page " + currentPage + " of " + pageCount);
}

const checkPage = () => {
    const pageCount = Math.ceil(subsList.length / itemsPerPage);
    if (currentPage == pageCount) {
        $("#next-li")[0].classList.remove('disabled');
    } else if (currentPage == 1) {
        $("#prev-li")[0].classList.remove('disabled');
    }
}

const totalPages = Math.ceil(subsList.length / itemsPerPage);

const displayData = () =>{
    const tableBody = document.querySelector('tbody');
    tableBody.innerHTML = '';
    for (let i = startIndex; i < endIndex && i < subsList.length; i++) {
        console.log("subsList: " + subsList[i]);
        const row = document.createElement('tr');
        row.innerHTML = `
            <th scope="row" class="phoneNum">${subsList[i].phone_number}</th>
            <td>${subsList[i].email}</td>
            <td>${moment(subsList[i].created_at).format('MM/DD/YYYY')}</td>
            <td>${subsList[i].tags.join(', ')}</td>
            <td><input type="text" class="form-control" placeholder="Add Tag"></td>
            <td><button class="btn btn-primary">Submit</button></td>
        `;
        tableBody.appendChild(row);
    }
}

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
        
        // Loop through the subscribers and add them to the local array
        for (let i = 0; i < numberOfSubs; i++) {
            subsList.push(new Subscribers(res.subscribers[i].phone_number, res.subscribers[i].email, res.subscribers[i].created_at, res.subscribers[i].tags));
        }

        updateTable();
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

$("a[id~='prev-page']").click(function() {
    prevPage();
    console.log("prev-page");
});

$("a[id~='next-page']").click(function() {
    nextPage();
    console.log("next-page");
});