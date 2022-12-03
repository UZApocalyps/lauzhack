let button;
let input;
let result;
let qrCode = undefined;
const createQrCode = (data) => {
    console.log("Starting QrCode generation with ", data);
    if(qrCode !== undefined) {
        qrCode.clear();
        qrCode.makeCode(data);
    } else {
        qrCode = new QRCode(document.getElementById("result"), data);
    }
}


document.addEventListener("DOMContentLoaded", () => {
    input = document.querySelector("#qrcodeData");
    button = document.querySelector("#createQrCode");
    result = document.getElementById("result");
    button.addEventListener("click", () => {
        console.log("Generating QR code with data : ", input.value);
        createQrCode(input.value);
    });
});