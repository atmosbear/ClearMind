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
let c1 = 1
let c2 = 10
let c3 = 2
let c4 = 0.15
let c5 = 0.002//.002//0.001 * 1 / dots.length
function createTestDots(howMany: number) {
    for (let i = 0; i < howMany; i++) {
        let x = Math.random() * innerWidth - innerWidth / 2
        let y = Math.random() * innerHeight - innerHeight / 2
        let dot = new Dot(possibles[Math.floor(Math.random() * possibles.length)], x, y)
        dots.push(dot)
        if (Math.random() > 0.5) {
            dot.linked.push(dots[Math.floor(Math.random() * dots.length)])
        }
    }
}

function addNonLinkedForce(A: Dot, B: Dot) {
    let distance = lengthOfVector({ x: A.x - B.x, y: A.y - B.y })
    let force = c3 / Math.pow(distance, 2)
    let angle = angleFrom2Vectors(A, B)
    A.x += force * Math.cos(angle) * c4
    A.y += force * Math.sin(angle) * c4
    B.x -= force * Math.cos(angle) * c4
    B.y -= force * Math.sin(angle) * c4

}

function addLinkedForce(A: Dot, B: Dot) {
    let dx = A.x - B.x
    let dy = A.y - B.y
    let basicMagnitudeSpringForce = lengthOfVector({ x: dx, y: dy })
    let angle = angleFrom2Vectors(A, B)
    let editedMagnitudeSpringForce = c1 * Math.log(basicMagnitudeSpringForce / c2)
    A.x -= editedMagnitudeSpringForce * Math.cos(angle) * c4
    A.y -= editedMagnitudeSpringForce * Math.sin(angle) * c4
    B.x += editedMagnitudeSpringForce * Math.cos(angle) * c4
    B.y += editedMagnitudeSpringForce * Math.sin(angle) * c4
}
function addCentralForce(A: Dot) {
    let reverse = { x: -A.x, y: -A.y }
    A.x += reverse.x * c4 * c5
    A.y += reverse.y * c4 * c5

}

let dt = 0
function animate(tick) {
    context.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height)
    for (let i = 0; i < dots.length; i++) {
        let dot = dots[i]
        for (let j = 0; j < dots.length; j++) {
            let dot2 = dots[j]
            if (dot !== dot2) {
                if (dot.linked.includes(dot2) ) {
                    addLinkedForce(dot, dot2)
                } else {
                    addNonLinkedForce(dot, dot2)
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
        dot.linked.forEach((linked) => {
            context.lineTo(linked.x, linked.y)
        })
        context.stroke()
        context.strokeText(dot.title, dot.x, dot.y)
    }
    requestAnimationFrame(animate)
    dt = tick - dt
}
requestAnimationFrame(animate)