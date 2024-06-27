for (let i = 0; i < 3; i++) layers.push(new Layer()); layers[3].context.fillStyle = "SkyBlue"; layers[3].context.font = "bold 100px sans-serif"; layers[1].context.globalAlpha = 0.5;
const audio = []; const dir = "resources/images/"; const blood = []; const marks = [];
marks.push("mark0" in localStorage ? (localStorage.getItem("mark0") === "true") : true); for (let i = 1; i < 4; i++) { marks.push(("mark" + i) in localStorage ? (localStorage.getItem(("mark" + i)) === "true") : false); }
let money = "money" in localStorage ? Number(localStorage.getItem("money")) : 13; function setMoney(value) { money = value; if(money > 99) money = 99; if(money < 0) money = 0; localStorage.setItem("money", money); objects[1].render(); }
const hard = []; for (let i = 0; i < 2; i++) { hard.push(("hard" + i) in localStorage ? (localStorage.getItem(("hard" + i)) === "true") : false); } let pause = false; seed = (new Date()).getMilliseconds();

function load() {
  objects.push(new MoneyText()); for (let i = 0; i < 23; i++) images.push(new Image());

  images[0].src = dir + "menu.png";
  images[0].onload = () => images[1].src = dir+"UI/menu/play.png";
  images[1].onload = () => images[2].src = dir+"UI/menu/settings.png";
  images[2].onload = () => images[3].src = dir+"UI/menu/help.png";
  images[3].onload = () => images[4].src = dir+"UI/menu/titles.png";
  images[4].onload = () => images[5].src = dir+"UI/menu/rub.png";
  images[5].onload = () => menu();

  const audioDir = "resources/audio/";
  audio.push(new Audio(audioDir + "gameStart.mp3"));
  audio.push(new Audio(audioDir + "ambient.mp3")); audio[1].loop = true;
  audio.push(new Audio(audioDir + "epic.mp3"));
  audio.push(new Audio(audioDir + "gameOver.mp3"));
  audio.push(new Audio(audioDir + "push.mp3"));
  audio.push(new Audio(audioDir + "death.mp3")); audio[5].playbackRate = 1.5;
  audio.push(new Audio(audioDir + "money.mp3")); audio[6].playbackRate = 1.5;

  if("music" in localStorage) { for (let i = 0; i < 3; i++) audio[i].volume = localStorage.getItem("music"); }
  if("sfx" in localStorage) { for (let i = 3; i < 7; i++) audio[i].volume = localStorage.getItem("sfx"); }

  for (let i = 0; i < 5; i++) { blood.push(new Image()); blood[i].src = dir + "blood/" + i + ".png"; }
  images[6].src  = dir+"ground.png";
  images[7].src  = dir+"panel.png";
  images[8].src  = dir+"UI/button.png";
  images[9].src  = dir+"UI/task.png";
  images[10].src = dir+"UI/pause.png";
  images[11].src = dir+"UI/pausePanel.png";
  images[12].src = dir+"UI/back.png";
  images[13].src = dir+"active/0.png";
  images[14].src = dir+"active/1.png";
  images[15].src = dir+"active/2.png";
  images[16].src = dir+"coin.png";
  images[17].src = dir+"wall.png";
  images[18].src = dir+"blood/coinBlood.png";
  images[19].src = dir+"UI/menu/ok.png";
  images[20].src = dir+"titles.png";
  images[21].src = dir+"settings.png";
  images[22].src = dir+"UI/toggle.png";
}

function clearScene() {
  const len = objects.length-2; for (let i = 0; i < len; i++) objects.pop();
  for (let i = 0; i < layers.length; i++) clearTransform(new Vector4(960, 540, 1920, 1080), i);
  objects[1].render(); renderImage(images[5], objects[1].transform, 3);
}
function menu() {
  audio[0].muted = false; audio[1].muted = false; audio[2].muted = false; for (let i = 0; i < 3; i++) { audio[i].pause(); audio[i].currentTime = 0; }
  dif = 0; clearScene(); renderImage(images[0], new Vector4(960, 540, 1920, 1080), 0);
  objects.push(new MenuButton(960, 325, 660,  180, images[1], () => { game(); }));
  objects.push(new MenuButton(960, 525, 1040, 150, images[2], () => { settings(); }));
  objects.push(new MenuButton(960, 725, 618,  180, images[4], () => { window.open("https://t.me/veins4u", "_blank"); }));
}
function game() {
  audio[0].play(); audio[0].onended = () => audio[1].play();
  clearScene(); pause = false; renderImage(images[6], new Vector4(540, 540, 1080, 1080), 0); renderImage(images[7], new Vector4(1500, 540, 840, 1080), 0);
  objects.push(new Task()); objects.push(new EnemyGenerator()); objects.push(new PauseButton()); objects.push(new MenuButton(90, 1170, 180,  180, images[12], () => { menu(); })); objects.push(new Shutter());
  const position = new Vector2(1500, 560); let x = 540; for (let x = -1; x < 2; x++) { for (let y = -1; y < 2; y++) objects.push(new NumberButton(position.x + 180 * x, position.y + 180 * y, y * 3 + x + 5)); } objects.push(new NumberButton(position.x - 180, position.y + 360, "-")); objects.push(new NumberButton(position.x, position.y + 360, "0")); objects.push(new NumberButton(position.x + 180, position.y + 360, "<  "));
  objects.push(new ActiveButton(400, images[13], 1, () => objects[2].updateTask(), false)); objects.push(new BuildButton(540, images[14], 2, () => objects.push(new Wall()), true)); objects.push(new ActiveButton(680, images[15], 3, () => damage(10), false));
}
function titles() {
  clearScene(); objects.push(new MenuButton(90, 990, 180,  180, images[12], () => { menu(); }));
  renderImage(images[0], new Vector4(960, 540, 1920, 1080), 0); renderImage(images[20], new Vector4(960, 540, 730, 220), 0);
}
function settings() {
  clearScene(); renderImage(images[0], new Vector4(960, 540, 1920, 1080), 0); renderImage(images[21], new Vector4(960, 540, 1920, 1080), 0); objects.push(new MenuButton(90, 990, 180,  180, images[12], () => { menu(); }));
  objects.push(new Checkbox(1300, 490, 100, document.fullscreenElement, () => { if (!document.fullscreenElement) { document.documentElement.requestFullscreen(); } else { document.exitFullscreen(); } }));
  objects.push(new Checkbox(960 - 200, 820, 100, marks[0], () => { marks[0] = !marks[0]; localStorage.setItem("mark0", marks[0]); }));
  objects.push(new Checkbox(960 - 60, 820, 100, marks[1], () => { marks[1] = !marks[1]; localStorage.setItem("mark1", marks[1]); }));
  objects.push(new Checkbox(960 + 60, 820, 100, marks[2], () => { marks[2] = !marks[2]; localStorage.setItem("mark2", marks[2]); }));
  objects.push(new Checkbox(960 + 200, 820, 100, marks[3], () => { marks[3] = !marks[3]; localStorage.setItem("mark3", marks[3]); }));
  objects.push(new Checkbox(1000, 600, 100, hard[0], () => { hard[0] = !hard[0]; localStorage.setItem("hard0", hard[0]); }));
  objects.push(new Checkbox(1125, 600, 100, hard[1], () => { hard[1] = !hard[1]; localStorage.setItem("hard1", hard[1]); }));
  objects.push(new MusicToggle(960 + 250, 270));
  objects.push(new SFXToggle(960 + 250, 370));
}

