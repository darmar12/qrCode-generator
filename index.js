const inputDark = document.querySelector(".qrCode__dark");
const inputLight = document.querySelector(".qrCode__light");
const arrSizes = document.querySelector(".qrCode__radios");
const qrText = document.getElementById("qrCode__text");
const qrBox = document.getElementById("qrCode__content");
const shareBtn = document.querySelector(".qrCode__share");

let colorDark = "#000";
let colorLight = "#fff";
let size = 300;
let text = "default";

inputDark.addEventListener("input", handleInputvalue);
inputLight.addEventListener("input", handleInputvalue);
qrText.addEventListener("input", handleInputvalue);
arrSizes.addEventListener("change", handleInputvalue);
shareBtn.addEventListener("click", handleShare);

function handleInputvalue(e) {
    if(e.target.classList.contains("qrCode__dark")) { 
        colorDark = e.target.value;
    } else if(e.target.classList.contains("qrCode__light")) {
        colorLight = e.target.value;
    } else if(e.target.classList.contains("qrCode__radio")) {
        size = +e.target.title.split("x")[0];
    } else if(e.target.classList.contains("qrCode__text") && e.target.value) {
        text = e.target.value;
    }
    generateQRCode();
}

function checkImage() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const img = document.querySelector("#qrCode__content img");
            if (img.currentSrc) {
                resolve(img.currentSrc);
                return;
            }
            const canvas = document.querySelector("canvas");
            resolve(canvas.toDataURL());
        }, 50);
    });
}

async function handleShare() {
    setTimeout(async () => {
        try {
            const base64url = await checkImage();
            const blob = await (await fetch(base64url)).blob();
            const file = new File([blob], "QRCode.png", {
                type: blob.type,
            });
            await navigator.share({
                files: [file],
                title: text,
            });
        } catch (error) {
            throw new Error("Browser doesn't support sharing");
        }
    }, 100);
}

async function generateQRCode() {
    qrBox.innerHTML = "";
    new QRCode(
        "qrCode__content", 
        {
            text,
            height: size,
            width: size,
            colorLight,
            colorDark,
        }
    );
};

generateQRCode();

