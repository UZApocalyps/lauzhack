document.addEventListener("DOMContentLoaded", function (event) {
    //load ticket data from server
    //load get parameter
    var url_string = window.location.href
    var url = new URL(url_string);
    var id = url.searchParams.get("id");
    //fetch get
    fetch('ticket?uid='+localStorage.getItem('uid')+'&ticket_id='+id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(async response => {
            response = await response.json()
            document.querySelector('#shopName').innerHTML = response["shopName"] + ' ' + response["date"]
            response["articles"].forEach(element => {
                let div = document.createElement('div')
                div.classList.add('article')
                div.innerHTML = element["name"] + ' ' + element["quantity"] + 'pce ' + element["price"] + '.-'
                document.querySelector('#articles').appendChild(div)
            })

        })
        .catch(error => {
            console.error('Error:', error);
        });



})