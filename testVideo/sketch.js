let vid;
let playing = true;

function setup() {
  createCanvas(1280, 720);

  vid = createVideo("test.mov");
  vid.size(1280, 720);
  vid.volume(0);
  vid.loop();
  vid.hide(); 

}

function draw() {
  background(220);
  let img = vid.get();
  image(img, 0, 0); // redraws the video frame by frame in   
}

