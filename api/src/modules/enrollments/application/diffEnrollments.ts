export function getDroppedEnrollments(canvasEnrollments: Set<number>, localEnrollments: Set<number>): Set<number> {
    const dropped = new Set<number>();

    localEnrollments.forEach((id) => {
        if (!canvasEnrollments.has(id)) {
            dropped.add(id);
        }
    });

    return dropped;
};