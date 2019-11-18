const video = document.getElementById('video')
var detection;
var age;

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models'),
  faceapi.nets.ageGenderNet.loadFromUri('/models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = {width: video.width, height : video.height}
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    detection = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({inputSize: 160})).withFaceLandmarks().withAgeAndGender()
    const resizedDetection = faceapi.resizeResults(detection, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetection)
    age = detection.age;
  },100)
})