function gameOver() {
  damage(10); pause = true;
  objects[5].transform.position.y -= 180; objects[5].render();
  objects[4].transform.position.y -= 120;
  renderImage(images[11], new Vector4(540, 540, 1080, 1080), 2);
  audio[1].pause(); audio[2].pause(); audio[1].currentTime = 0; audio[2].currentTime = 0; audio[3].play();
}

class MoneyText extends GameObject {
  constructor() { super(150, 40, 80, 80); this.textTransform = new Vector4(this.transform.position.x - 95, this.transform.position.y, 115, 100); this.render(); }
  render() {
    clearTransform(this.textTransform, 3); let text = money; if((money+"").length < 2) text = "0" + text;
    layers[3].context.fillText(text, this.transform.position.x - 150, this.transform.position.y + 35);
  }
}
class MenuButton extends Button {
  constructor(x, y, width, height, image, use) { super(x, y, width, height); this.image = image; this.use = use; this.render(); }
  animate(value) {
    clearTransform(this.transform, 3);
    this.transform.size.x *= value; this.transform.size.y *= value;
    this.render();
  }
  render() { renderImage(this.image, this.transform, 3); }
  onPress() { this.animate(0.8); audio[4].play(); }
  onRelease() { this.animate(1.25); this.use(); }
  onInterrupt() { this.animate(1.25); }
}
class Checkbox extends Button {
  constructor(x, y, size, state, use) { super(x, y, size, size); this.state = state; this.use = use; this.render(); }
  animate(value) {
    clearTransform(this.transform, 3);
    this.transform.size.x *= value; this.transform.size.y *= value;
    this.render();
  }
  render() { renderImage(images[8], this.transform, 3); if(this.state) renderImage(images[19], this.transform, 3); }
  onPress() { this.animate(0.8); audio[4].play(); }
  onRelease() { this.state = !this.state; this.use(); this.animate(1.25); }
  onInterrupt() { this.animate(1.25); }
}
class Toggle extends Button {
  constructor(x, y, start) { super(x, y, 500, 80); this.mini = new Vector4(x - this.transform.size.x / 2 + 20 + start * (this.transform.size.x - 40), y, 40, 80); this.drag = false; this.render(); }
  update() {
    if(this.drag) {
      this.mini.position.x = mouse.transform.position.x;
      if(this.mini.position.x < this.transform.position.x - this.transform.size.x / 2 + this.mini.size.x / 2) this.mini.position.x = this.transform.position.x - this.transform.size.x / 2 + this.mini.size.x / 2;
      if(this.mini.position.x > this.transform.position.x + this.transform.size.x / 2 - this.mini.size.x / 2) this.mini.position.x = this.transform.position.x + this.transform.size.x / 2 - this.mini.size.x / 2;
      this.change((-this.transform.position.x + this.transform.size.x / 2 - this.mini.size.x / 2 + this.mini.position.x) / (this.transform.size.x - this.mini.size.x));
      this.drag = mouse.down;
      this.render();
    }
    super.update();
  }
  render() { clearTransform(this.transform, 3); renderImage(images[22], this.transform, 3); renderImage(images[8], this.mini, 3); }
  onPress() { this.drag = true; audio[4].play(); }
}
class MusicToggle extends Toggle {
  constructor(x, y) { super(x, y, "music" in localStorage ? Number(localStorage.getItem("music")) : 0.75); }
  change(value) { for (let i = 0; i < 3; i++) audio[i].volume = value; localStorage.setItem("music", value); }
}
class SFXToggle extends Toggle {
  constructor(x, y) { super(x, y, "sfx" in localStorage ? Number(localStorage.getItem("sfx")) : 0.75); }
  change(value) { for (let i = 3; i < 7; i++) audio[i].volume = value; localStorage.setItem("sfx", value); }
}

load();
window.onblur = function () { if(!pause & objects[4].pause != null) objects[4].pause(); }
