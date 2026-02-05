let isSubmitting = false;
let html5QrCode;

const statusEl = document.getElementById("status");
const restartBtn = document.getElementById("restart");

// 員工編號對應表
const employeeMap = {
  "123456": "周",
  "234567": "洪",
  "345678": "徐",
  "456789": "蔡",
  "567890": "李"
};

function onScanSuccess(decodedText) {
  if (isSubmitting) return;
  isSubmitting = true;

  html5QrCode.stop(); // 停止掃描

  const input = decodedText.trim();
  let employeeName;

  // 判斷是編號還是名字
  if (employeeMap[input]) {
    // QR Code 是編號
    employeeName = employeeMap[input];
  } else if (input.length > 0) {
    // QR Code 是名字
    employeeName = input;
  }

  if (employeeName) {
    statusEl.textContent = `${employeeName} 打卡完成`;
    statusEl.className = "status success";
  } else {
    statusEl.textContent = "未知員工，請重試";
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

