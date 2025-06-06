// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  // 設定淺藍色底色
  background(180, 220, 255);

  // 畫面最上方加標題
  textAlign(CENTER, TOP);
  textSize(32);
  fill(0, 60, 120);
  text('ＴＫＵＥＴ小測驗', width / 2, 20);

  // 計算標題高度與間距
  let titleH = 32 + 20; // 字高+間距

  // 計算視訊顯示區域（約視窗 70%，置中，且不與標題碰撞）
  let vidW = width * 0.7;
  let vidH = video.height * (vidW / video.width);
  // 若高度超過下方空間，則以高度為主縮放
  if (vidH > height - titleH - 40) {
    vidH = height - titleH - 40;
    vidW = video.width * (vidH / video.height);
  }
  let vidX = (width - vidW) / 2;
  let vidY = titleH + ((height - titleH) - vidH) / 2;

  image(video, vidX, vidY, vidW, vidH);

  // 只顯示兩隻手的食指指尖
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1 && hand.keypoints.length > 8) {
        let indexTip = hand.keypoints[8];
        // 依照左右手顏色
        if (hand.handedness == "Left") {
          fill(255, 0, 255);
        } else {
          fill(255, 255, 0);
        }
        noStroke();
        // 依照縮放後的座標顯示圓點
        let x = map(indexTip.x, 0, video.width, vidX, vidX + vidW);
        let y = map(indexTip.y, 0, video.height, vidY, vidY + vidH);
        circle(x, y, 24);
      }
    }
  }
}
