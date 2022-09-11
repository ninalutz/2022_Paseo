//Config for video
var VTX = outer_mouth_landmarks;

var facemeshModel = null; // this will be loaded with the facemesh model
                          // WARNING: do NOT call it 'model', because p5 already has something called 'model'

var videoDataLoaded = false; // is webcam capture ready?

var statusText = "Loading facemesh model...";

var myFaces = []; // faces detected in this browser
                  // currently facemesh only supports single face, so this will be either empty or singleton
var capture; // webcam capture, managed by p5.js

//scale fro drawing the dots in the bounds
var scale_factor = 2;
var margin_factor = 8;

var min_x, max_x, min_y, max_y; 

var drawing_canvas_width = 1280;
var drawing_canvas_height = 720;

var animation_max = 4; //number of filters
var animation_type = 4;
var opacity = 255;

//timer variables
const minimumTime = 2;
const maxRecordTime = 60;
const minimumThankTime = 3;
var timeThanks;
var timeRecording;
var minimumPress = minimumTime;
var maxPress = maxRecordTime;
var canSaveRecording = false;

var state = 1;

var sent_message = false;

//const for animation 4
var start_delta = 0;
var delta_change = 0.005;


//state 1 = Press the button
//state 2 = prompt to record
//state 3 = recording
//state 4 = thanks/end 
///Animations
var x1, y1;

let hue = 0;

// Load the MediaPipe facemesh model assets.
facemesh.load().then(function(_model){
  statusText = "Model loaded."
  facemeshModel = _model;
})

//Config for recording
var btn = document.querySelector('button');
var  chunks = [];
let mic, soundRecorder, soundFile;
var videoRecordIndex = 10;
var recording = false;
var debug = false;
let handshake ='1';

function setup() {

  configSound();
  btn = document.querySelector('button');
  btn.onclick = recordVideo;

  createCanvas(windowWidth, windowHeight);

  registerServiceWorker('service-worker.js');

  listenMessage(function(incomingData){
  handshake = incomingData.message;
  });


  min_x = width/margin_factor;
  max_x = (margin_factor-1)*width/margin_factor;
  min_y = height/margin_factor;
  max_y = ((margin_factor-1)*height)/margin_factor;



  capture = createCapture(VIDEO);
  
  // capture = createVideo("test.mov");

  // this is to make sure the capture is loaded before asking facemesh to take a look
  // otherwise facemesh will be very unhappy
  capture.elt.onloadeddata = function(){
    // console.log("video initialized");
    videoDataLoaded = true;
  }
  
  capture.hide();

  background(0);
}

var sent_file;

function draw() {

// model and video both loaded, 
  if (facemeshModel && videoDataLoaded){ 
    facemeshModel.estimateFaces(capture.elt).then(function(_faces){
    myFaces = _faces.map(x=>packFace(x,VTX)); // update the global myFaces object with the detected faces

      if (!myFaces.length){
        // haven't found any faces
        statusText = "Show some faces!"
      }else{
        // display the confidence, to 3 decimal places
        statusText = "Confidence: "+ (Math.round(_faces[0].faceInViewConfidence*1000)/1000) + "   Frame Rate: " + int(frameRate());
      }
      
    })
  }
  

  if(state !=4){
  background(0, opacity);
  stroke(255, 0, 255);
  drawFaces(myFaces);
  colorMode(RGB);
  }

  if(state == 1){
    drawState1();
  }

  if(state == 2){
    drawState2();
  }

  if(state == 3){
    drawState3();
  }

  if(state == 4){
    drawThanks();
  }

  if(debug){
    drawDebug();
  }


    //this is the default handshake 
  if(handshake){
    //nothing here
  }
  else{
    if(handshake == ''){
      // console.log("Sending last video");
      sendMessage(last_sent_video);
      sent_message = false;
    }

    if(handshake == last_sent_video && !sent_message){
      sendMessage('not_recording');
      sent_message = true;
    }
  }


}

function drawState1(){
  if(!sent_message){
    // console.log("sending not recording in state 1")
    sendMessage('not_recording');
    sent_message = true;
  }
    textSize(100)
    textAlign(CENTER);
    fill(0, 255, 255);
    noStroke();
    text("Press the button",width/2, height/2)
}

function drawState2(){
    textSize(70)
    textAlign(CENTER);
    fill(0, 255, 255);
    noStroke();
    text("How have you transformed since 2020?", width/2, height/2-100);

    textSize(60);
    text("When you're ready, press the button", width/2, height/2 + 30);
    text("to record your answer.", width/2, height/2 + 90);
}

function drawState3(){
    textSize(70)
    textAlign(CENTER);
    fill(0, 255, 255);
    noStroke();
    text("Press button when you are done", width/2, 100);

    if (frameCount % 60 == 0 && minimumPress > 0) { // if the frameCount is divisible by 60, then a second has passed. it will stop at 0
      minimumPress --;
      if(minimumPress == 0){
        canSaveRecording = true;
        console.log("Can save recording")
      }
    }

}

