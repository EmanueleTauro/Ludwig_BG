class Boundary {
  static width = 32;
  static height = 32;
  constructor({ position }) {
    this.position = position;
    this.width = 32;
    this.height = 32;
  }

  draw() {
    c.fillStyle = "rgba(255,0,0,0)";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

class Interaction {
  static width = 32;
  static height = 32;
  constructor({ position, type }) {
    this.position = position;
    this.width = 32;
    this.height = 32;
    this.type = type; // Defines the type of interaction
  }

  draw() {
    c.fillStyle = "rgba(0,255,0,1)";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

class Sprite {
  constructor({ position, speed, image, frames = { max: 1 }, sprites }) {
    this.position = position;
    this.image = image;
    this.frames = { ...frames, val: 0, elapsed: 0 };
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    };
    this.moving = false;
    this.sprites = sprites;
    this.speed = speed;
  }

  draw() {
    c.drawImage(
      this.image,
      this.frames.val * this.width, // x left crop start
      0, // y top crop start
      this.image.width / this.frames.max, // crop width
      this.image.height, // crop height
      this.position.x, // X spawn
      this.position.y, // Y spawn
      this.image.width / this.frames.max, // image rendered width
      this.image.height // image rendered height
    );

    if (!this.moving) return;

    if (this.frames.max > 1) {
      this.frames.elapsed++;
    }
    if (this.frames.elapsed % 10 === 0) {
      if (this.frames.val < this.frames.max - 1) {
        this.frames.val++;
      } else this.frames.val = 0;
    }
  }
}
