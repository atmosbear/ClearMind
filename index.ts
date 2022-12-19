import { point } from "./vector"

class Dot {
    constructor(
        public title: string,
        public x: number,
        public y: number,
        public longText: string = "",
        public color: string = "black",
        public radius: number = 10,
        public linked: Dot[] = [],
        public onscreen: boolean = false,
        public shouldBeVisible: boolean = false
    ) { }
}

function maximizeCanvas(canvas: HTMLCanvasElement) {
    canvas.width = innerWidth
    canvas.height = innerHeight
}

function setupCanvas() {
    const canvas = document.getElementById("canvas")! as HTMLCanvasElement
    const context = canvas.getContext("2d")!
    window.addEventListener("resize", () => { maximizeCanvas(canvas) })
    Object.assign(canvas.style, { backgroundColor: "white" })
    Object.assign(document.body.style, { backgroundColor: "black", margin: 0 })
    maximizeCanvas(canvas)
    context.translate(canvas.width / 2, canvas.height / 2)
    return canvas
}
const canvas = setupCanvas()
const context = canvas.getContext("2d")!
// app setup
let dots: Dot[] = []
let possibles = ["a", "b", "c", "q", "peter jackson", "dora"]
createTestDots(50)
window.addEventListener("contextmenu", (e: MouseEvent) => {
    e.preventDefault()
    let menu = document.getElementById("menu")
    if (!menu) {
        // create menu
        let menu = document.createElement("div")
        menu.id = "menu"
        Object.assign(menu.style, { position: "absolute", padding: "10px", width: "200px", height: "300px", backgroundColor: "red", top: e.clientY + "px", left: e.clientX + "px" })
        document.body.appendChild(menu)
        let createButton = document.createElement("button")
        createButton.innerText = "Create Dot"
        menu.appendChild(createButton)
    } else {
        Object.assign(menu.style, {display: "block", top: e.clientY + "px", left: e.clientX + "px" })
    }
})
window.addEventListener("click", (e) => {
    console.log(e)
    if (e.button === 0) {
        let m = document.getElementById("menu")
        if (m) {
            m.style.display = "none"
        }
    }
})
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
function newPos() {
    dots.forEach(dot => {
        dot.shouldBeVisible = focusedDot.linked.includes(dot)
    })
    dots.forEach((dot, i) => {
        dot.x = possiblePositions[i].x
        dot.y = possiblePositions[i].y
    })
}
let possiblePositions: point[] = []
let howMany = Math.sqrt(dots.length)
for (let i = 0; i < howMany; i++) {
    let x = (innerWidth / 3.5 * 1 / Math.sqrt(howMany) * i) - innerWidth / 3
    for (let j = 0; j < howMany; j++) {
        let y = (innerHeight / 3.5 * 1 / Math.sqrt(howMany) * j) - innerHeight / 3
        possiblePositions.push({ x, y })
    }
}
let topPos = { x: 0, y: -400 }
let focusedDot = dots[10]
let dt = 0
context.font = "30px Arial"
newPos()
function drawDot(dot: Dot) {
    context.strokeStyle = "black"
    context.ellipse(dot.x, dot.y, dot.radius, dot.radius, 0, 0, 2 * Math.PI)
    context.strokeText(dot.title, dot.x, dot.y)
}
function animate(tick) {
    context.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height)
    let title = focusedDot.title
    context.fillText(title, topPos.x - context.measureText(title).actualBoundingBoxRight / 2, topPos.y)

    dots.forEach(dot => {
        if (dot.shouldBeVisible) {
            context.beginPath() // side note: this is super needed
            drawDot(dot)
            dot.linked.forEach((linked) => {
                context.lineTo(linked.x, linked.y)
                drawDot(linked)
                linked.linked.forEach(linked2 => {
                    context.lineTo(linked2.x, linked2.y)
                    drawDot(linked2)
                })
            })
        }
    })
    context.stroke()
    requestAnimationFrame(animate)
    dt = tick - dt
}
requestAnimationFrame(animate)