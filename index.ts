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
// app setup
let dots: Dot[] = []
let possibles = ["a", "b", "c", "q", "peter jackson", "dora"]
createTestDots(10)
function createTestDots(howMany: number) {
    for (let i = 0; i < howMany; i++) {
        let x = innerWidth / 2 + 300 * Math.random() - 150
        let y = innerHeight / 2 + 300 * Math.random() - 150
        dots.push(new Dot(possibles[Math.floor(Math.random() * possibles.length)], x, y))
    }
}


function mutatePos(A: Dot, B: Dot, dt) {
    let dx = A.x - B.x
    let signX = Math.sign(dx)
    let dy = A.y - B.y
    let signY = Math.sign(dy)
    let c1 = 1
    let c2 = 1
    let d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
    // let angle = Math.
    let springForce = c1 * Math.log(d / c2)
    dx += springForce

    //central
    dx = A.x - innerWidth / 2
    dy = A.y - innerHeight / 2
    signX = Math.sign(dx)
    signY = Math.sign(dy)
    let centralForceX = Math.abs(dx) * signX
    let centralForceY = Math.abs(dy) * signY
    A.x -= centralForceX * 0.001
    A.y -= centralForceY * 0.001
    // B.x -= centralForceX
    // B.y -= centralForceY
}

let dt = 0
function animate(tick) {
    context.clearRect(0, 0, canvas.width, canvas.height)
    for (let i = 0; i < dots.length; i++) {
        let dot = dots[i]
        for (let j = 0; j < dots.length; j++) {
            // define dots
            let dot2 = dots[j]
            if (dot !== dot2) {
                // calculate physics
                mutatePos(dot, dot2, dt)
            }
        }
    }
    for (let i = 0; i < dots.length; i++) {
        let dot = dots[i]


        // draw
        if (dot.x > innerWidth || dot.x < 0) {
            dot.x = innerWidth * Math.random()
        }
        if (dot.y > innerHeight || dot.y < 0) {
            dot.y = innerHeight * Math.random()
        }
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