export function stopAnimation() {
    const element = document.getElementById("loading-animation");

    try {
        if (element) element.remove();
        console.log("Animation stopped successfully");
    } catch (error) {
        console.error(error + ": failed to stop animation");
    }
}

export function isLastLine({
    array,
    index,
}: {
    array: string[],
    index: number,
}) {
    return index === array.length - 1;
}