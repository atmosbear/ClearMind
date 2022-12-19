class Dot {
    constructor(
        public title: string,
        public x: number,
        public y: number,
        public longText: string = "",
        public color: string = "black",
        public radius: number = 10,
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
createTestDots(1000)
function createTestDots(howMany: number) {
    for (let i = 0; i < howMany; i++) {
        let x = innerWidth * Math.random()
        let y = innerHeight * Math.random()
        dots.push(new Dot(possibles[Math.floor(Math.random() * possibles.length)], x, y))
    }
}

function mutatePos(A: Dot, B: Dot) {
    let dx = Math.sqrt(Math.abs(A.x - B.x))
    A.x += dx
    B.x += -dx
}

function animate(tick) {
    context.clearRect(0, 0, canvas.width, canvas.height)
    for (let i = 0; i < dots.length; i++) {
        let dot = dots[i]
        for (let j = 0; j < dots.length; j++) {
            // define dots
            let dot2 = dots[j]
            if (dot !== dot2) {
                // calculate physics
                mutatePos(dot, dot2)
            }
        }
    }
    for (let i = 0; i < dots.length; i++) {
        let dot = dots[i]


        // draw
        if (dot.x > innerWidth) {
            dot.x = innerWidth * Math.random()
        }
        if (dot.y > innerHeight) {
            dot.y = innerHeight * Math.random()
        }
        context.strokeStyle = "black"
        context.beginPath() // side note: this is super needed
        context.ellipse(dot.x, dot.y, dot.radius, dot.radius, 0, 0, 2 * Math.PI)
        context.stroke()
        context.strokeText(dot.title, dot.x, dot.y)
    }
    requestAnimationFrame(animate)
}
requestAnimationFrame(animate)