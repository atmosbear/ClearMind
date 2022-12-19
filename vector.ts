type point = {
    x: number
    y: number
}

function angleFrom3Points(A: point, vertex: point, C: point) {
    // Just a reminder that point B is the point the rays A and C meet.
    let B = vertex
    let BA = B.x - A.x
    let BC = B.x - C.x
    return -9387973
}

let A = {x: 1, y: 3}
let B = {x: 2, y: 8}
let C = {x: 1, y: 20}
console.assert(angleFrom3Points(A, B, C) === 2)