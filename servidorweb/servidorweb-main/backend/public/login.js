const form = document.getElementById("login-form");
const btnLogout = document.getElementById("cerrar_sesion");
btnLogout.addEventListener("click", logout);

form.addEventListener("submit", handleSubmit);

let user = JSON.parse(localStorage.getItem("user"));

async function handleSubmit(event) {
    event.preventDefault(); // Previene el envío por defecto del form

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password })
    });

    //mostramos el resultado en consola
    const data = await response.json();
    console.log(data);
}


//funcion para logout
async function logout() {
    const response = await fetch('/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();
    console.log(data);
    
}
console.log("Login page loaded");


