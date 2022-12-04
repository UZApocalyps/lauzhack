document.addEventListener("DOMContentLoaded", function (event) {
    //load ticket data from server
    //load get parameter
    var url_string = window.location.href
    var url = new URL(url_string);
    var id = url.searchParams.get("id");
    //fetch get
    fetch('https://localhost:9443/ticket', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ' ': localStorage.getItem('uid'),
            'ticket_id': id //get parameter
        },
    })
        .then(response => {

        })
        .catch(error => {
            console.error('Error:', error);
        });



})