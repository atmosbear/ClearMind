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
        public drawnLinks: Link[] = [],
        public selectedDot?: Dot,
        public element: HTMLCanvasElement = el("canvas")! as HTMLCanvasElement, // @ts-expect-error
        public context: CanvasRenderingContext2D = el("canvas")!.getContext("2d"),
        public contextMenu: ContextMenu = new ContextMenu(),
        public inputBox: InputBox = new InputBox(),
        public eventHandler: EventHandler | undefined = undefined,
        public needsRedraw: boolean = true
    ) {
        this.eventHandler = this.eventHandler ?? new EventHandler(this, this.inputBox, this.contextMenu)
        this.styleCanvas(height, width)
    }

    styleCanvas(height: number, width: number) {
        this.maximizeCanvas(height, width)
        if (height === innerHeight) {
            window.addEventListener("resize", () => {
                this.maximizeCanvas(innerHeight, innerWidth);
                this.needsRedraw = true
            })
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
            let linked: Dot[] = []
            this.dots.forEach(dot => {
                if (dot !== this.dots[0]) {
                    if (Math.random() > 1 - decimalChanceOfLink)
                        dot.linked.push(selectRandom(this.dots))
                }
            })
            this.createAndDrawNewDot(selectRandom(possibleTitles), x, y, linked)
        }
    }

    drawLine(line: Line) {
        this.context.beginPath()
        this.context.moveTo(line.startpoint.x, line.startpoint.y)
        this.context.lineTo(line.endpoint.x, line.endpoint.y)
        this.context.stroke()
    }

    drawLink(link: Link) {
        if (link.startDot === this.selectedDot || link.endDot === this.selectedDot) {
            this.context.strokeStyle = THEME.selectedLinkColor
            this.context.lineWidth = THEME.selectedLinkWidth
        }
        else {
            this.context.strokeStyle = THEME.unselectedLinkColor
            this.context.lineWidth = THEME.unselectedLinkWidth
        }
        this.drawLine(link)
    }

    drawDot(dot: Dot) {
        dot.onscreen = true;
        dot.shouldBeVisible = true;
        this.context.beginPath()
        this.context.fillStyle = dot.color
        // this.context.ellipse(dot.x, dot.y, dot.radius, dot.radius, 0, 0, 2 * Math.PI)
        this.context.fillText(dot.title, dot.x - this.context.measureText(dot.title).width / 2, dot.y)
        // this.context.fillText(dot.title, dot.x + dot.radius * 1.3, dot.y + dot.radius * 1.3)
        this.context.fill()
    }

    clearCanvas() {
        this.context.clearRect(0, 0, this.element.width, this.element.height)
        this.context.beginPath()
    }

    drawAllDotsLinkedTo(dot: Dot) {
        dot.linked.forEach(endpoint => {
            let l = new Link(dot, endpoint)
            this.drawnLinks.push(l)
        })
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

    drawEachLink() {
        this.drawnLinks.forEach(link => {
            this.context.beginPath()
            this.drawLink(link)
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

    drawChildrenOf(dot: Dot) {
        // let numToDraw = dot.linked.length
        // let perRow = 15
        // let rows = Math.round(numToDraw / perRow)
        // dot.linked.forEach((dot2, i) => {
        //     if (!dot2.onscreen) {
        //         this.drawDot(dot2);
        //         this.drawLink(new Link(dot, dot2))
        //     }
        // })
    }

    animate(that: DrawingArea) {
        if (MOUSE.pan && MOUSE.button === "middle" && MOUSE.isDown) {
            CANVAS.dots.forEach(dot => {
                dot.x -= (MOUSE.hitStartedAt.x - MOUSE.latestClientX) / 10
                dot.y -= (MOUSE.hitStartedAt.y - MOUSE.latestClientY) / 10
            })
        }
        if (this.needsRedraw) {
            that.clearCanvas()
            this.drawnLinks = []
            // this.selectedDot = this.dots[0]
            // this.dots[2].x = innerWidth / 2
            // this.dots[2].y = innerHeight / 5
            // this.drawDot(this.dots[2])
            // that.drawChildrenOf(this.dots[2])
            this.dots.forEach(dot => {
                this.dots.forEach(dot2 => {
                    if (dot !== dot2) {
                        cooldownJiggles /= 1 + (1 / cooldownTime) * 1e-6
                        let d = distance(dot, dot2)
                        let Kconstant = 100 / Math.pow(this.dots.length, 0.2) // increasing it makes the ideal length longer
                        function attraction() {
                            return {
                                x: (Math.pow(d.mag, 2) / Kconstant) * Math.sign(d.dx) / d.mag * cooldownJiggles,
                                y: (Math.pow(d.mag, 2) / Kconstant) * Math.sign(d.dy) / d.mag * cooldownJiggles
                            }
                        }
                        function repulsion() {
                            return {
                                x: -(Math.pow(Kconstant, 2) / d.mag) * (Math.sign(d.dx) / d.mag) * cooldownJiggles,
                                y: -(Math.pow(Kconstant, 2) / d.mag) * (Math.sign(d.dy) / d.mag) * cooldownJiggles
                            }
                        }
                        if (dot.linked.includes(dot2) || dot2.linked.includes(dot)) {
                            if (Math.abs(d.dx) > idealLength) {
                                dot.x -= attraction().x
                                dot2.x += attraction().x
                            }
                            if (Math.abs(d.dy) > idealLength) {
                                dot.y -= attraction().y
                                dot2.y += attraction().y
                            }
                        } else {
                            if (Math.abs(d.dy) > idealLength) {
                                dot.y -= repulsion().y
                                dot2.y += repulsion().y
                            }
                            if (Math.abs(d.dx) > idealLength) {
                                dot2.x += repulsion().x
                                dot.x -= repulsion().x
                            }
                        }
                    }
                })
            })
            that.drawEachDot()
            that.drawEachLink()
            that.context.fill()
            that.needsRedraw = true
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
                setTimeout(() => { go = false }, 500)
            }
        })
    }

    attemptToRemoveDot() {
        if (this.selectedDot !== undefined) {
            this.selectedDot.shouldBeVisible = false
            this.selectedDot.onscreen = false
            this.selectedDot.isSelected = false
            this.dots.splice(this.dots.indexOf(this.selectedDot), 1)
            this.selectedDot = undefined
        }
        this.needsRedraw = true
    }

    link(dotA: Dot, dotB: Dot) {
        dotA.linked.push(dotB)
    }

    handleSingleClickSelection(e: MouseEvent) {
        let extra = 20
        if (this.selectedDot !== undefined && e.target !== el("remove-selected-button")) {
            this.selectedDot.color = "black"
            this.selectedDot = undefined
        }
        CANVAS.needsRedraw = true
        this.dots.forEach(dot => {
            if (dot.onscreen) {
                if (isAWithinB(e.clientX, e.clientY, dot.x - extra - dot.radius, dot.y - extra - dot.radius, dot.x + extra + dot.radius, dot.y + extra + dot.radius)) {
                    if (!this.selectedDot) {
                        this.selectedDot = dot
                        this.selectedDot.isSelected = true
                        // this.selectedDot.color = selectRandom(["black", "red", "blue", "orange", "yellow", "purple", "pink"])
                        this.selectedDot.color = THEME.selectedDotColor
                        CANVAS.needsRedraw = true
                    }
                    return this.selectedDot
                }
            }
        })
    }
}

function isAWithinB(mouseX: number, mouseY: number, topLeftX: number, topLeftY: number, bottomRightX: number, bottomRightY: number): boolean {
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
        let removeSelectedButton = el("remove-selected-button") as HTMLButtonElement
        if (CANVAS.selectedDot) {
            removeSelectedButton.disabled = false
        } else {
            removeSelectedButton.disabled = true
        }
    }

    close() {
        this.element.style.display = "none"
    }

    createEventHandlers() {
        // context menu opening
        CANVAS.element.addEventListener("contextmenu", (e: MouseEvent) => {
            e.preventDefault()
            CANVAS.contextMenu.open(e)
        })
        // context menu closing
        window.addEventListener("mouseup", (e: MouseEvent) => {
            if (e.button === 0) {
                CANVAS.contextMenu.close()
                if (e.target !== CANVAS.inputBox.element && e.target !== document.getElementById("new-dot-button") && e.target !== document.getElementById("remove-selected-button")) {
                    CANVAS.inputBox.close()
                }
            }
        })
        // new-dot-button clicking
        let button1 = el("new-dot-button") as HTMLButtonElement
        button1.onclick = (e: MouseEvent) => {
            CANVAS.askUserInputTitle(e)
        }
        let button2 = el("remove-selected-button") as HTMLButtonElement
        button2.onclick = (e: MouseEvent) => {
            CANVAS.attemptToRemoveDot()
        }
    }
}

