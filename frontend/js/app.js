document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       🌙 GLOBAL DARK MODE STYLES
    ========================= */

    function applyDarkModeStyles() {

    // ❌ Skip dark mode for login/signup pages
    if (document.body.classList.contains("no-dark")) {
        return;
    }

    const style = document.createElement("style");

    style.innerHTML = `

        /* 🌙 BACKGROUND BLACK */
        body.dark {
            background: #0d0d0d !important;
            color: white;
        }

        /* 🔵 DEFAULT ICONS */
        body.dark i {
            color: #4da3ff !important;
        }

        /* ⚪ FAKE CALL PAGE ICONS WHITE */
        body.dark.fake-call-page i {
            color: white !important;
        }

        /* UI ELEMENTS */ 
        body.dark .topbar {
            background: #111 !important;
        }

        body.dark .profile-card {
            background: #1a1a1a !important;
        }

        body.dark input,
        body.dark textarea {
            background: #111 !important;
            color: white !important;
            border-color: #333 !important;
        }

        body.dark.fake-call-page {
            background: linear-gradient(180deg, #0a1f44, #001a33) !important;
        }

    `;

        document.head.appendChild(style);
    }

        applyDarkModeStyles();

    /* =========================
       🌙 DARK MODE TOGGLE
    ========================= */

    const toggle = document.getElementById("toggleTheme");
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        if (toggle) toggle.checked = true;
    } else {
        document.body.classList.remove("dark");
        if (toggle) toggle.checked = false;
    }

    if (toggle) {
        toggle.addEventListener("change", function () {
            if (this.checked) {
                document.body.classList.add("dark");
                localStorage.setItem("theme", "dark");
            } else {
                document.body.classList.remove("dark");
                localStorage.setItem("theme", "light");
            }
        });
    }


    /* =========================
       🗺️ MAP (IF PRESENT)
    ========================= */

    const mapContainer = document.getElementById("map");

    if (mapContainer) {

        var map = L.map('map').setView([0, 0], 13);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(map);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {

                var lat = position.coords.latitude;
                var lon = position.coords.longitude;
                window.appLocation = { lat: lat, lon: lon };
                window.appMap = map;

                map.setView([lat, lon], 15);

                L.marker([lat, lon]).addTo(map)
                    .bindPopup("Your Current Location 📍")
                    .openPopup();

            }, function () {
                alert("Location access denied");
            });
        }
    }


    /* =========================
       🔘 NAVIGATION
    ========================= */

    const fakeCallBtn = document.getElementById("fakeCallBtn");
    if (fakeCallBtn) {
        fakeCallBtn.addEventListener("click", function () {
            window.location.href = "fakeCall.html";
        });
    }

    const tipsBtn = document.querySelector(".feature-card:nth-child(3)");
    if (tipsBtn) {
        tipsBtn.addEventListener("click", function () {
            window.location.href = "tips.html";
        });
    }

    const profileIcon = document.querySelector(".profile");
    if (profileIcon) {
        profileIcon.addEventListener("click", function () {
            window.location.href = "profile.html";
        });
    }

    const homeIcon = document.querySelector(".home-icon");
    if (homeIcon) {
        homeIcon.addEventListener("click", function () {
            window.location.href = "index.html";
        });
    }

    // EMERGENCY CONTACTS BUTTON
    const emergencyContactsBtn = document.getElementById("emergencyContactsBtn");

    if(emergencyContactsBtn){
        emergencyContactsBtn.addEventListener("click", function(){
            window.location.href = "emergencyContacts.html";
        });
    }

    // SHARE LOCATION BUTTON
    const shareLocationBtn = document.getElementById("shareLocationBtn");
    if(shareLocationBtn){
        shareLocationBtn.addEventListener("click", function(){
            window.location.href = "shareLocation.html";
        });
    }

    // NEARBY POLICE BUTTON
    const nearbyPoliceBtn = document.getElementById("nearbyPoliceBtn");
    if(nearbyPoliceBtn){
        nearbyPoliceBtn.addEventListener("click", function(){
            if (!window.appLocation || !window.appMap) {
                alert("Waiting for location... Please ensure location services are enabled.");
                return;
            }

            // Scroll to map
            document.getElementById("map").scrollIntoView({ behavior: 'smooth' });

            // Show a loading popup
            const popup = L.popup()
                .setLatLng([window.appLocation.lat, window.appLocation.lon])
                .setContent("Finding nearest police station...")
                .openOn(window.appMap);

            const radius = 15000; // 15km radius
            const overpassQuery = `
                [out:json];
                (
                  node["amenity"="police"](around:${radius},${window.appLocation.lat},${window.appLocation.lon});
                  way["amenity"="police"](around:${radius},${window.appLocation.lat},${window.appLocation.lon});
                  relation["amenity"="police"](around:${radius},${window.appLocation.lat},${window.appLocation.lon});
                );
                out center;
            `;
            const overpassUrl = "https://overpass-api.de/api/interpreter";

            fetch(overpassUrl, {
                method: "POST",
                body: "data=" + encodeURIComponent(overpassQuery)
            })
            .then(response => response.json())
            .then(data => {
                let elements = data.elements || [];

                // Add Jait Police Station manually just in case it's not mapped on OSM
                elements.push({
                    lat: 27.6033, // Approx coordinates for Jait Police Station
                    lon: 77.5945,
                    tags: { name: "Jait Police Station" }
                });

                if (elements.length > 0) {
                    // Helper to calculate distance
                    function getDistance(lat1, lon1, lat2, lon2) {
                        var R = 6371; // km
                        var dLat = (lat2 - lat1) * Math.PI / 180;
                        var dLon = (lon2 - lon1) * Math.PI / 180;
                        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                                Math.sin(dLon / 2) * Math.sin(dLon / 2);
                        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                        return R * c;
                    }

                    // Sort elements by distance to find the ACTUAL closest one
                    elements.sort((a, b) => {
                        let aLat = a.lat || a.center.lat;
                        let aLon = a.lon || a.center.lon;
                        let bLat = b.lat || b.center.lat;
                        let bLon = b.lon || b.center.lon;
                        return getDistance(window.appLocation.lat, window.appLocation.lon, aLat, aLon) - 
                               getDistance(window.appLocation.lat, window.appLocation.lon, bLat, bLon);
                    });

                    let closest = elements[0];
                    let destLat = closest.lat || closest.center.lat;
                    let destLon = closest.lon || closest.center.lon;
                    let name = closest.tags.name ? closest.tags.name : "Nearest Police Station";

                    window.appMap.closePopup(popup);

                    // If a route control already exists, remove it
                    if (window.routingControl) {
                        window.appMap.removeControl(window.routingControl);
                    }

                    // Add routing control
                    window.routingControl = L.Routing.control({
                        waypoints: [
                            L.latLng(window.appLocation.lat, window.appLocation.lon),
                            L.latLng(destLat, destLon)
                        ],
                        routeWhileDragging: false,
                        showAlternatives: false,
                        lineOptions: {
                            styles: [{color: 'darkgreen', opacity: 0.8, weight: 6}]
                        },
                        createMarker: function(i, wp, nWps) {
                            if (i === 0) {
                                return L.marker(wp.latLng)
                                    .bindPopup("<b>📍 Your Current Location</b>")
                                    .openPopup();
                            } else {
                                return L.marker(wp.latLng)
                                    .bindPopup(`<b>🚓 ${name}</b><br>Destination Police Station`)
                                    .openPopup();
                            }
                        }
                    }).addTo(window.appMap);

                } else {
                    window.appMap.closePopup(popup);
                    if (confirm("Map par 15km ke andar koi mapped police station nahi mila. Kya aap Google Maps par search karna chahte hain?")) {
                        window.open("https://www.google.com/maps/search/police+station+near+me/", "_blank");
                    }
                }
            })
            .catch(err => {
                console.error(err);
                window.appMap.closePopup(popup);
                alert("Failed to find nearby police stations.");
            });
        });
    }

});