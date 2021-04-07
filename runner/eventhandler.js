async function onHitWall() {
    await error("Cannot move forward! Hitting an obstacle!")
    exit();
}

function onIdle() {
    // This function must be overwritten by the player, otherwise program aborts on execution
    exit();
}