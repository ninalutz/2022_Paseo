function setup() {
createCanvas(300, 300);
text("Loading the video...", 20, 20);

vidElement = createVideo("sample_video.mp4", afterLoad);
vidElement.position(20, 20);
vidElement.size(300);
}

function afterLoad() {
text("The video has finished loading and will"+
						" now play!", 20, 40);
vidElement.play();
}