function drawThanks(){

  fill(0)
  rect(0, 0, width, height/4);
  if (frameCount % 60 == 0 && timeThanks > 0) { // if the frameCount is divisible by 60, then a second has passed. it will stop at 0
    timeThanks --;
    textSize(200)
    textAlign(CENTER);
    fill(0, 255, 255);
    noStroke();
    text("Thanks!",width/2, height/2)
  }
  if (timeThanks == 0) {
    fill(0, 255, 255);
    sent_message = false;
    state = 1;
    btn.click();
    console.log("Thanks timer out")
    //reset recording minimums
    canSaveRecording = false;
    minimumPress = minimumTime;
  }
}

function drawDebug(){
  textAlign(LEFT)
    noFill();
    stroke(255, 0, 0);
    strokeWeight(10);
    rect(min_x, min_y, max_x - min_x, max_y-min_y);


    fill(0);
    rect(0, 0, width/2, 100);
    fill(255, 0,0);
    strokeWeight(1);
    textSize(14);
    text(statusText,20,90);
    text('Video/audio clip: ' + videoRecordIndex.toString() + '    Recording: ' + recording + '    state: ' + state,20, 60);

    if(recording){
      fill(255, 0, 0);
      text("Recording! Press button or '2' to stop and save",20,30);
    }
    else{
      fill(255, 255, 0);
      text("Press button or '2' to start recording your answer to this question: ", 20, 30);
    }

}


// draw a face object returned by facemesh
function drawFaces(faces,filled){

  for (var i = 0; i < faces.length; i++){
    const keypoints = faces[i].scaledMesh;

    for (var j = 0; j < keypoints.length; j++) {
      const [x, y, z] = keypoints[j];
      var mapped_x = map(x*scale_factor, 0, 640, min_x, max_x, false);
      var mapped_y = map(y*scale_factor, 0, 320, min_y, max_y, false);
      
      if(animation_type == 0){
        drawAnimation0(mapped_x, mapped_y)
      }

      if(animation_type == 1){
        drawAnimation1(mapped_x, mapped_y, keypoints, j)
      }

      if(animation_type == 2){
        drawAnimation2(mapped_x, mapped_y, keypoints, j)        
      }


      if(animation_type == 3){
        opacity = 25;
        fill(0, 255, 255);
        noStroke();
        circle(mapped_x - drawing_canvas_width/2, mapped_y - drawing_canvas_height/2, 5*scale_factor);
      }

      if(animation_type == 4){
        drawAnimation4(mapped_x, mapped_y, keypoints, j);
      }


    }
  }
}

// reduces the number of keypoints to the desired set 
function packFace(face,set){
  var ret = {
    scaledMesh:[],
  }
  for (var i = 0; i < set.length; i++){
    var j = set[i];
    ret.scaledMesh[i] = [
      face.scaledMesh[j][0],
      face.scaledMesh[j][1],
      face.scaledMesh[j][2],
    ]
  }
  return ret;
}


function drawAnimation0(mapped_x, mapped_y){
 fill(0, 200, 0);
  noStroke();

  opacity = 255;
  circle(mapped_x - drawing_canvas_width/2, mapped_y - drawing_canvas_height/2, 3*scale_factor);
}

function drawAnimation1(mapped_x, mapped_y, keypoints, j){  
  opacity = 255;
  fill(255);
  stroke(255);
  strokeWeight(0.5)
  circle(mapped_x - drawing_canvas_width/2, mapped_y - drawing_canvas_height/2, 5*scale_factor, 5*scale_factor);
  const [x2, y2, z2] = keypoints[min(j+int(random(1, keypoints.length)), keypoints.length-1)];

  var mapped_x2 = map(x2*scale_factor, 0, 640, min_x, max_x, false);
  var mapped_y2 = map(y2*scale_factor, 0, 320, min_y, max_y, false);

  line(mapped_x - drawing_canvas_width/2, mapped_y - drawing_canvas_height/2, mapped_x2 - drawing_canvas_width/2, mapped_y2 - drawing_canvas_height/2);
}


function drawAnimation4(mapped_x, mapped_y, keypoints, j){  
  opacity = 255;


  stroke(0, start_delta*2, 255);
  strokeWeight(5)
  if(start_delta > 100){
    start_delta = 0;
    // delta_change*=-1;
  }
  // if(start_delta <=0){
  //   start_delta = 0;
  //   delta_change*=-1;
  // }

  line(mapped_x - drawing_canvas_width/2, mapped_y - drawing_canvas_height/2, mapped_x - drawing_canvas_width/2, mapped_y - drawing_canvas_height/2 + start_delta);
  circle(mapped_x - drawing_canvas_width/2, mapped_y - drawing_canvas_height/2 + start_delta, 2*scale_factor, 2*scale_factor)


  fill(0, 0, 255);
  stroke(0, 0, 255);
  circle(mapped_x - drawing_canvas_width/2, mapped_y - drawing_canvas_height/2, 5*scale_factor, 5*scale_factor);
  start_delta += delta_change;

}

