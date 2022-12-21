
                function circle(radius: number, startX: number, startY: number, numPoints: number) {
                    let positions: number[][] = []
                    let center: number[] = [startX, startY]
                    let xSpan = [startX - radius, startX]
                    let ySpan = [startY - radius, startY + radius]
                    let widths = (xSpan[1] - xSpan[0]) / (numPoints / 4)
                    let heights = (ySpan[1] - ySpan[0]) / (numPoints / 4)
                    let radiusSq = Math.pow(radius, 2)
                    for (let i = 0; i <= numPoints; i++) {
                        let x = widths * i
                        let ySquaredPlusStartY = Math.abs(radiusSq - Math.pow(x, 2))
                        let y = Math.sqrt(ySquaredPlusStartY)
                        if (!isNaN(x) && !isNaN(y)) {
                            positions.push([-x + startX, -y + startY])
                            positions.push([-x + startX, y + startY])
                            positions.push([x + startX, y + startY])
                            positions.push([x + startX, -y + startY])
                        }
                    }
                    return positions
                }
let radius = 1
circle(radius, 1, 1, 10)
