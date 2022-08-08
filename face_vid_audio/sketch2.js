var vid0;
var vid1;
var vid2;
var videos = [];
var vid;
var playing = false;

function setup() {
  vid0 = createVideo('/Downloads/video_2.webm');
  vid0.size(1280,720);
  vid0.hide();
  vid1 = createVideo('/Downloads/video_3.webm');
  vid1.size(1280,720);
  vid1.hide();
  vid2 = createVideo('/Downloads/video_4.webm');
  vid2.size(1280,720);
  vid2.hide();
  videos = [vid0, vid1, vid2]

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
  // vid.loop();
  vid.hide();
  
  vid.onended(function() {
      playNextVideo();
             });  

}      