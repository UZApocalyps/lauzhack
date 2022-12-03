var temp = `{
    "id": 4,
    "user_id": 45,
    "shop_id": 1,
    "date": "2020-05-01T00:00:00.000Z",
    "articles": [
        {
            "name": "potatoes",
            "prices": 1.45,
            "quantity": 2
        },
        {
            "name": "tomatoes",
            "prices": 2.45,
            "quantity": 3
        },
        {
            "name": "cucumbers",
            "prices": 3.45,
            "quantity": 4
        }
    ]
}`

document.addEventListener("DOMContentLoaded", function (event) {
    loadticket()
    var qrScanner = null;
    document.querySelector("#close-popup").addEventListener("click", function () {
        document.querySelector(".popup").style.display = "none";
        if (qrScanner != null) {
            qrScanner.stop()
            qrScanner.destroy()
        }
    })
    document.querySelector('#scan').addEventListener('click', function () {
        document.querySelector('.popup').style.display = 'flex';
        import('./qr-scanner.min.js').then((module) => {
            const QrScanner = module.default;
            // do something with QrScanner
            qrScanner = new QrScanner(
                document.querySelector('#video'),
                result => {
                    console.log('decoded qr code:', result.data)
                    qrScanner.stop();
                    qrScanner.destroy();
                    alert("Ticket Scanned")
                    validateticket(result.data)
                    document.querySelector('.popup').style.display = 'none';

                    /* your options or returnDetailedScanResult: true if you're not specifying any other options */
                },
                {
                    highlightScanRegion: true,
                    highlightCodeOutline: true,
                }
            );

            qrScanner.start();

        });
    });

})
function loadticket() {
    //get uid from localstorage
    let uid = localStorage.getItem('uid')
    //fetch get
    fetch('https://localhost:3000/tickets', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'uid': uid
        },
    })
        .then(response => {
            let data = response.json()
            data.forEach(element => {
                let div = document.createElement('div')
                div.classList.add('ticket')
                div.innerHTML = element.id_Ticket
                div.addEventListener('click', function () {
                    //move to ticket page
                    window.location.href = 'ticket.html?id=' + element.id_Ticket
                })
                document.querySelector('.tickets').appendChild(div)
            });
        })

}
function validateticket(ticketId) {
    //fetch post
    fetch('https://localhost:3000/registerticket', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            uid: 32,
            id_ticket: ticketId
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.status == 'success') {
                alert('Ticket Validated')
            } else {
                alert('Ticket Invalid')
            }
        }
        )
        .catch((error) => {
            console.error('Error:', error);
        }
        );

}

