import { angleFrom2Vectors, angleFrom3Points, lengthOfVector, point, subVectors } from "./vector"

class Dot {
    constructor(
        public title: string,
        public x: number,
        public y: number,
        public longText: string = "",
        public color: string = "black",
        public radius: number = 10,
        public linked: Dot[] = [],
        public onscreen: boolean = false
    ) { }
}

function maximizeCanvas() {
    canvas.width = innerWidth
    canvas.height = innerHeight
}

// canvas setup
const canvas = document.getElementById("canvas")! as HTMLCanvasElement
const context = canvas.getContext("2d")!
window.addEventListener("resize", () => { maximizeCanvas() })
Object.assign(canvas.style, { backgroundColor: "white" })
Object.assign(document.body.style, { backgroundColor: "black", margin: 0 })
maximizeCanvas()
context.translate(canvas.width / 2, canvas.height / 2)
// app setup
let dots: Dot[] = []
let possibles = ["a", "b", "c", "q", "peter jackson", "dora"]
createTestDots(50)
function createTestDots(howMany: number) {
    for (let i = 0; i < howMany; i++) {
        let x = (innerWidth / 20) * Math.random()
        let y = (innerHeight / 20) * Math.random()
        let dot = new Dot(possibles[Math.floor(Math.random() * possibles.length)], x, y)
        dots.push(dot)
        if (Math.random() > -0.1) {
            dot.linked.push(dots[Math.floor(Math.random() * dots.length)])
        }
    }
}
let possiblePositions: point[] = [] 
let topPos = {x: 0, y: -400}
let focusedDot = dots[0]
let dt = 0


context.font = "30px Arial"
function animate(tick) {
    context.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height)
    let title = focusedDot.title
    context.fillText(title, topPos.x - context.measureText(title).actualBoundingBoxRight/2, topPos.y)
    for (let i = 0; i < dots.length; i++) {
        let dot = dots[i]
        context.strokeStyle = "black"
        context.beginPath() // side note: this is super needed
        context.ellipse(dot.x, dot.y, dot.radius, dot.radius, 0, 0, 2 * Math.PI)
        dot.linked.forEach((linked) => {
            context.lineTo(linked.x, linked.y)
        })
        context.stroke()
        context.strokeText(dot.title, dot.x, dot.y)
        dot.onscreen = true
    }
    requestAnimationFrame(animate)
    dt = tick - dt
}
requestAnimationFrame(animate)