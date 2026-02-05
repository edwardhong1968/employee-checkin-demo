const employeeId = "DEMO-USER";
let isSubmitting = false;
let html5QrCode;

const statusEl = document.getElementById("status");
const restartBtn = document.getElementById("restart");

function mockCheckinApi(payload) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        success: true,
        message: `✅ ${payload.employee_id} 報到成功`
      });
    }, 1000);
  });
}

function onScanSuccess(decodedText) {
  if (isSubmitting) return;
  isSubmitting = true;

  statusEl.textContent = "送出報到中...";
  statusEl.className = "status";

  html5QrCode.stop();

  mockCheckinApi({
    employee_id: employeeId,
    checkin_code: decodedText
  })
  .then(res => {
    statusEl.textContent = res.message;
    statusEl.classList.add("success");
    restartBtn.hidden = false;
  });
}

html5QrCode = new Html5Qrcode("reader");
html5QrCode.start(
  { facingMode: "environment" },
  { fps: 10, qrbox: 220 },
  onScanSuccess
);

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
