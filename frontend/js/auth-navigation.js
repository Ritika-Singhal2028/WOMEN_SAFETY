document.addEventListener("DOMContentLoaded", function () {

    // LOGIN FORM → INDEX
const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();

            // yaha future me validation/auth laga sakti ho
            window.location.href = "index.html";
        });
    }
    document.querySelector("button").addEventListener("click", loginUser);
    function loginUser(){
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
        alert("Login successful");

        // user id save karo (IMPORTANT)
        localStorage.setItem("uid", userCredential.user.uid);

        window.location.href = "index.html";
    })
    .catch(err => {
        alert("Login failed: " + err.message);
    });
}


    // SIGNUP FORM → LOGIN
    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
        signupForm.addEventListener("submit", function (e) {
            e.preventDefault();
            alert("Signup successful! Now login.");
            window.location.href = "login.html";
        });
    }

    // PROFILE ICON → LOGIN PAGE
    const profileIcon = document.querySelector(".profile");
    if (profileIcon) {
        profileIcon.addEventListener("click", function () {

            const user = auth.currentUser;

            if (user) {
                // user logged in hai → profile pe jao
                window.location.href = "profile.html";
            } else {
                // user logged in nahi hai → login page
                window.location.href = "login.html";
            }
        });
    }

    // HOME ICON → INDEX PAGE
    const homeIcon = document.querySelector(".home-icon");
    if (homeIcon) {
        homeIcon.addEventListener("click", function () {
            window.location.href = "index.html";
        });
    }

    // ✅ SAFETY TIPS BUTTON → tips.html
    const tipsBtn = document.querySelector(".feature-card:nth-child(3)");
    if (tipsBtn) {
        tipsBtn.addEventListener("click", function () {
            window.location.href = "tips.html";
        });
    }

});