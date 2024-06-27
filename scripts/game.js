function damage(damage) { for (let i = 21; i < objects.length; i++) { if(objects[i] instanceof Enemy) objects[i].damage(damage); } }

class Animation {
  constructor(frames, speed) { this.frames = frames; this.image = this.frames[0]; this.frame = 0; this.speed = speed; this.c = 0; }
  update() {
    this.c++; if(this.c >= 60 / this.speed) {
      this.frame++; if(this.frame >= this.frames.length) this.frame = 0;
      this.image = this.frames[this.frame]; this.c = 0;
    }
  }
}

class Task extends GameObject {
  constructor() {
    super(1405, 180, 590, 200); this.currentAnswer = ""; this.rightAnswer = 0;
    this.answerTransform = new Vector4(this.transform.position.x + 380, this.transform.position.y, 180, 180);
    this.updateTask(); this.renderAnswer();
  }

  renderTask(text) {
    renderImage(images[9], this.transform, 3);
    layers[3].context.fillText(text, this.transform.position.x - 220, this.transform.position.y + 40);
  }
  renderAnswer() {
    renderImage(images[8], this.answerTransform, 3);
    layers[3].context.fillText(this.currentAnswer, this.answerTransform.position.x - 53, this.answerTransform.position.y + 35);
  }

  updateTask() {
    let num_1 = 0; let num_2 = 0; let markLen = 0; for (let i = 0; i < marks.length; i++) { if(marks[i]) markLen++; }
    let mark = -1; if(markLen != 0) { while (marks[mark] != true) mark = float2int(random() * 4); }
    let symbol = "";
    switch (mark) {
      case 0:
        num_1 = float2int(1 + random() * 5) + (hard[0] ? float2int(random() * 6) : 0) + (hard[1] ? float2int(random() * 41) : 0);
        num_2 = float2int(1 + random() * 4) + (hard[0] ? float2int(random() * 6) : 0) + (hard[1] ? float2int(random() * 41) : 0);
        this.rightAnswer = num_1 + num_2;
        symbol = "+";
        break;
      case 1:
        num_1 = float2int(random() * 10);
        num_2 = float2int(random() * 10);
        this.rightAnswer = num_1 * num_2;
        symbol = "*";
        break;
      case 2:
        num_1 = float2int(2 + random() * 8) + (hard[0] ? float2int(random() * 12) : 0) + (hard[1] ? float2int(random() * 80) : 0);
        num_2 = float2int(1 + random() * (num_1 - 1));
        this.rightAnswer = num_1 - num_2;
        symbol = "-";
        break;
      case 3:
        num_2 = float2int(1 + random() * 9);
        num_1 = num_2 * float2int(1 + random() * 9);
        this.rightAnswer = num_1 / num_2;
        symbol = "/";
        break;
      default:
        num_1 = 0; num_2 = 0; this.rightAnswer = 0; symbol = "/";
        break;
    }
    this.renderTask(num_1 + " " + symbol + " " + num_2);
  }
  updateAnswer(char) { this.currentAnswer += char; this.checkAnswer(); if(this.currentAnswer.length > 2) this.currentAnswer = ""; this.renderAnswer(); }
  checkAnswer() { if(this.currentAnswer == this.rightAnswer) { this.currentAnswer = ""; this.updateTask(); damage(1); } }
}
class NumberButton extends Button {
  constructor(x, y, char) { super(x, y, 180, 180); this.char = char; this.render(); }

  animate(value) {
    clearTransform(this.transform, 3);
    this.transform.size.x += value; this.transform.size.y += value;
    this.render();
  }
  render() {
    renderImage(images[8], this.transform, 3);
    layers[3].context.fillText(this.char, this.transform.position.x - 25, this.transform.position.y + 35);
  }

  collision(other) { if(!pause) super.collision(other); }
  onPress() { this.animate(-20); audio[4].play(); }
  onRelease() { this.animate(20); objects[2].updateAnswer(this.char); }
  onInterrupt() { this.animate(20); }
}
class Shutter extends GameObject { constructor() { super(540, 540, 1080, 1080); } update() { if(!pause) clearTransform(this.transform, 2); } }

