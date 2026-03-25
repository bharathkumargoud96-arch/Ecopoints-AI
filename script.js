let Points = localStorage.getItem("points") || 0;

function startCamera() {
    let video = document.getElementById("camera");
    video.style.display = "block";

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => video.srcObject = stream)
        .catch(() => alert("Camera access denied"));
}

function goToResult() {
    window.location.href = "result.html";
}

function generateResult() {
    let result = document.getElementById("result");
    let suggestion = document.getElementById("suggestion");
    let loading = document.getElementById("loading");

    loading.style.display = "block";

    setTimeout(() => {
        loading.style.display = "none";

        let types = ["Dry Waste ♻️", "Wet Waste 🍌", "Recyclable ♳"];
        let random = types[Math.floor(Math.random() * types.length)];

        result.innerText = "Detected: " + random;

        if (random.includes("Dry")) {
            suggestion.innerText = "Use Blue Bin";
        } else if (random.includes("Wet")) {
            suggestion.innerText = "Use Green Bin";
        } else {
            suggestion.innerText = "Send for Recycling";
        }

        points = parseInt(points) + 10;
        localStorage.setItem("points", points);

    }, 2000);
}

window.onload = function () {
    if (document.getElementById("result")) {
        generateResult();
    }

    if (document.getElementById("points")) {
        document.getElementById("points").innerText = "Total Points: " + points;
    }
};
function resetPoints() {
    localStorage.setItem("points", 0);
    location.reload();
}
let sound = new Audio("https://www.soundjay.com/buttons/sounds/button-3.mp3");

function playSound() {
    sound.play();
}
function toggleDarkMode() {
    document.body.classList.toggle("dark");
}
function animateProgress() {
    let bar = document.getElementById("progressBar");
    bar.style.width = "100%";
}
function loadChart() {
    let ctx = document.getElementById("chart");

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Your Points"],
            datasets: [{
                label: "Score",
                data: [localStorage.getItem("points") || 0]
            }]
        }
    });
}
window.onload = () => {
    document.body.classList.add("fade-in");
};
function fadeNavigate(event, url) {
    event.preventDefault();
    document.body.style.opacity = 0;

    setTimeout(() => {
        window.location.href = url;
    }, 500);
}
let startX = 0;

document.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
});

document.addEventListener("touchend", e => {
    let endX = e.changedTouches[0].clientX;

    if (startX - endX > 50) {
        window.location.href = "upload.html"; // swipe left
    }

    if (endX - startX > 50) {
        window.location.href = "index.html"; // swipe right
    }
});
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
        window.location.href = "upload.html";
    }
    if (e.key === "ArrowLeft") {
        window.location.href = "index.html";
    }
});
window.onload = () => {
    let bar = document.getElementById("progressBar");
    let resultText = document.getElementById("resultText");
    let suggestion = document.getElementById("suggestion");

    setTimeout(() => {
        bar.style.width = "100%";
    }, 500);

    setTimeout(() => {
        let results = ["Dry Waste ♻️", "Wet Waste 🍌", "Recyclable ♳"];
        let res = results[Math.floor(Math.random() * results.length)];

        resultText.innerText = res;

        if (res.includes("Dry")) {
            suggestion.innerText = "Dispose in dry waste bin.";
        } else if (res.includes("Wet")) {
            suggestion.innerText = "Compost this waste.";
        } else {
            suggestion.innerText = "Send for recycling.";
        }

    }, 2000);
};
document.getElementById("fileInput").addEventListener("change", function() {
    let file = this.files[0];
    let preview = document.getElementById("preview");

    if (file) {
        preview.src = URL.createObjectURL(file);
        preview.style.display = "block";
    }
});
function startCamera() {
    let video = document.getElementById("camera");
    video.style.display = "block";

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
        });
}

function captureImage() {
    let video = document.getElementById("camera");
    let canvas = document.getElementById("canvas");
    let preview = document.getElementById("preview");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    let ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    let imageData = canvas.toDataURL("image/png");

    preview.src = imageData;
    preview.style.display = "block";
}
document.getElementById("fileInput").addEventListener("change", function() {
    let file = this.files[0];
    let preview = document.getElementById("preview");

    if (file) {
        preview.src = URL.createObjectURL(file);
        preview.style.display = "block";
    }
});
let points = localStorage.getItem("points") || 0;
points = parseInt(points) + 10;
localStorage.setItem("points", points);

document.addEventListener("DOMContentLoaded", () => {
    let el = document.getElementById("pointsText");
    if (el) {
        el.innerText = "+" + points + " Points Earned 🎉";
    }
});

function resetPoints() {
    localStorage.setItem("points", 0);
    location.reload();
}
window.addEventListener("scroll", () => {
    document.querySelectorAll(".section").forEach(sec => {
        let top = sec.getBoundingClientRect().top;
        if (top < window.innerHeight - 100) {
            sec.classList.add("show");
        }
    });
});
document.querySelector(".detect-btn").onclick = function() {
  document.getElementById("resultBox").style.display = "block";
};