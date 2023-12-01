export function choose(arr: any[]) {
    return arr[Math.floor(Math.random() * arr.length)]
}

export function degrees_to_radians(degrees: number)
{
    return degrees * (Math.PI/180);
}