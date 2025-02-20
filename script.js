document.getElementById("userForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent form submission

    let isValid = true;

    // Get values
    let name = document.getElementById("name").value.trim();
    let instaId = document.getElementById("instaId").value.trim();
    let phone = document.getElementById("phone").value.trim();

    // Name validation (only letters and spaces, at least 2 characters)
    if (!/^[A-Za-z\s]{2,}$/.test(name)) {
        alert("Invalid name (Only letters, min 2 characters)");
        isValid = false;
    }

    // Instagram ID validation (must start with '@', min 3 characters)
    if (!/[\w]{2,}$/.test(instaId)) {
        alert("Invalid Instagram ID (Must start with '@', min 3 characters)");
        isValid = false;
    }

    // Phone number validation (must be 10 digits)
    if (!/^\d{10}$/.test(phone)) {
        alert("Invalid phone number (Must be exactly 10 digits)");
        isValid = false;
    }

    if (isValid) {
        let confirmation = confirm("Double check your details! You will not be able to edit them later.\nClick OK to continue to spin!");
        if (confirmation) {
            document.querySelector(".wheel-container").style.display = "block";
            document.querySelector(".register").style.display = "none";
            document.getElementById("downloadExcel").style.display = "block"; // Show Download button
        }
    }
});

// SPIN LOGIC
document.getElementById("spinButton").addEventListener("click", async function(event) {
    event.preventDefault();

    const wheel = document.getElementById("wheel");

    let randomDegree = Math.floor(1800 + Math.random() * 1800); // Random spin
    wheel.style.transition = "transform 4s ease-out";
    wheel.style.transform = `rotate(${randomDegree}deg)`;

    setTimeout(async () => {
        let finalDegree = randomDegree % 360;
        let section = Math.floor(finalDegree / (360 / 6)); // 6 sections

        const results = [
            "You're passionate, charming, and full of love! Just like a strawberry, you bring sweetness wherever you go.",
            "You're kind, warm, and always there to comfort others. Fluffy and sweet, your heart is as soft as a marshmallow!",
            "You're playful, energetic, and always up for a good laugh. Just like a banana, you keep things light and delightful!",
            "You're cool, collected, and effortlessly stylish. Crisp on the outside but full of layers, just like a wafer!",
            "You're caring, affectionate, and deeply lovable. Like Little Hearts, you spread joy with every moment!",
            "You're truly irreplaceable! Perhaps the next moment will unveil your perfect match, but for now, embrace your one-of-a-kind brilliance!"
        ];

        let spinResult = results[section];

        document.getElementById("resultText").innerText = `${spinResult}\n`;
        document.getElementById("popup").style.display = "block";
        document.getElementById("spinButton").disabled = true;

        const name = document.getElementById("name").value;
        const instaId = document.getElementById("instaId").value;
        const phone = document.getElementById("phone").value;

        const userData = { name, instaId, phone, spinResult };

        try {
            const response = await fetch("https://lucky-spin-1.onrender.com/saveUser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData)
            });

            const result = await response.json();
            console.log("Server response:", result);

        } catch (error) {
            console.error("Error saving user data:", error);
            alert("Failed to save data.");
        }

    }, 4000);
});

// CLOSE POPUP
function closePopup() {
    document.getElementById("popup").style.display = "none";
}

// DOWNLOAD EXCEL
// document.getElementById("downloadExcel").addEventListener("click", async function() {
//     try {
//         const response = await fetch("https://lucky-spin-1.onrender.com/convertToExcel");

//         if (!response.ok) {
//             throw new Error("Failed to download Excel file.");
//         }

//         const blob = await response.blob();
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement("a");
//         a.href = url;
//         a.download = "userdata.xlsx";
//         document.body.appendChild(a);
//         a.click();
//         document.body.removeChild(a);
//     } catch (error) {
//         console.error("Error downloading Excel file:", error);
//         alert("Failed to download Excel file.");
//     }
// });
