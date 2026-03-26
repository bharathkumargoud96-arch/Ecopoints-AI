// State variables
let points = parseInt(localStorage.getItem("points")) || 0;
let sound = new Audio("https://www.soundjay.com/buttons/sounds/button-3.mp3");

// AI MODEL CONFIG
const MODEL_URL = "https://teachablemachine.withgoogle.com/models/YPbds8mRQ/";
let model;

async function initAI() {
    try {
        const modelURL = MODEL_URL + "model.json";
        const metadataURL = MODEL_URL + "metadata.json";
        model = await tmImage.load(modelURL, metadataURL);
        console.log("Model Loaded ✅");
    } catch (e) {
        console.error("Model Load Error:", e);
    }
}

// CAMERA LOGIC
function startCamera() {
    const video = document.getElementById("camera");
    const preview = document.getElementById("preview");
    
    video.style.display = "block";
    preview.style.display = "none";

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(err => {
            console.error("Error accessing camera:", err);
            alert("Camera access denied or NOT available. 🎥");
        });
}

function captureImage() {
    const video = document.getElementById("camera");
    const canvas = document.getElementById("canvas");
    const preview = document.getElementById("preview");

    if (!video.srcObject) {
      alert("Please open the camera first! 📷");
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL("image/png");
    preview.src = imageData;
    preview.style.display = "block";
    video.style.display = "none";
    
    const stream = video.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    video.srcObject = null;
}

// UPLOAD LOGIC
function setupUpload() {
    const fileInput = document.getElementById("fileInput");
    const preview = document.getElementById("preview");
    const video = document.getElementById("camera");

    if (fileInput) {
        fileInput.addEventListener("change", function() {
            const file = this.files[0];
            if (file) {
                preview.src = URL.createObjectURL(file);
                preview.style.display = "block";
                video.style.display = "none";
                if (video.srcObject) {
                  const tracks = video.srcObject.getTracks();
                  tracks.forEach(track => track.stop());
                  video.srcObject = null;
                }
            }
        });
    }
}

// REAL AI DETECTION
async function detectWaste() {
    const preview = document.getElementById("preview");
    const resultBox = document.getElementById("resultBox");
    const detectBtn = document.querySelector(".detect-btn");

    if (preview.style.display === "none" || !preview.src) {
        alert("Please upload or capture an image first! 📁📸");
        return;
    }

    if (!model) {
        detectBtn.innerText = "⏳ Loading AI...";
        await initAI();
    }

    // Visual feedback
    detectBtn.innerText = "🔍 Analyzing...";
    detectBtn.disabled = true;

    try {
        // AI Processing
        const prediction = await model.predict(preview);
        
        // Find highest probability
        let highest = prediction[0];
        for(let i=1; i<prediction.length; i++) {
            if(prediction[i].probability > highest.probability) {
                highest = prediction[i];
            }
        }

        // Sound effect
        playSound();

        // Mapping model classes to categories
        let type = "Recycle";
        let suggest = "Place in the Blue/Yellow Bin for recycling. ♻️";

        if (highest.className === "Wet Waste") {
            type = "Wet";
            suggest = "Dispose of in the Red Bin. 🗑️";
        } else if (highest.className === "Dry Waste") {
            type = "Dry";
            suggest = "Compost in the Green Bin. 🍌";
        } else if (highest.className === "Recyclable Waste") {
            type = "Recycle";
            suggest = "Place in the Blue/Yellow Bin for recycling. ♻️";
        }

        // Display results
        document.getElementById("res-type").innerText = type;
        document.getElementById("res-confidence").innerText = (highest.probability * 100).toFixed(1) + "%";
        document.getElementById("res-suggestion").innerText = suggest;
        
        // Award points
        points += 10;
        localStorage.setItem("points", points);
        document.getElementById("res-points").innerText = "+10";

        resultBox.style.display = "block";
        resultBox.scrollIntoView({ behavior: 'smooth' });

        updatePointsDisplay();

    } catch (error) {
        console.error("Detection Error:", error);
        alert("AI Failed to identify waste. ❌");
    } finally {
        detectBtn.innerText = "🔍 Detect Waste";
        detectBtn.disabled = false;
    }
}

function updatePointsDisplay() {
    const pointsEl = document.getElementById("points");
    const pointsTextEl = document.getElementById("pointsText");
    
    if (pointsEl) pointsEl.innerText = "Total Points: " + points;
    if (pointsTextEl) pointsTextEl.innerText = "+" + points + " Points Earned 🎉";
}

// UTILITIES
function playSound() {
    sound.play().catch(e => console.log("Sound play error:", e));
}

function resetPoints() {
    localStorage.setItem("points", 0);
    points = 0;
    updatePointsDisplay();
    alert("Points reset! ♻️");
}

// NAVIGATION
function setupNavigation() {
    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") window.location.href = "upload.html";
        if (e.key === "ArrowLeft") window.location.href = "index.html";
    });
}

// INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
    console.log("EcoAI - Standard Pure Frontend Ready 🌍");
    
    initAI(); // Pre-load model
    setupUpload();
    setupNavigation();
    updatePointsDisplay();

    document.body.classList.add("fade-in");

    const detectBtn = document.querySelector(".detect-btn");
    if (detectBtn) {
        detectBtn.addEventListener("click", detectWaste);
    }
});
