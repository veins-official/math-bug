let dif = 0;

class EnemyGenerator extends GameObject {
  constructor() {
    super(0, 0, 0, 0); this.c = 0; this.timeout = 3; this.animations = [];
    this.u = 0; this.hard = false;
    this.animations.push([]); for (let i = 0; i < 3; i++) { const img = new Image(); img.src = dir+"enemies/bug"+i+".png"; this.animations[0].push(img); } const img = new Image(); img.src = dir + "enemies/bug1.png"; this.animations[0].push(img);
    this.animations.push([]); for (let i = 0; i < 4; i++) { const img = new Image(); img.src = dir+"enemies/frog"+i+".png"; this.animations[1].push(img); }
    this.animations.push([]); for (let i = 0; i < 4; i++) { const img = new Image(); img.src = dir+"enemies/dog"+i+".png"; this.animations[2].push(img); }
    this.animations.push([]); for (let i = 0; i < 4; i++) { const img = new Image(); img.src = dir+"enemies/boss"+i+".png"; this.animations[3].push(img); }
  }
  update() {
    if(pause) return; if(dif * 0.5 < 2.5) this.timeout = 3 - dif * 0.5;
    if(!this.hard) { this.u += 1; dif += 0.0005; }
    this.c++; if(this.c >= this.timeout * 60) {
      let rand = random() * 100;
      switch (true) {
        case (rand < 60):
          objects.push(new Bug(new Animation(this.animations[0], 10)));
          break;
        case (rand < 80):
          objects.push(new Frog(new Animation(this.animations[1], 10)));
          break;
        case (rand < 90):
          objects.push(new Dog(new Animation(this.animations[2], 10)));
          break;
        case (rand < 100):
          objects.push(new MiniBug(new Animation(this.animations[0], 20)));
          break;
        default:
          objects.push(new Bug(new Animation(this.animations[0], 10)));
      }
      this.c = 0;
    }
    if(this.u >= 60 * 180) { this.u = 0; this.hard = true; audio[1].pause(); audio[2].play(); objects.push(new BigBug(new Animation(this.animations[3], 7))); }
  }

  easy() { this.hard = false; dif -= 3.4; audio[2].pause(); audio[2].currentTime = 0; audio[1].currentTime = 0; audio[1].play(); }
}

class Enemy extends GameObject {
  constructor(width, height, health, animation) {
    super(float2int(random() * (1080 - width) + width / 2), height / -2, width, height);
    this.health = health; this.animation = animation; this.alfa = 1; this.dir = 0;
  }

  update() {
    if(pause) return; if(this.transform.position.y > 1080 + this.transform.size.y / 2) { gameOver(); this.destroyed = true; }
    this.alfa += this.dir; if(this.alfa <= 0) this.dir = 0.05; else if(this.alfa >= 1) this.dir = 0;
    this.animation.update(); this.enemyUpdate(); this.render();
  }

  render() { layers[2].context.globalAlpha = abs(this.alfa); renderImage(this.animation.image, this.transform, 2); layers[2].context.globalAlpha = 1; }

  damage(dmg) {
    this.health -= dmg; if(this.health <= 0) {
      audio[5].play(); this.destroyed = true; if(this.dead != null) this.dead();
      renderImage(blood[float2int(random() * blood.length)], new Vector4(this.transform.position.x, this.transform.position.y, this.transform.size.x, this.transform.size.x), 1);
      if(random() * 100 <= 10) objects.push(new Coin(this.transform.position.x, this.transform.position.y));
    }
    this.dir = -0.05;
  }

  collision(other) { }
}

class Bug extends Enemy { constructor(animation) { super(100, 100, 3, animation); } enemyUpdate() { this.transform.position.y += 1.6 + dif; } }

class Frog extends Enemy {
  constructor(animation) { super(200, 150, 5, animation); }
  enemyUpdate() { this.transform.position.y += 0.5 + dif/10; }
  collision(other) { if(other.constructor.name === "Wall" & other.transform.position.y >= 0) other.transform.position.y -= 0.1 + dif/20; }
}

class Dog extends Enemy {
  constructor(animation) { super(150, 150, 3, animation); }
  enemyUpdate() {
    this.transform.position.y += 1.6 + dif;
    renderImage(images[8], new Vector4(this.transform.position.x, this.transform.position.y+20-50 * (this.health/3), 100*(this.health/3), 100*(this.health/3)), 2);
    if(this.health < 3) this.health += 0.001 + dif/1000;
  }
}

class BigBug extends Enemy { constructor(animation) { super(1000, 1000, 30, animation); this.transform.position.x = 540; } enemyUpdate() { this.transform.position.y += 0.5; } collision(other) { if(other.constructor.name === "Wall" & !other.drag) other.health = 0; } dead() { objects[3].easy(); for (let i = 0; i < 33; i++) { objects.push(new Coin(this.transform.position.x, this.transform.position.y));; } } }

class MiniBug extends Enemy { constructor(animation) { super(50, 50, 1, animation); } enemyUpdate() { this.transform.position.y += 10 + dif; } }
