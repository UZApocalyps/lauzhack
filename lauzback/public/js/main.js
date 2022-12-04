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
    let url = 'https://localhost:9443/tickets?uid=' + uid
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
        })
        .then(response => {
            let data = response.json()
            data[0].forEach(element => {
                let div = document.createElement('div')
                div.classList.add('ticket')
                div.innerHTML = element["shopName"]
                document.querySelector('.tickets').appendChild(div)
            });
        })



}
function validateticket(ticketId) {
    //fetch post
    fetch('https://localhost:9443/registerticket', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            uid: localStorage.getItem('uid'),
            id_ticket: ticketId
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.status == 'success') {
                //remove all child from tickets
                let tickets = document.querySelector('.tickets')
                while (tickets.firstChild) {
                    tickets.removeChild(tickets.firstChild);
                }
                loadticket()
                    
            } else {
            }
        }
        )
        .catch((error) => {
            console.error('Error:', error);
        }
        );

}

