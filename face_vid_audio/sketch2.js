var vid0;
var vid1;
var vid2;
var videos = [];
var vid;
var playing = false;
var audio;

function setup() {
  vid0 = createVideo('/Downloads/video_3 (1).webm');
  audio = loadSound('/Downloads/audio_2 (1).wav');

  vid0.size(1280,720);
  vid0.hide();
  videos = [vid0]

  createCanvas(1280, 720)
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