//document ready
document.addEventListener("DOMContentLoaded", function (event) {

    document.querySelector('.btn').addEventListener('click', async () => {
        print('clicked')
        var constraints = {
            video: true,
            audio: false
        }
        navigator.mediaDevices.getUserMedia(constraints).then(function success(stream) {
            print('success')
            /* do stuff */
        }).catch(function(err) {
            //log to console first 
            console.log(err); /* handle the error */
            if (err.name == "NotFoundError" || err.name == "DevicesNotFoundError") {
                //required track is missing 
                print('no camera found');
            } else if (err.name == "NotReadableError" || err.name == "TrackStartError") {
                //webcam or mic are already in use 
                print('camera in use');
            } else if (err.name == "OverconstrainedError" || err.name == "ConstraintNotSatisfiedError") {
                //constraints can not be satisfied by avb. devices 
                print('no camera found');
            } else if (err.name == "NotAllowedError" || err.name == "PermissionDeniedError") {
                //permission denied in browser 
                print('permission denied');
            } else if (err.name == "TypeError" || err.name == "TypeError") {
                //empty constraints object 
                print('empty constraints');
            } else {
                //other errors 
                print('other errors');
            }
        });
    })
})

function print(a){
    document.querySelector('.log').innerHTML += a + '<br>';
}