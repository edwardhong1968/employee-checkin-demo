let isSubmitting = false;
let html5QrCode;

const statusEl = document.getElementById("status");
const restartBtn = document.getElementById("restart");

function onScanSuccess(decodedText) {
  if (isSubmitting) return;
  isSubmitting = true;

  html5QrCode.stop(); // 停止掃描

  // QR Code 內容就是員工名字
  const employeeName = decodedText.trim();

  if (employeeName) {
    statusEl.textContent = `${employeeName} 打卡完成`;
    statusEl.className = "status success";
  } else {
    statusEl.textContent = "掃描失敗，請重試";
    statusEl.className = "status error";
  }

  restartBtn.hidden = false;
}

// 初始化掃描器
html5QrCode = new Html5Qrcode("reader");
html5QrCode.start(
  { facingMode: "environment" },
  { fps: 10, qrbox: 220 },
  onScanSuccess
);

// 重新掃描按鈕
restartBtn.onclick = () => {
  isSubmitting = false;
  restartBtn.hidden = true;
  statusEl.textContent = "等待掃描...";
  statusEl.className = "status";

  html5QrCode.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 220 },
    onScanSuccess
  );
};
