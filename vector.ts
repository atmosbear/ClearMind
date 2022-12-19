export type point = {
    x: number
    y: number
}

export function lengthOfVector(components: point) {
    return Math.sqrt(Math.pow(components.x, 2) + Math.pow(components.y, 2))
}

export function dotProduct(vectorA: point, vectorB: point) {
    return (vectorA.x * vectorB.x) + (vectorA.y * vectorB.y)
}

export function subVectors(vectorA: point, vectorB: point) {
    let subbed = {x: vectorA.x - vectorB.x, y: vectorA.y - vectorB.y}
    return subbed
}

export function angleFrom2Vectors(vectorA: point, vertexPoint: point): number {
        // assume x axis clockwise is +
        return angleFrom3Points(vectorA, vertexPoint, {x: innerWidth, y: 0})
}

export function angleFrom3Points(A: point, vertex: point, C: point): number {
    // Just a reminder that point B is the point the rays A and C meet.
    let B = vertex

    let BAx = A.x - B.x
    let BAy = A.y - B.y
    let BA = { x: BAx, y: BAy }

    let BCx = C.x - B.x
    let BCy = C.y - B.y
    let BC = { x: BCx, y: BCy }

    let CAx = C.x - A.x
    let CAy = C.y - A.y
    let CA = { x: CAx, y: CAy }

    let BAlength = lengthOfVector(BA)
    let BClength = lengthOfVector(BC)
    let CAlength = lengthOfVector(CA)

    let possibleAngleA = Math.acos(dotProduct(CA, BA) / -(CAlength * BAlength)) //* (180 / (Math.PI))
    let possibleAngleA2 = possibleAngleA - Math.PI

    let possibleAngleB = Math.acos(dotProduct(BA, BC) / (BAlength * BClength)) //* (180 / (Math.PI))
    let possibleAngleB2 = possibleAngleB - Math.PI
    
    let possibleAngleC = Math.acos(dotProduct(CA, BC) / (CAlength * BClength)) //* (180 / (Math.PI))
    let possibleAngleC2 = possibleAngleC - Math.PI

    possibleAngleA
    possibleAngleA2
    possibleAngleB
    possibleAngleB2
    possibleAngleC
    possibleAngleC2

    let angleA = Math.max((possibleAngleA), (possibleAngleA2))
    let angleB = Math.max((possibleAngleB), (possibleAngleB2))
    let angleC = Math.max((possibleAngleC), (possibleAngleC2))

    return angleB
}

let A = { x: 879, y: -906 }
let B = { x: 22, y: 988 }
let C = { x: -638, y: 333 }
angleFrom3Points(A, B, C)