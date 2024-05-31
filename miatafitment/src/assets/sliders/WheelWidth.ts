// Function to get the wheel width from the input or default to 6 if it's not set
function getWheelWidth() {
    // Get the wheel width input element
    let wheelWidthInput = document.getElementById('wheelWidth') as HTMLInputElement;

    // Get the value of the wheel width input, or default to 6 if it's not set
    let wheelWidth = wheelWidthInput?.value ? parseFloat(wheelWidthInput?.value) : 6;

    return wheelWidth;
}

// Export the function so it can be used in other files
export { getWheelWidth };