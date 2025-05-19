

document.getElementById('registrar').addEventListener('submit', registrar);

async function registrar(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/usuario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, email, password })
    });

    const data = await response.json();

    if (data) {
        console.log(data);
        window.location.href = './login.html';
    } else {
        alert('Usuario registrado');
        window.location.href = './login.html';
    }
}

