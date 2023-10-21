
document.getElementById("login-form").addEventListener("submit",async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior.
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;


    
    fetch("http://127.0.0.1:3000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
                if(data){
                    window.location.href = "/dashboard.html"
                }

    })
    .catch((error) => {
        console.error("Login error: " + error.message);
        alert("Login failed. Please try again later.");
    });
});