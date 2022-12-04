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

    //Easter egg :D
    document.querySelector('.logo').addEventListener('click', function () {
        if (localStorage.getItem('uid') == "code_lyoko") {
            let audio = document.querySelector("#audio")
            audio.play()
        }
    })

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
    let url = 'https://192.168.195.9:9443/tickets?uid=' + uid
    //XMLHttpRequest
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        if (xhr.status == 200) {
            let data = JSON.parse(xhr.responseText)
        }
        else {
            alert('error')
        }
    }
    xhr.headers = {
        'Content-Type': 'application/json',
        'Cors': 'no-cors',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
        
    }
    //cors
    xhr.body = ""
    xhr.send();


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

