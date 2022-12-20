import { point, selectRandom, el } from "./extras/helpers"

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
        public shouldBeVisible: boolean = false,
        public isSelected: boolean = false,
    ) { }
}
let go = false
class DrawingArea {
    constructor(
        public height: number = innerHeight,
        public width: number = innerWidth,
        public color: string = "white",
        public dots: Dot[] = [],
        public selectedDot?: Dot,
        public element: HTMLCanvasElement = el("canvas")! as HTMLCanvasElement, // @ts-expect-error
        public context: CanvasRenderingContext2D = el("canvas")!.getContext("2d"),
        public contextMenu: ContextMenu = new ContextMenu(),
        public inputBox: InputBox = new InputBox(),
        public needsRedraw: boolean = true
    ) {
        this.maximizeCanvas(height, width)
        if (height === innerHeight) {
            window.addEventListener("resize", () => { this.maximizeCanvas(height, width) })
        }
        Object.assign(this.element.style, { backgroundColor: this.color })
        this.context.font = "20px Calibri"
    }

    maximizeCanvas(h: number, w: number) {
        this.element.height = h
        this.element.width = w
    }

    createAndDrawNewDot(title: string, x: number, y: number, linked: Dot[] = []) {
        let dot = new Dot(title, x, y)
        dot.shouldBeVisible = true
        this.dots.push(dot)
        dot.linked.push(...linked)
        this.needsRedraw = true
    }

    createTestDots(howMany: number) {
        let possibleTitles = ["a random note", "another random note", "cats", "big cats", "housecats", "dogs", "breeds", "german shepherd"]
        for (let i = 0; i < howMany; i++) {
            let x = this.width * Math.random()
            let y = this.height * Math.random()
            this.createAndDrawNewDot(selectRandom(possibleTitles), x, y)
        }
    }

    drawDot(dot: Dot) {
        dot.onscreen = true;
        this.context.beginPath()
        this.context.fillStyle = dot.color
        this.context.ellipse(dot.x, dot.y, dot.radius, dot.radius, 0, 0, 2 * Math.PI)
        this.context.fillText(dot.title, dot.x + dot.radius * 1.3, dot.y + dot.radius * 1.3)
        this.context.fill()
    }

    clearCanvas() {
        this.context.clearRect(0, 0, this.element.width, this.element.height)
        this.context.beginPath()
    }

    drawAllDotsLinkedTo(dot: Dot) {
        // dot.linked.forEach(link => {
        //     link.linked.forEach(link2 => {
        //         if (link2.onscreen === false) {
        //             this.drawDot(link2)
        //             link2.onscreen = true
        //         }
        //     })
        //     if (link.onscreen === false) {
        //         this.drawDot(link)
        //         link.onscreen = true
        //     }
        // })
    }

    drawEachDot() {
        this.dots.forEach(dot => {
            if (dot.shouldBeVisible) {
                this.context.beginPath()
                this.drawDot(dot)
                // this.drawAllDotsLinkedTo(dot)
            }
        })
    }

    animate(that: DrawingArea) {
        if (this.needsRedraw) {
            that.clearCanvas()
            that.drawEachDot()
            that.context.fill()
            that.needsRedraw = false
        }
        requestAnimationFrame(() => that.animate(this))
    }

