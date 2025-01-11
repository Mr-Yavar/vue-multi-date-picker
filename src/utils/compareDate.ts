export function compareDate(dateA: Date, op: string, dateB: Date): boolean {
    // Normalize both dates to ignore time
    const normalizedDateA = new Date(dateA.getFullYear(), dateA.getMonth(), dateA.getDate())
    const normalizedDateB = new Date(dateB.getFullYear(), dateB.getMonth(), dateB.getDate())

    switch (op) {
        case '===':
            return normalizedDateA.getTime() === normalizedDateB.getTime()
        case '!==':
            return normalizedDateA.getTime() !== normalizedDateB.getTime()
        case '>':
            return normalizedDateA.getTime() > normalizedDateB.getTime()
        case '<':
            return normalizedDateA.getTime() < normalizedDateB.getTime()
        case '>=':
            return normalizedDateA.getTime() >= normalizedDateB.getTime()
        case '<=':
            return normalizedDateA.getTime() <= normalizedDateB.getTime()
        default:
            throw new Error(`Invalid operator: ${op}`)
    }
}
