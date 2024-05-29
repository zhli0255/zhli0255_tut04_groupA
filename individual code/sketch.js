//Defines an empty array `circles` to store all created circular objects.
let circles = [];
//Defines an empty array `backgroundCircles` to store all created background circular objects.
let backgroundCircles = [];

//Circle class for creating and managing circular objects
class Circle {
  constructor(x, y, size, type) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.type = type;
    //Initial downward velocity
    //This technique is from https://p5js.org/reference/#/p5/createVector
    this.velocity = createVector(0, random(1, 3));
    //Gravity
    this.gravity = createVector(0, 0.1);
  }

  draw() {
    //Randomly generate an integer that determines the number of layers of the circle
    let numLayers = int(random(3, 6));
    //Loop through each layer
    for (let i = numLayers; i > 0; i--) {
      //Calculates the size of the current layer
      let size = (this.size / numLayers) * i;
      //create gradient color
      let gradientColor = lerpColor(randomWarmColor(200), randomWarmColor(200), i / numLayers);
      //Randomly decide whether to fill or stroke
      if (random() > 0.5) {
        fill(gradientColor);
        noStroke();
      } else {
        noFill();
        stroke(gradientColor);
        strokeWeight(2);
      }
      //Draw the circle of the current layer
      ellipse(this.x, this.y, size, size);
      //Draw the pattern of the current layer
      this.drawPattern(size);
    }
  }

  drawPattern(diameter) {
    //A random integer is generated to determine the number of patterns
    let numPatterns = int(random(10, 20));
    //Draw each pattern in a loop
    for (let i = 0; i < numPatterns; i++) {
      //Calculate the angle of the current pattern
      let angle = map(i, 0, numPatterns, 0, TWO_PI);
      //Calculate the X-coordinate of the current pattern
      let px = this.x + (diameter / 2) * cos(angle);
      //Calculate the Y-coordinate of the current pattern
      let py = this.y + (diameter / 2) * sin(angle);
      //Generate the color of the pattern
      let shapeColor = lerpColor(randomWarmColor(200), randomWarmColor(200), i / numPatterns);
      //Set fill color
      fill(shapeColor);
      //Draw different patterns according to the type
      switch (this.type) {
        case 0:
          //Ellipse
          ellipse(px, py, diameter / 10, diameter / 10);
          break;
        case 1:
          //Rectangle
          rectMode(CENTER);
          rect(px, py, diameter / 10, diameter / 10);
          break;
        case 2:
          //Line
          stroke(shapeColor);
          line(this.x, this.y, px, py);
          noStroke();
          break;
        case 3:
          //Polygon
          drawPolygon(px, py, diameter / 20, 6);
          break;
      }
    }
  }

  update() {
    //Update velocity by adding gravity
    this.velocity.add(this.gravity);
    //Update position by adding velocity
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    //Check for collision with bottom of the window
    if (this.y + this.size / 2 > height) {
      //Adjust position to resolve overlap
      this.y = height - this.size / 2;
      //Reverse and reduce vertical velocity to simulate bounce
      this.velocity.y *= -0.5;
    }

    //Check for collision with top of the window
    if (this.y - this.size / 2 < 0) {
      // Adjust position to resolve overlap
      this.y = this.size / 2;
      //Reverse and reduce vertical velocity to simulate bounce
      this.velocity.y *= -0.5;
    }

    //Check for collision with sides of the window
    if (this.x + this.size / 2 > width) {
      //Adjust position to resolve overlap
      this.x = width - this.size / 2;
      //Reverse and reduce horizontal velocity to simulate bounce
      this.velocity.x *= -0.5; 
    }

    if (this.x - this.size / 2 < 0) {
      //Adjust position to resolve overlap
      this.x = this.size / 2
      //Reverse and reduce horizontal velocity to simulate bounce
      this.velocity.x *= -0.5; 
    }

    //Check for collision with other circles
    for (let other of circles) {
      // Skip self-collision check
      if (other !== this) {
        //Calculate distance between the circles
        let d = dist(this.x, this.y, other.x, other.y);
        //Calculate minimum distance to avoid overlap
        let minDist = (this.size + other.size) / 2;
        if (d < minDist) {
          //Adjust position to resolve overlap
          let overlap = minDist - d;
          //Calculates the angle formed by a point, the origin, and the positive x-axis
          //This technique is from https://p5js.org/reference/#/p5/atan2
          let angle = atan2(this.y - other.y, this.x - other.x);
          let shift = createVector(cos(angle), sin(angle)).mult(overlap / 2);
          this.x += shift.x;
          this.y += shift.y;
          other.x -= shift.x;
          other.y -= shift.y;

          //Bounce effect
          let normal = createVector(this.x - other.x, this.y - other.y).normalize();
          //This line calculates the relative velocity between two circles (this and other).
          //The relative velocity is a vector that represents how fast and in what direction one circle is moving relative to the other.
          //This technique is from https://p5js.org/reference/#/p5.Vector
          let relativeVelocity = p5.Vector.sub(this.velocity, other.velocity);
          //This line calculates the component of the relative velocity in the direction of the normal vector between the two circles.
          //This function computes the dot product of the relativeVelocity vector and another vector v.
          //This technique is generated with chatGPT help
          let speed = relativeVelocity.dot(normal);

          if (speed < 0) {
            //Simulating a more realistic collision
            //This technique is generated with chatGPT help
            let impulse = normal.mult(speed * -0.9);
            this.velocity.add(impulse);
            other.velocity.sub(impulse);
          }
        }
      }
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  //Make the draw function execute only once
  noStroke();
  //Initialize background pattern
  createBackgroundPattern();
}

function draw() {
  //Draw background pattern
  drawBackgroundPattern();
  //Draw foreground circles
  drawForegroundCircles();

  //Add a new circle every 30 frames
  if (frameCount % 30 == 0) {
    //Generate random size for the new circle
    let maxSize = random(100, 200);
    //Create a new non-overlapping circle
    let newCircle = createNonOverlappingCircle(maxSize);
    if (newCircle) {
      //Add new circle to the circles array
      circles.push(newCircle);
    }
  }
}

//Create and store background circles' data
function createBackgroundPattern() {
  //Define the number of background circles
  let bgCircles = 100;
  //Loop the background circle
  for (let i = 0; i < bgCircles; i++) {
    backgroundCircles.push({
      x: random(width),
      y: random(height),
      size: random(50, 150),
      baseAlpha: random(50),
      //phase for sin transparency variation
      phase: random(TWO_PI),
      //fixed color
      color: randomWarmColor(200)
    });
  }
}

//Draw the background pattern with blinking effect and slow upward movement
function drawBackgroundPattern() {
  background(20, 10, 0);
  noStroke();
  //Loop to draw each background circle
  for (let circle of backgroundCircles) {
    //Calculate alpha value with sin variation
    let alpha = circle.baseAlpha + 50 * sin(frameCount * 0.05 + circle.phase);
    let circleColor = circle.color;
    circleColor.setAlpha(alpha);
    fill(circleColor);
    //Draw background circle
    ellipse(circle.x, circle.y, circle.size);

    //Move background circle slowly upwards
    let targetY = circle.y - 1;
    circle.y = lerp(circle.y, targetY, 0.1);
    if (circle.y < -circle.size / 2) {
      //Reset background circle position if it moves off-screen
      circle.y = height + circle.size / 2;
    }
  }
}

//Create foreground circles
function drawForegroundCircles() {
  //Loop to update and draw each foreground circle
  for (let circle of circles) {
    circle.update();
    circle.draw();
  }
}

//Create a circle that does not overlap
function createNonOverlappingCircle(maxSize) {
  //Number of initialization attempts
  let attempts = 0;
  //Number of maximum attemps
  let maxAttempts = 1000;
  //Try to create circles that do not overlap
  while (attempts < maxAttempts) {
    let x = random(width);
    let y = random(-height, 0);
    let circle = new Circle(x, y, maxSize, int(random(4)));
    let overlapping = false;
    //Check for overlap with existing circles
    for (let c of circles) {
      let d = dist(x, y, c.x, c.y);
      if (d < (c.size / 2 + circle.size / 2)) {
        overlapping = true;
        break;
      }
    }
    //Return circle if no overlap
    if (!overlapping) {
      return circle;
    }
    attempts++;
  }
  //Return null if maximum attempts exceeded
  return null;
}

// Draw polygon
//The principle of polygon generation is to establish the vertices and then connect the positions of each vertex to form a closed graph
//This technique is from https://p5js.org/reference/#/p5/beginShape
function drawPolygon(x, y, radius, npoints) {
  //Calculate the Angle of each vertex
  let angle = TWO_PI / npoints;
  //Start drawing shapes
  beginShape();
  //Loop over each vertex
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius;
    let sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  //Finish drawing and closing the shape
  endShape(CLOSE);
}

//Generate random warm colors, alpha means the transparency level of a color(0-255)
//This technique is from https://p5js.org/reference/#/p5/alpha 
function randomWarmColor(alpha) {
  //Define a set of warm colors
  let colors = [
    color(255, 102, 102, alpha),
    color(255, 178, 102, alpha),
    color(255, 255, 102, alpha),
    color(255, 153, 102, alpha),
    color(255, 204, 153, alpha)
  ];
  //Randomly return a warm color
  return colors[int(random(colors.length))];
}

// Handle window resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  createBackgroundPattern();
}
