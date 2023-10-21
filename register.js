document.getElementById("register-form").addEventListener("submit",async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior.
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;


    
    fetch("http://127.0.0.1:3000/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
            
        window.location.href = "/dashboard.html"

    })
    .catch((error) => {
        console.error("Registration error: " + error.message);
        alert("Registration failed. Please try again later.");
    });
});