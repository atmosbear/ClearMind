
export function selectRandom<G>(array: G[]): G {
    return array[Math.floor(Math.random()*array.length)]
}

export type point = {
    x: number
    y: number
}
