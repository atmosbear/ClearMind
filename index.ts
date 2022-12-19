import { point, selectRandom } from "./extras/helpers"

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
        public color: string = "white",
        public dots: Dot[] = [],
        public focusedDot?: Dot,
        public element: HTMLCanvasElement = document.getElementById("canvas")! as HTMLCanvasElement, // @ts-expect-error
        public context: CanvasRenderingContext2D = document.getElementById("canvas")!.getContext("2d"),
        public contextMenu: ContextMenu = new ContextMenu()
    ) {
        this.maximizeCanvas(height, width)
        if (height === innerHeight) {
            window.addEventListener("resize", () => { this.maximizeCanvas(height, width) })
        }
        Object.assign(this.element.style, { backgroundColor: this.color })
        this.context.font = "30px Calibri"
    }

    maximizeCanvas(h: number, w: number) {
        this.element.height = h
        this.element.width = w
    }

    createTestDots(howMany: number) {
        let possibleTitles = ["a random note", "another random note", "cats", "big cats", "housecats", "dogs", "breeds", "german shepherd"]
        for (let i = 0; i < howMany; i++) {
            let x = 100
            let y = 100
            let dot = new Dot(selectRandom(possibleTitles), x, y)
            dot.shouldBeVisible = true
            this.dots.push(dot)
            dot.linked.push(selectRandom(this.dots))
        }
    }
    
    drawDot(dot: Dot) {
        this.context.strokeStyle = "black"
        this.context.ellipse(dot.x, dot.y, dot.radius, dot.radius, 0, 0, 2 * Math.PI)
        this.context.fillText(dot.title, dot.x, dot.y)
    }

    clearCanvas() {
        this.context.clearRect(0, 0, this.element.width, this.element.height)
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

    animate(that: DrawingArea) {
        that.clearCanvas()
        that.drawEachDot()
        that.context.fill()
        requestAnimationFrame(() => that.animate(this))
    }
}

class ContextMenu {
    constructor(
        public menuElement: HTMLDivElement = document.getElementById("right-click-menu")! as HTMLDivElement
    ) {
        this.menuElement.style.display = "none"
        document.addEventListener("DOMContentLoaded", () => {this.createEventHandlers()}) // this is an awesome trick
    }

    open(e: MouseEvent) {
        Object.assign(this.menuElement.style, { display: "block", top: e.clientY + "px", left: e.clientX + "px" })
    }

    close() {
        this.menuElement.style.display = "none"
    }

    createEventHandlers() {
        canvas.element.addEventListener("contextmenu", (e: MouseEvent) => {
            e.preventDefault()
            canvas.contextMenu.open(e)
        })
        window.addEventListener("click", (e) => {
            if (e.button === 0) {
                canvas.contextMenu.close()
            }
        })
    }
}
let possiblePositions: point[] = []
let canvas = new DrawingArea()
canvas.createTestDots(50)
canvas.animate(canvas)