class ActiveButton extends Button {
  constructor(x, image, cost, use) { super(x, 70, 140, 140); this.image = image; this.cost = cost; this.use = use; this.render(); }

  animate(value) {
    clearTransform(this.transform, 3);
    this.transform.size.x += value; this.transform.size.y += value;
    this.render();
  }
  render() {
    renderImage(images[8], this.transform, 3); if(this.image != null) renderImage(this.image, this.transform, 3);
    layers[3].context.fillText(this.cost, this.transform.position.x + 10, this.transform.position.y + 70);
  }

  collision(other) { if(!pause) super.collision(other); }
  onPress() { this.animate(-20); audio[4].play(); }
  onRelease() { this.animate(20); if(money >= this.cost) { setMoney(money - this.cost); this.use(); } }
  onInterrupt() { this.animate(20); }
}
class BuildButton extends ActiveButton {
  constructor(x, image, cost, use) { super(x, image, cost, use); }
  onRelease() { this.animate(20); }
  onInterrupt() { this.animate(20); audio[4].play(); if(money >= this.cost) { setMoney(money - this.cost); this.use(); } }
}
class PauseButton extends Button {
  constructor() { super(1020, 60, 120, 120); this.render(); }

  animate(value) {
    clearTransform(this.transform, 3);
    this.transform.size.x += value; this.transform.size.y += value;
    this.render();
  }
  render() { renderImage(images[8], this.transform, 3); renderImage(images[10], this.transform, 3); }

  onPress() { this.animate(-20); audio[4].play(); }
  onRelease() { this.animate(20); if(pause) this.call(); else this.pause(); }
  onInterrupt() { this.animate(20); }
  pause() { pause = true; objects[5].transform.position.y -= 180; objects[5].render(); audio[0].muted = true; audio[1].muted = true; audio[2].muted = true; renderImage(images[11], new Vector4(540, 540, 1080, 1080), 2); }
  call() { pause = false; clearTransform(objects[5].transform, 3); objects[5].transform.position.y += 180; audio[0].muted = false; audio[1].muted = false; audio[2].muted = false; }
}

class Coin extends GameObject {
  constructor(x, y) { super(x, y, 65, 65); this.velocity = -(10 + float2int(random() * 10)); }
  update() {
    if(pause) return; this.transform.position.y += this.velocity; this.velocity += 1;
    if(this.transform.position.y > 1113) {
      setMoney(money+1); audio[6].play();
      renderImage(images[18], new Vector4(this.transform.position.x, this.transform.position.y - 120, 110, 175), 1);
      this.destroyed = true;
    } this.render();
  }
  render() { renderImage(images[16], this.transform, 2); }
}
class Wall extends GameObject {
  constructor() { super(0, 0, 360, 100); this.drag = true; this.maxHealth = 120 * 60; this.health = this.maxHealth; this.collide = false; }

  render() { layers[2].context.globalAlpha = this.health / this.maxHealth; renderImage(images[17], this.transform, 2); layers[2].context.globalAlpha = 1; }

  update() {
    if(pause) return; if(this.drag) {
      this.transform.position.x = mouse.transform.position.x; this.transform.position.y = mouse.transform.position.y;
      if(this.transform.position.x > 1080 - this.transform.size.x / 2) this.transform.position.x = 1080 - this.transform.size.x / 2; if(this.transform.position.x < this.transform.size.x / 2) this.transform.position.x = this.transform.size.x / 2;
      this.drag = mouse.down;
    } else { if(!this.collide & this.health < this.maxHealth) this.health += 40; this.collide = false; }
    this.render();
  }

  collision(other) {
    if(!this.drag & other instanceof Enemy) {
      this.health -= 1; if(this.health <= 0) this.destroyed = true;
      other.transform.position.y = this.transform.position.y - (this.transform.size.y + other.transform.size.y) / 2;
      this.collide = true;
    }
  }
}
