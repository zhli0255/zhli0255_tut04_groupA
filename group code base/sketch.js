/*第二版
function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();
  noStroke();
}

function draw() {
  drawBackgroundPattern();
  let numCircles = 15;
  
  for (let i = 0; i < numCircles; i++) {
    let x = random(width);
    let y = random(height);
    let maxSize = random(100, 200);
    let type = int(random(3));
    drawDecoratedCircle(x, y, maxSize, type);
  }
}

function drawBackgroundPattern() {
  background(0);
  let bgCircles = 50;
  for (let i = 0; i < bgCircles; i++) {
    fill(random(50, 100), random(50, 100), random(50, 100), 50);
    ellipse(random(width), random(height), random(50, 150));
  }
}

function drawDecoratedCircle(x, y, maxSize, type) {
  let numLayers = int(random(3, 6));
  for (let i = numLayers; i > 0; i--) {
    let size = (maxSize / numLayers) * i;
    fill(randomColor());
    ellipse(x, y, size, size);
    drawCirclePattern(x, y, size, type);
  }
}

function drawCirclePattern(x, y, diameter, type) {
  let numPatterns = int(random(10, 20));
  for (let i = 0; i < numPatterns; i++) {
    let angle = map(i, 0, numPatterns, 0, TWO_PI);
    let px = x + (diameter / 2) * cos(angle);
    let py = y + (diameter / 2) * sin(angle);
    fill(randomColor());
    switch (type) {
      case 0:
        ellipse(px, py, diameter / 10, diameter / 10);
        break;
      case 1:
        rectMode(CENTER);
        rect(px, py, diameter / 10, diameter / 10);
        break;
      case 2:
        triangle(px + diameter / 20, py,
                 px - diameter / 20, py,
                 px, py - diameter / 10);
        break;
    }
  }
}

function randomColor() {
  return color(random(255), random(255), random(255));
}*/


/*第三版
let circles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();
  noStroke();
}

function draw() {
  drawBackgroundPattern();
  let numCircles = 50; // 增加圆的数量
  
  for (let i = 0; i < numCircles; i++) {
    let maxSize = random(100, 200); // 调整圆的大小范围
    let newCircle = createNonOverlappingCircle(maxSize);
    if (newCircle) {
      circles.push(newCircle);
      let type = int(random(3));
      drawDecoratedCircle(newCircle.x, newCircle.y, newCircle.size, type);
    }
  }
}

function drawBackgroundPattern() {
  background(0);
  let bgCircles = 100; // 增加背景圆的数量
  for (let i = 0; i < bgCircles; i++) {
    fill(random(50, 100), random(50, 100), random(50, 100), 50);
    ellipse(random(width), random(height), random(50, 150));
  }
}

function createNonOverlappingCircle(maxSize) {
  let attempts = 0;
  let maxAttempts = 1000;

  while (attempts < maxAttempts) {
    let x = random(width);
    let y = random(height);
    let circle = { x: x, y: y, size: maxSize };

    let overlapping = false;
    for (let c of circles) {
      let d = dist(x, y, c.x, c.y);
      if (d < (c.size / 2 + circle.size / 2)) {
        overlapping = true;
        break;
      }
    }

    if (!overlapping) {
      return circle;
    }

    attempts++;
  }

  return null; // 如果无法找到非重叠的位置，返回null
}

function drawDecoratedCircle(x, y, maxSize, type) {
  let numLayers = int(random(3, 6));
  for (let i = numLayers; i > 0; i--) {
    let size = (maxSize / numLayers) * i;
    fill(randomColor());
    ellipse(x, y, size, size);
    drawCirclePattern(x, y, size, type);
  }
}

function drawCirclePattern(x, y, diameter, type) {
  let numPatterns = int(random(10, 20));
  for (let i = 0; i < numPatterns; i++) {
    let angle = map(i, 0, numPatterns, 0, TWO_PI);
    let px = x + (diameter / 2) * cos(angle);
    let py = y + (diameter / 2) * sin(angle);
    fill(randomColor());
    switch (type) {
      case 0:
        ellipse(px, py, diameter / 10, diameter / 10);
        break;
      case 1:
        rectMode(CENTER);
        rect(px, py, diameter / 10, diameter / 10);
        break;
      case 2:
        triangle(px + diameter / 20, py,
                 px - diameter / 20, py,
                 px, py - diameter / 10);
        break;
    }
  }
}

function randomColor() {
  return color(random(255), random(255), random(255));
}*/

//final
//Defines an empty array circles to store all created circular objects.
let circles = [];

//Defines a Circle class for creating and managing circular objects
class Circle {
  //Constructor that initializes the coordinates, size and type of the circle.
  constructor(x, y, size, type) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.type = type;
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
      //Calculate the Angle of the current pattern
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
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  //Make the draw function execute only once
  noLoop();
  noStroke();
}

function draw() {
  drawBackgroundPattern();
  //Define the number of circles
  let numCircles = 100;
  
  //Loop to create and draw each circle
  for (let i = 0; i < numCircles; i++) {
    //Randomly generate the size of the circle
    let maxSize = random(100, 200);
    //Create a circle that does not overlap
    let newCircle = createNonOverlappingCircle(maxSize);
    //If the circle is successfully created, it is added to the array and drawn
    if (newCircle) {
      circles.push(newCircle);
      //Create the type of number
      let type = int(random(6)); 
      newCircle.type = type;
      newCircle.draw();
    }
  }
}

function drawBackgroundPattern() {
  background(20, 10, 0);
  //Define the number of background circles
  let bgCircles = 100;
  //Loop the background circle
  for (let i = 0; i < bgCircles; i++) {
    fill(randomWarmColor(50));
    ellipse(random(width), random(height), random(50, 150));
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
    let y = random(height);
    //Create a new circle object
    let circle = new Circle(x, y, maxSize);

    //Initializes the overlap
    let overlapping = false;
    //Check for overlaps with existing circles
    for (let c of circles) {
      //Calculate the distance from the center of the circle
      let d = dist(x, y, c.x, c.y);
      //Determine whether to overlap
      if (d < (c.size / 2 + circle.size / 2)) {
        overlapping = true;
        break;
      }
    }

    //If not, return a new circle
    if (!overlapping) {
      return circle;
    }

    //Increase the number of attempts
    attempts++;
  }

  //If a non-overlapping location cannot be found, null is returned
  return null;
}

//Draw polygon
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