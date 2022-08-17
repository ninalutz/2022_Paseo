var vid0;
var vid1;
var vid2;
var videos = [];
var vid;
var playing = false;
var audio;

function setup() {
  vid0 = createVideo('/Downloads/test.webm');
  audio = loadSound('/Downloads/audio_test.wav');

  createCanvas(windowWidth, windowHeight);
  vid0.hide();
  videos = [vid0]

  createCanvas(windowWidth, windowHeight);
}


function draw(){
if(playing){
  let img = vid.get();
  image(img, 0, 0); // redraws the video frame by frame in   
}
}

function keyPressed(){
	playNextVideo();
	playing = true;

}

function playNextVideo() {
  var randomInt = Math.floor(Math.random() * videos.length);
  console.log(randomInt)
  vid =  videos[randomInt];
  
  vid.play();
  audio.play();
  // vid.loop();
  vid.hide();
  
  vid.onended(function() {
      playNextVideo();
             });  

}      