class EventHandler {
    constructor(
        public canvas: DrawingArea,
        public inputBox: InputBox,
        public contextMenu: ContextMenu
    ) {
        window.addEventListener("mousedown", (e) => { this.mouseDown(e) })
        window.addEventListener("mouseup", (e) => { this.mouseUp(e) })
        window.addEventListener("mousemove", (e) => { this.mouseMove(e) })
        window.addEventListener("scroll", (e) => { this.mouseScroll(e) })
    }

    mouseScroll(e: Event) {

        CANVAS.dots.forEach(dot => {
            dot.x /= 1.5
            dot.x += (innerWidth - dot.x) / 8 * window.scrollX
            dot.y /= 1.5
            dot.y += (innerHeight - dot.y) / 8 * window.scrollY
            // dot.x
        })
    }
    mouseDown(e: MouseEvent) {
        MOUSE.latestClientX = e.clientX
        MOUSE.latestClientY = e.clientY
        MOUSE.isDown = true
        if (e.button === 0) { // left click on linux!
            MOUSE.button = "left"
            MOUSE.hitStartedAt = { x: e.clientX, y: e.clientY }
            CANVAS.handleSingleClickSelection(e)
        } else if (e.button === 2) { // right click
            MOUSE.button = "right"
            // CANVAS.dots = []
        } else if (e.button === 1) { // middle click
            MOUSE.button = "middle"
            MOUSE.isDown = true
            MOUSE.pan = true
            MOUSE.hitStartedAt.x = e.clientX
            MOUSE.hitStartedAt.y = e.clientY
        }
    }
    mouseUp(e: MouseEvent) {
        MOUSE.isDown = false
        MOUSE.dragging = false
        MOUSE.dragRegardlessOfPlace = true
        MOUSE.hitStartedAt = { x: 0, y: 0 }
        MOUSE.pan = false
    }
    mouseMove(e: MouseEvent) {
        if (MOUSE.isDown === true) {
            MOUSE.dragging = true
        }
        if (MOUSE.dragging && MOUSE.dragRegardlessOfPlace && CANVAS.selectedDot && MOUSE.button === "left") {
            CANVAS.selectedDot.x = e.clientX
            CANVAS.selectedDot.y = e.clientY
            MOUSE.hitStartedAt = { x: 0, y: 0 }
            CANVAS.needsRedraw = true
        } else if (MOUSE.dragging
            && CANVAS.selectedDot
            && isAWithinB(
                MOUSE.hitStartedAt.x,
                MOUSE.hitStartedAt.y,
                CANVAS.selectedDot.x,
                CANVAS.selectedDot.y,
                CANVAS.selectedDot.x + CANVAS.selectedDot.radius,
                CANVAS.selectedDot.y + CANVAS.selectedDot.radius
            )
            && MOUSE.button !== "middle") {
            CANVAS.selectedDot.x = e.clientX
            CANVAS.selectedDot.y = e.clientY
            MOUSE.dragRegardlessOfPlace = true
            MOUSE.hitStartedAt = { x: e.clientX, y: e.clientY }
            CANVAS.needsRedraw = true
        } else if (MOUSE.pan && MOUSE.button === "middle") {
            MOUSE.latestClientX = e.clientX
            MOUSE.latestClientY = e.clientY
            CANVAS.dots.forEach(dot => {
                dot.x -= (MOUSE.hitStartedAt.x - e.clientX) / 100
                dot.y -= (MOUSE.hitStartedAt.y - e.clientY) / 100
            })
        }
    }
}

class Line {
    constructor(
        public startpoint: point,
        public endpoint: point,
    ) { }
}

class Link extends Line {
    constructor(public startDot: Dot, public endDot: Dot) {
        super({ x: startDot.x, y: startDot.y }, { x: endDot.x, y: endDot.y })
    }
}


const MOUSE = { isDown: false, dragging: false, hitStartedAt: { x: 0, y: 0 }, dragRegardlessOfPlace: true, pan: false, button: "none", latestClientX: 0, latestClientY: 0 }
const THEME = { selectedDotColor: "darkorange", selectedLinkColor: "blue", selectedLinkWidth: 4, unselectedLinkColor: "gray", unselectedLinkWidth: 1 }
const CANVAS = new DrawingArea()
let cooldownJiggles = 20
let cooldownTime = 10
let idealLength = 10
let decimalChanceOfLink = 0.01
CANVAS.createTestDots(200)
CANVAS.animate(CANVAS)
function distance(dot1, dot2) {
    let dx = dot1.x - dot2.x
    let dy = dot1.y - dot2.y
    let mag = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
    return { dx, dy, mag }
}