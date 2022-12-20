
export function selectRandom<G>(array: G[]): G {
    return array[Math.floor(Math.random()*array.length)]
}

export type point = {
    x: number
    y: number
}


/**
 * This function assumes you know that what you're asking for exists!
 */
 export function el(id: string) {
    return document.getElementById(id)!
}