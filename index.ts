import { angleFrom2Vectors, angleFrom3Points, lengthOfVector, subVectors } from "./vector"

class Dot {
    constructor(
        public title: string,
        public x: number,
        public y: number,
        public longText: string = "",
        public color: string = "black",
        public radius: number = 10,
        public linked: Dot[] = []
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
createTestDots(20)
function createTestDots(howMany: number) {
    for (let i = 0; i < howMany; i++) {
        let x = Math.random() * innerWidth - innerWidth / 2
        let y = Math.random() * innerHeight - innerHeight / 2
        dots.push(new Dot(possibles[Math.floor(Math.random() * possibles.length)], x, y))
    }
}

function addLinkedForce(A: Dot, B: Dot, dt: number) {
    let dx = A.x - B.x
    let dy = A.y - B.y
    let c1 = 1
    let c2 = 10000
    let basicMagnitudeSpringForce = lengthOfVector({ x: dx, y: dy })
    let angle = angleFrom2Vectors(A, B)
    let editedMagnitudeSpringForce = c1 * Math.log(basicMagnitudeSpringForce / c2)
    A.x -= editedMagnitudeSpringForce * Math.cos(angle)
    A.y -= editedMagnitudeSpringForce * Math.sin(angle)
    B.x += editedMagnitudeSpringForce * Math.cos(angle)
    B.y += editedMagnitudeSpringForce * Math.sin(angle)
}
function addCentralForce(A: Dot) {
    let reverse = { x: -A.x, y: -A.y }
    A.x += reverse.x * 0.01
    A.y += reverse.y * 0.01

}

let dt = 0
function animate(tick) {
    context.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height)
    for (let i = 0; i < dots.length; i++) {
        let dot = dots[i]
        for (let j = 0; j < dots.length; j++) {
            let dot2 = dots[j]
            if (dot !== dot2) {
                if (dot.linked.includes(dot2) || dot.linked.includes(dot)) {
                    addLinkedForce(dot, dot2, dt)
                }
            }
            addCentralForce(dot) // not sure if this should be here, or within the outer loop instead
        }
    }
    for (let i = 0; i < dots.length; i++) {
        let dot = dots[i]
        context.strokeStyle = "black"
        context.beginPath() // side note: this is super needed
        context.ellipse(dot.x, dot.y, dot.radius, dot.radius, 0, 0, 2 * Math.PI)
        context.stroke()
        context.strokeText(dot.title, dot.x, dot.y)
    }
    requestAnimationFrame(animate)
    dt = tick - dt
}
requestAnimationFrame(animate)