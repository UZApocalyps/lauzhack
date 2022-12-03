document.addEventListener("DOMContentLoaded", () => {
    init();
});


const init = () => {
    const sendDestination = "http://192.168.195.92:9000/test";

    const qrCodeTarget = document.getElementById("qrCodeTarget");

    const currentId = undefined;
    const showQrCodeButton = document.getElementById("showQrCode");
    const articleContainer = document.querySelector(".items");
    const outLogContainer = document.querySelector(".outLog");
    const inLogContainer = document.querySelector(".inLog");
    const shopNameInput = document.querySelector("#shopName");
    const sendButton = document.querySelector("#sendButton");

    const articles = [
        {
            name: "Bread",
            quantity: 1,
            price: 1.5,
        },
        {
            name: "Water",
            quantity: 1,
            price: 1.5,
        },
        {
            name: "Coconut",
            quantity: 1,
            price: 1.5,
        },
        {
            name: "Milk",
            quantity: 1,
            price: 2.5,
        },
        {
            name: "Eggs",
            quantity: 1,
            price: 3.5,
        }
    ];

    const formatNumberAfterComma = (nbr, digits) => {
        let stringNbr = nbr.toString();
        let aftrComma = stringNbr.split(".")[1];
        if (aftrComma.length < digits) {
            for (let i = aftrComma.length; i < digits; i++) {
                stringNbr += "0";
            }
        }
        return stringNbr;
    }

    const generateArticles  = () => {
        const thead = articleContainer.querySelector("thead");
        const tbody = articleContainer.querySelector("tbody");
        thead.innerHTML = "";
        tbody.innerHTML = "";
        const generateHeadRow = () => {
            const headRow = document.createElement("tr");
            headRow.classList.add("item","head");
            const number = document.createElement("th");
            number.innerText = "#";
            const name = document.createElement("th");
            name.innerText = "Name";
            const quantity = document.createElement("th");
            quantity.innerText = "Quantity";
            const price = document.createElement("th");
            price.innerText = "Price";
            headRow.appendChild(name);
            headRow.appendChild(price);
            headRow.appendChild(quantity);
            thead.appendChild(headRow);
        }
        generateHeadRow();
        for(let i = 0; i < articles.length; i++) {
            const current = articles[i];
            const item = document.createElement("tr");
            item.classList.add("item");
            const number = document.createElement("th");
            number.innerText = i + 1;
            const nameContainer = document.createElement("td");
            nameContainer.classList.add("name");
            nameContainer.innerText = current.name;
            const priceContainer = document.createElement("td");
            priceContainer.classList.add("price");
            priceContainer.innerText = formatNumberAfterComma(current.price, 2);
            const quantityContainer = document.createElement("td");
            quantityContainer.classList.add("quantity");
            quantityContainer.innerText = current.quantity;
            item.appendChild(nameContainer);
            item.appendChild(priceContainer);
            item.appendChild(quantityContainer);
            tbody.appendChild(item);
        }
        
    }

    let qrCode = undefined;

    const showQrCode = () => {
        if(currentId === undefined) {
            alert("Please send the shopping list first");
            return;
        }
        if(qrCode === undefined)
        {
            qrCode = new QRCode(qrCodeTarget, currentId);
        } else {
            qrCode.clear();
            qrCode.makeCode(currentId);
        }
        
    } 

    const sendList = () => {
        const data = {};
        if(shopNameInput.value === "") {
            shopNameInput.value = "Lidle";
        }
        data.shopName = shopNameInput.value;
        data.articles = [];
        const children = articleContainer.querySelector("tbody").children;
        for(let i = 0; i < children.length; i++) {
            const current = children[i];
            const item = {
                name: current.querySelector(".name").innerText,
                quantity: Number(current.querySelector(".quantity").innerText),
                price: Number(current.querySelector(".price").innerText),
            }
            data.articles.push(item);
        }
        outLogContainer.textContent = JSON.stringify(data, undefined, 2);

        fetch(sendDestination, {
            method: "POST",
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify(data, undefined, 3)
        }).then(res => {
            showQrCodeButton.style.display = null;
            res.json().then((res) => {
                inLogContainer.textContent = JSON.stringify(res, undefined, 2);
            }, (err) => {
                console.error(err);
            });
        });
    }

    generateArticles();
    sendButton.addEventListener("click", sendList);
}