function drawAnimation2(mapped_x, mapped_y, keypoints, j){
  opacity = 15;
  colorMode(HSB);
  hue += 0.05;
  if (hue > 255) {
    hue = 0;
  }
  stroke(hue, 255, 255);
  strokeWeight(10);
  strokeJoin(ROUND);
  strokeCap(ROUND)
  if(j<keypoints.length-1){
   x1 = keypoints[j+1][0]
   y1 = keypoints[j+1][1]
  }
  else{
   x1 = keypoints[0][0]
   y1 = keypoints[0][1]
  }

  var mapped_x1 = map(x1*scale_factor, 0, 640, min_x, max_x, false);
  var mapped_y1 = map(y1*scale_factor, 0, 320, min_y, max_y, false);
  line(mapped_x - drawing_canvas_width/2, mapped_y - drawing_canvas_height/2, mapped_x1 - drawing_canvas_width/2, mapped_y1 - drawing_canvas_height/2);

}


function recordVideo() {
  // console.log("RECORDING")
  chunks.length = 0;
  chunks = []
  let stream = document.querySelector('canvas').captureStream(30),
  recorder = new MediaRecorder(stream);

  recorder.ondataavailable = e => {
    if (e.data.size) {
      chunks.push(e.data);
    }
  };
  recorder.onstop = exportVideo;
  btn.onclick = e => {
    recorder.stop();
    soundRecorder.stop();
    btn.textContent = 'start recording';
    recording = false;
    btn.onclick = recordVideo;
    videoRecordIndex += 1;
  };
  recorder.start();
  soundRecorder.record(soundFile);
  btn.textContent = 'stop recording';
  recording = true;
  if(!sent_message){
    sendMessage('recording');
    sent_message = true;
    console.log('SENT RECORDING');

  }
}

var soundTest;
var last_sent_video = '';

function saveAudio(index){
  saveSound(soundFile, 'audio_' + index.toString() +'.wav');
  console.log("Saved audio: " + index.toString());
}

async function downloadVideo() {
  try{
    saveAudio(videoRecordIndex-1);
  } 
  catch(error){}
  var xhr = new XMLHttpRequest();
  var vid_link =  document.querySelector('myvideo' + videoRecordIndex.toString()).src;
  xhr.open('GET', vid_link, true);
  xhr.responseType = 'blob';
  xhr.onload = function() {
    var urlCreator = window.URL || window.webkitURL;
    var imageUrl = urlCreator.createObjectURL(this.response);
    var tag = document.createElement('a');
    tag.href = imageUrl;
    tag.target = '_blank';
    tag.download = 'video_' + videoRecordIndex.toString() + '.webm';
    console.log("Saved video: " + videoRecordIndex.toString());
    document.body.appendChild(tag);
    tag.click();
    document.body.removeChild(tag);
  };
  xhr.onerror = err => {
    alert('Failed to download picture');
  };
  xhr.send();

  //helps to send at a later time
  if((videoRecordIndex) %2 == 0){
    //get the odd before that we know exists 
     sendFile(videoRecordIndex-3);
  }

}

function sendFile(index){
  last_sent_video = 'a_'+(index).toString();
  handshake = ''; //to catch if first a isn't caught to resend
  sendMessage(last_sent_video);
  console.log("Sent new file: " + last_sent_video);
}

function exportVideo(e) {
  var blob = new Blob(chunks);
  var vid = document.createElement('myvideo' + videoRecordIndex.toString());
  vid.id = 'recorded'
  vid.controls = true;
  vid.src = URL.createObjectURL(blob);
  document.body.appendChild(vid);
  downloadVideo();
}


function configSound(){

  userStartAudio();

  // create an audio in
  mic = new p5.AudioIn();

  // prompts user to enable their browser mic
  mic.start();

  // create a sound recorder
  soundRecorder = new p5.SoundRecorder();

  // connect the mic to the recorder
  soundRecorder.setInput(mic);

  // this sound file will be used to
  // playback & save the recording
  soundFile = new p5.SoundFile();

  userStartAudio();
}



function keyPressed(){
  //2 -- the key button
  if(keyCode == 50){


      //only incremenet if canSaveRecording
      if(state == 3 && !canSaveRecording){
        console.log("Can't move past record yet")
        return false;
      }

      //Never allow movement from thanks
      if(state == 4){
        console.log("Can't move out of thanks")
        return false;
      }

      if(state != 3){
        fill(0, 0, 0, 255);
        rect(0, 0, width, height);
      }

      state += 1;


      if(state == 3 || state == 4){
        btn.click();
        console.log("Clicking button")
      }
      if(state == 2){
        sent_message = false;
      }
      if(state == 4){
        timeThanks = minimumThankTime;
        console.log("Thanks entered")
        animation_type = int(random(1, animation_max+1));
        btn.click();
      }
      if(state > 4){
        state = 1;
      } 
      
  }

  //these are all visual buttons
  //z
  if(keyCode == 90){
    debug = !debug;
  }
  //a
  if(keyCode == 65){
    animation_type = 0;
  }
  //s
  if(keyCode ==83){
    animation_type = 1;
  }
  //d
  if(keyCode == 68){
    animation_type = 2;
  }
  //f
  if(keyCode == 70){
    animation_type = 3;
  }
  if(keyCode == 71){
    animation_type = 4;
  }

}