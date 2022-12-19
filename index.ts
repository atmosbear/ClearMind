class Dot {
    constructor(
        public title: string,
        public x: number,
        public y: number,
        public longText: string = "",
        public color: string = "black",
        public radius: number = 15,
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
createTestDots(100)
function createTestDots(howMany: number) {
    for (let i = 0; i < howMany; i++) {
        let x = i
        let y = i
        dots.push(new Dot("", x, y))
    }
}

function animate(tick) {
    context.clearRect(0, 0, canvas.width, canvas.height)
    dots.forEach(dot => {
        context.beginPath() // side note: this is super needed
        context.strokeStyle = dot.color
        context.ellipse(dot.x, dot.y, dot.radius, dot.radius, 0, 0, 2 * Math.PI)
        context.stroke()
    })
    dots.forEach(dot => {
        dot.x += 1
        dot.y += 1
    })
    requestAnimationFrame(animate)
}
requestAnimationFrame(animate)