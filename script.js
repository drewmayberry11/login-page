document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form from submitting

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let errorMessage = document.getElementById("error-message");

    if (username === "admin" && password === "password123") {
        alert("Login successful!");
    } else {
        errorMessage.textContent = "Invalid username or password!";
    }
});