    askUserInputTitle(e: MouseEvent) {
        this.inputBox.open(e)
        this.inputBox.element.value = ""
        this.inputBox.element.focus()
        this.inputBox.element.addEventListener("keyup", (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                if (go !== true) {
                this.createAndDrawNewDot(this.inputBox.element.value,
                    Number(this.inputBox.element.style.left.replace("px", "")) - 30,
                    Number(this.inputBox.element.style.top.replace("px", "")) - 30);
                this.inputBox.close()
                }
                go = true
                setTimeout(() => {go = false}, 500)
            }
        })
    }

    attemptToRemoveDot() {
        if (this.selectedDot) {
            this.selectedDot.shouldBeVisible = false
            this.selectedDot.onscreen = false
            this.selectedDot.isSelected = false
            this.dots.splice(this.dots.indexOf(this.selectedDot), 1)
            this.selectedDot = undefined
        }
        this.needsRedraw = true
    }

    handleSingleClickSelection(e: MouseEvent) {
        let extra = 20
        if (this.selectedDot !== undefined) {
            this.selectedDot.color = "black"
            this.selectedDot = undefined
        }
        canvas.needsRedraw = true
        this.dots.forEach(dot => {
            if (dot.onscreen) {
                if (isAWithinB(e.clientX, e.clientY, dot.x - extra - dot.radius, dot.y - extra - dot.radius, dot.x + extra + dot.radius, dot.y + extra + dot.radius)) {
                    this.selectedDot = dot
                    this.selectedDot.isSelected = true
                    // this.selectedDot.color = selectRandom(["black", "red", "blue", "orange", "yellow", "purple", "pink"])
                    this.selectedDot.color = globalTheme.selectedDotColor
                    canvas.needsRedraw = true
                    return this.selectedDot
                }
            }
        })
    }
}

function isAWithinB(mouseX: number, mouseY: number, topLeftX: number, topLeftY: number, bottomRightX: number, bottomRightY: number): boolean { // A: [number, number], BtopLeft: [number, number], BbottomRight: [number, number]): boolean {
    let isInside = false
    if (mouseX > topLeftX) {
        if (mouseX < bottomRightX) {
            if (mouseY < bottomRightY) {
                if (mouseY > topLeftY) {
                    isInside = true
                }
            }
        }
    }
    return isInside
}

class InputBox {
    constructor(
        public element: HTMLInputElement = el("new-node-input-box") as HTMLInputElement
    ) {
        this.element.style.display = "none"
    }

    open(e: MouseEvent) {
        Object.assign(this.element.style, { display: "block", top: e.clientY + "px", left: e.clientX + "px" })
    }
    close() {
        this.element.style.display = "none"
    }
}

class ContextMenu {
    constructor(
        public element: HTMLDivElement = el("right-click-menu")! as HTMLDivElement,
    ) {
        this.element.style.display = "none"
        document.addEventListener("DOMContentLoaded", () => { this.createEventHandlers() }) // this is an awesome trick
    }

    open(e: MouseEvent) {
        Object.assign(this.element.style, { display: "block", top: e.clientY + "px", left: e.clientX + "px" })
        let RDB = el("remove-selected-button") as HTMLButtonElement
        if (canvas.selectedDot) {
            RDB.disabled = false
        } else {
            RDB.disabled = true
        }
    }

    close() {
        this.element.style.display = "none"
    }

    createEventHandlers() {
        // context menu opening
        canvas.element.addEventListener("contextmenu", (e: MouseEvent) => {
            e.preventDefault()
            canvas.contextMenu.open(e)
        })
        // context menu closing
        window.addEventListener("click", (e) => {
            if (e.button === 0) {
                canvas.handleSingleClickSelection(e)
                canvas.contextMenu.close()
                if (e.target !== canvas.inputBox.element && e.target !== document.getElementById("new-dot-button") && e.target !== document.getElementById("remove-selected-button")) {
                    canvas.inputBox.close()
                }
            }
        })
        // new-dot-button clicking
        let button1 = el("new-dot-button") as HTMLButtonElement
        button1.onclick = (e: MouseEvent) => {
            canvas.askUserInputTitle(e)
        }
        let button2 = el("remove-selected-button") as HTMLButtonElement
        button2.onclick = (e: MouseEvent) => {
            canvas.attemptToRemoveDot()
        }
    }
}

let globalTheme = { selectedDotColor: "darkorange" }
let canvas = new DrawingArea()
// canvas.createTestDots(0)
canvas.animate(canvas)
