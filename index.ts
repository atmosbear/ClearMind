import { point, selectRandom } from "./helpers"


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

class DrawingArea {
    constructor(
        public height: number = innerHeight,
        public width: number = innerWidth,
        public color: string = "orange",
        public dots: Dot[] = [],
        public canvasElement: HTMLCanvasElement = document.getElementById("canvas")! as HTMLCanvasElement, // @ts-expect-error
        public context: CanvasRenderingContext2D = document.getElementById("canvas")!.getContext("2d"),
        public rightClickMenuElement: HTMLDivElement = document.getElementById("right-click-menu") as HTMLDivElement,
        public focusedDot?: Dot
    ) {
        this.maximizeCanvas()
        window.addEventListener("resize", () => { this.maximizeCanvas() })
        Object.assign(this.canvasElement.style, { backgroundColor: this.color })
        this.context.font = "30px Arial"
    }

    maximizeCanvas() {
        this.canvasElement.width = innerWidth
        this.canvasElement.height = innerHeight
    }

    createTestDots(howMany: number) {
        let possibleTitles = ["a random note", "another random note", "cats", "big cats", "housecats", "dogs", "breeds", "german shepherd"]
        for (let i = 0; i < howMany; i++) {
            let x = (innerWidth / 20) * Math.random()
            let y = (innerHeight / 20) * Math.random()
            let dot = new Dot(selectRandom(possibleTitles), x, y)
            this.dots.push(dot)
            dot.linked.push(selectRandom(this.dots))
        }
    }

    openMenu(e: MouseEvent) {
        Object.assign(this.rightClickMenuElement.style, { display: "block", top: e.clientY + "px", left: e.clientX + "px" })
    }

    closeMenu() {
        this.rightClickMenuElement.style.display = "none"
    }


    drawDot(dot: Dot) {
        this.context.strokeStyle = "black"
        this.context.ellipse(dot.x, dot.y, dot.radius, dot.radius, 0, 0, 2 * Math.PI)
        this.context.strokeText(dot.title, dot.x, dot.y)
    }

    clearCanvas() {
        this.context.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height)
    }

    drawAllDotsLinkedTo(dot: Dot) {
        dot.linked.forEach(link => {
            link.linked.forEach(link2 => {
                this.drawDot(link2)
            })
            this.drawDot(link)
        })
    }

    drawEachDot() {
        this.dots.forEach(dot => {
            if (dot.shouldBeVisible) {
                this.context.beginPath()
                this.drawDot(dot)
                this.drawAllDotsLinkedTo(dot)
            }
        })
    }

    animate(that) {
        that.clearCanvas()
        that.drawEachDot()
        that.context.stroke()
        requestAnimationFrame(() => that.animate(that))
    }
}

function createEventHandlers() {
    window.addEventListener("contextmenu", (e: MouseEvent) => {
        e.preventDefault()
        canvas.openMenu(e)
    })
    window.addEventListener("click", (e) => {
        if (e.button === 0) {
            canvas.closeMenu()
        }
    })
}

let possiblePositions: point[] = []
let canvas = new DrawingArea()
canvas.createTestDots(10)
canvas.animate(canvas)
