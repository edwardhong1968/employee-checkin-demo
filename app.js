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

  // ✅ 新增：儲存打卡資料
  saveToExcel(input);  // 或 saveToExcel(員工編號)
}

  } else {
    statusEl.textContent = "未知員工，請重試";
    statusEl.className = "status error";
  }

  restartBtn.hidden = false;
}

function saveToExcel(employeeId) {
  const now = new Date();

  // 1. 取得既有紀錄
  const records = JSON.parse(localStorage.getItem("checkins") || "[]");

  // 2. 新增一筆（同時存原始時間，方便排序）
  records.push({
    employeeId: employeeId,
    time: now.toLocaleString(),   // 顯示用
    timestamp: now.getTime()      // 排序用
  });

  // 3. 依「編號 → 時間」排序
  records.sort((a, b) => {
    // 先比員工編號
    const idCompare = a.employeeId.localeCompare(
      b.employeeId,
      undefined,
      { numeric: true, sensitivity: "base" }
    );

    if (idCompare !== 0) return idCompare;

    // 同一員工，再比時間
    return a.timestamp - b.timestamp;
  });

  // 4. 存回 localStorage
  localStorage.setItem("checkins", JSON.stringify(records));

  // 5. 產生 CSV（Excel 可直接開）
  let csv = "Employee ID,Check-in Time\n";
  records.forEach(r => {
    csv += `${r.employeeId},${r.time}\n`;
  });

  // 6. 下載
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "checkin_records.csv";
  link.click();
}

function downloadExcel() {
  const records = JSON.parse(localStorage.getItem("checkins") || "[]");

  if (records.length === 0) {
    alert("目前沒有打卡紀錄");
    return;
  }

  let csv = "Employee ID,Check-in Time\n";
  records.forEach(r => {
    csv += `${r.employeeId},${r.time}\n`;
  });

  // 防止 Excel 中文亂碼
  const blob = new Blob(
    ["\uFEFF" + csv],
    { type: "text/csv;charset=utf-8;" }
  );

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "checkin_records.csv";
  link.click();
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





