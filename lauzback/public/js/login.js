document.addEventListener("DOMContentLoaded", function (event) {
    let username = document.querySelector('#username')
    let password = document.querySelector('#password')
    document.querySelector("#login").addEventListener("click", function () {
        if(username.value=="code_lyoko"||(username.value == "pipo" && password.value == "pluto")){
            if(username.value=="code_lyoko"){
                localStorage.setItem('uid', "code_lyoko")
            }
            else{
                localStorage.setItem('uid', 'test@test.com')
            }
            window.location.href = "home"

        }
        else{
            
            alert('wrong credentials')
        }
    })
})