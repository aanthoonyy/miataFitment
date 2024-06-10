export function numberInputHandler(inputId: string): number | null {
    const numberInput = document.getElementById(inputId) as HTMLInputElement;

    if (numberInput) {
        numberInput.addEventListener('input', (event) => {
            const value = parseFloat((<HTMLInputElement>event.target).value);
            console.log(`${inputId} updated to: ${value}`);
            return value;
        });
    }

    return null;  
}