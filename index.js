// Fetch canvas element
const canvas = document.querySelector('canvas')
// Gets the context (basically the 2d api to draw things)
const c = canvas.getContext('2d')

// Change canvas properties
canvas.width = 512
canvas.height = 512

// Create white background
c.fillStyle = 'white'
c.fillRect(0,0,canvas.width, canvas.height)

// Define image object and assign source
const image = new Image()
image.src = "./assets/Village.png"

// Since image is big and requires some time to load, call the draw function only when it is loaded
image.onload = () => {
    c.drawImage(image,0,0)
}
