// ================== FILE UPLOAD ==================
const fileInput = document.getElementById("fileInput");
const preview = document.getElementById("preview");

if (fileInput) {
    fileInput.addEventListener("change", function () {
        const file = this.files[0];

        if (file) {
            preview.src = URL.createObjectURL(file);
            preview.style.display = "block";
        }
    });
}

// ================== CAMERA ==================
function startCamera() {
    const video = document.getElementById("camera");

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
            video.style.display = "block";
        })
        .catch(() => alert("Camera access denied"));
}

/*function captureImage() {
    const video = document.getElementById("camera");
    const canvas = document.createElement("canvas");
    const preview = document.getElementById("preview");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    preview.src = canvas.toDataURL("image/png");
    preview.style.display = "block";
}*/
function captureImage() {
    const video = document.getElementById("camera");
    const preview = document.getElementById("preview");

    const canvas = document.createElement("canvas"); // ✅ create dynamically
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL("image/png");

    preview.src = imageData;
    preview.style.display = "block";
}

// ================== DETECT BUTTON ==================
//document.querySelector(".detect-btn").onclick = function () {
 //   document.getElementById("resultBox").style.display = "block";
//};
const detectBtn = document.querySelector(".detect-btn");

if (detectBtn) {
    detectBtn.onclick = function () {
        document.getElementById("resultBox").style.display = "block";
    };
}
async function detectWaste() {
    const preview = document.getElementById("preview");

    if (!preview.src) {
        alert("Please upload or capture image first!");
        return;
    }

    const modelURL = "https://teachablemachine.withgoogle.com/models/YPbds8mRQ/";

    const model = await tmImage.load(
        modelURL + "model.json",
        modelURL + "metadata.json"
    );

    const prediction = await model.predict(preview);

    let best = prediction[0];

    for (let i = 1; i < prediction.length; i++) {
        if (prediction[i].probability > best.probability) {
            best = prediction[i];
        }
    }

    document.getElementById("resultBox").style.display = "block";

    document.getElementById("resultBox").innerHTML = `
        <h3>Result</h3>
        <p><strong>Type:</strong> ${best.className}</p>
        <p><strong>Confidence:</strong> ${(best.probability * 100).toFixed(2)}%</p>
        <p><strong>Suggestion:</strong> ${
            best.className.toLowerCase().includes("plastic") ? "Recycle ♻️" :
            best.className.toLowerCase().includes("organic") ? "Compost 🌱" :
            "Dispose properly 🗑️"
        }</p>
        <p><strong>Points Earned:</strong> +10</p>
    `;
}
