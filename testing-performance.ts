// class Dot {
//     constructor(
//         public title: string,
//         public x: number,
//         public y: number,
//         public longText: string = "",
//         public color: string = "black",
//         public radius: number = 15,
//     ) { }
// }

// function maximizeCanvas() {
//     canvas.width = innerWidth
//     canvas.height = innerHeight
// }


// // canvas setup
// const canvas = document.getElementById("canvas")! as HTMLCanvasElement
// const context = canvas.getContext("2d")!
// window.addEventListener("resize", () => { maximizeCanvas() })
// Object.assign(canvas.style, { backgroundColor: "white" })
// Object.assign(document.body.style, { backgroundColor: "black", margin: 0 })
// maximizeCanvas()
// // app setup
// let dots: Dot[] = []
// let possibles = ["a", "b", "c", "q", "peter jackson", "dora"]
// createTestDots(10000)
// function createTestDots(howMany: number) {
//     for (let i = 0; i < howMany; i++) {
//         let x = innerWidth * Math.random()
//         let y = innerHeight * Math.random()
//         dots.push(new Dot(possibles[Math.floor(Math.random() * possibles.length)], x, y))
//     }
// }
// let prevTick = 0
// function animate(tick) {
//     context.clearRect(0, 0, canvas.width, canvas.height)
//     context.strokeStyle = "black"
//     for (let i = 0; i < dots.length; i++) {
//         let dot = dots[i]
//         context.beginPath() // side note: this is super needed
//         let r = 10
//         context.ellipse(dot.x, dot.y, dot.radius, dot.radius, 0, 0, 2 * Math.PI)
//         context.stroke()
//         context.strokeText(dot.title, dot.x, dot.y)
//         dot.x += 1
//         dot.y += 1
//         if (dot.x > innerWidth) {
//             dot.x = innerWidth * Math.random()
//         }
//         if (dot.y > innerHeight) {
//             dot.y = innerHeight * Math.random()
//         }
//     }
//     // for (let i = 0; i < 0; i++) {
//     //     dots.push(new Dot("", 2, 3))
//     // }
//     a.innerText = dots.length.toString() + "|" + (Math.round(1000/(tick - prevTick))).toString()
//     prevTick = tick
//     requestAnimationFrame(animate)

// }
// requestAnimationFrame(animate)
// let a = document.createElement("button")
// Object.assign(a, { fontSize: "300px", color: "orange", position: "absolute", top: "10", left: "10" })
// document.body.appendChild(a)
// a.onclick = () => {
//     let i = 0
//     while (i < 1000) {
//         i++
//         dots.push(new Dot(possibles[Math.floor(Math.random() * possibles.length)], 30, 30))
//     }
// }