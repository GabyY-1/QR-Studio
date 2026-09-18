const content = document.getElementById("content");
const foreground = document.getElementById("foreground");
const background = document.getElementById("background");
const size = document.getElementById("size");
const preview = document.getElementById("preview");
const status = document.getElementById("status");
const download = document.getElementById("download");
const copy = document.getElementById("copy");
const foregroundValue = document.getElementById("foregroundValue");
const backgroundValue = document.getElementById("backgroundValue");

let qr = null;

function updateColorLabels() {
  foregroundValue.textContent = foreground.value.toUpperCase();
  backgroundValue.textContent = background.value.toUpperCase();
}

function showEmpty() {
  preview.innerHTML = '<div class="empty"><span>QR</span><p>Entre un texte ou un lien pour générer ton QR code.</p></div>';
  status.textContent = "En attente";
  download.disabled = true;
  copy.disabled = true;
  qr = null;
}

function generate() {
  const value = content.value.trim();

  if (!value) {
    showEmpty();
    return;
  }

  preview.innerHTML = "";

  qr = new QRCode(preview, {
    text: value,
    width: Number(size.value),
    height: Number(size.value),
    colorDark: foreground.value,
    colorLight: background.value,
    correctLevel: QRCode.CorrectLevel.M
  });

  status.textContent = "Généré";
  download.disabled = false;
  copy.disabled = false;
}

function getCanvas() {
  return preview.querySelector("canvas");
}

function downloadQr() {
  const canvas = getCanvas();
  if (!canvas) return;

  const link = document.createElement("a");
  link.download = "qr-code.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

async function copyQr() {
  const canvas = getCanvas();
  if (!canvas || !navigator.clipboard || !window.ClipboardItem) return;

  try {
    const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"));
    await navigator.clipboard.write([
      new ClipboardItem({ "image/png": blob })
    ]);
    copy.textContent = "Image copiée";
    setTimeout(() => {
      copy.textContent = "Copier l'image";
    }, 1400);
  } catch {
    copy.textContent = "Copie impossible";
    setTimeout(() => {
      copy.textContent = "Copier l'image";
    }, 1400);
  }
}

[content, foreground, background, size].forEach(input => {
  input.addEventListener("input", () => {
    updateColorLabels();
    generate();
  });
});

download.addEventListener("click", downloadQr);
copy.addEventListener("click", copyQr);

updateColorLabels();
showEmpty();