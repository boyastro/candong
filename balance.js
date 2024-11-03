const canvas = document.getElementById("balanceCanvas");
const ctx = canvas.getContext("2d");

// Các biến cho cân và vật nặng
let balanceAngle = 0;  // Góc nghiêng của cân
const scaleWidth = 300;
const scaleHeight = 10;
const plateSize = 50;

// Danh sách các vật nặng
let objects = [
  { type: 'apple', weight: 1, x: 50, y: 350, onLeft: false, onRight: false },
  { type: 'apple', weight: 1, x: 100, y: 350, onLeft: false, onRight: false },
  { type: 'apple', weight: 1, x: 150, y: 350, onLeft: false, onRight: false },
  { type: 'weight', weight: 3, x: 200, y: 350, onLeft: false, onRight: false }
];

// Hàm vẽ các đĩa cân
function drawScale() {
  ctx.save();
  ctx.translate(canvas.width / 2, 200);
  ctx.rotate(balanceAngle);
  
  // Vẽ thanh cân
  ctx.fillStyle = "gray";
  ctx.fillRect(-scaleWidth / 2, -scaleHeight / 2, scaleWidth, scaleHeight);

  // Vẽ đĩa bên trái và phải
  ctx.beginPath();
  ctx.arc(-scaleWidth / 2, 0, plateSize, 0, Math.PI * 2);
  ctx.arc(scaleWidth / 2, 0, plateSize, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

// Hàm vẽ các vật nặng
function drawObjects() {
  objects.forEach(obj => {
    if (obj.type === 'apple') {
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(obj.x, obj.y, 15, 0, Math.PI * 2);
      ctx.fill();
    } else if (obj.type === 'weight') {
      ctx.fillStyle = "black";
      ctx.fillRect(obj.x - 15, obj.y - 15, 30, 30);
    }
  });
}

// Tính toán góc của cân dựa trên tổng trọng lượng bên trái và phải
function updateBalance() {
  let leftWeight = 0;
  let rightWeight = 0;

  objects.forEach(obj => {
    if (obj.onLeft) leftWeight += obj.weight;
    if (obj.onRight) rightWeight += obj.weight;
  });

  const weightDiff = -leftWeight + rightWeight;
  balanceAngle = Math.max(Math.min(weightDiff * 0.05, 0.5), -0.5); // Giới hạn góc để không bị nghiêng quá
}

// Kiểm tra xem người dùng có nhấp chuột vào vật không
let draggingObject = null;
canvas.addEventListener("mousedown", (event) => {
  const { offsetX, offsetY } = event;
  draggingObject = objects.find(
    (obj) => Math.hypot(obj.x - offsetX, obj.y - offsetY) < 20
  );
});

// Di chuyển vật
canvas.addEventListener("mousemove", (event) => {
  if (draggingObject) {
    const { offsetX, offsetY } = event;
    draggingObject.x = offsetX;
    draggingObject.y = offsetY;

    // Kiểm tra xem vật có nằm trên đĩa trái hoặc phải không
    draggingObject.onLeft = offsetX < canvas.width / 2 - scaleWidth / 2 + plateSize;
    draggingObject.onRight = offsetX > canvas.width / 2 + scaleWidth / 2 - plateSize;
  }
});

// Dừng di chuyển vật
canvas.addEventListener("mouseup", () => {
  draggingObject = null;
});

// Hàm render để vẽ lại khung hình
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updateBalance();
  drawScale();
  drawObjects();
  requestAnimationFrame(render);
}

render();
