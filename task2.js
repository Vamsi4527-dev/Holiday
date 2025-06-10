const display=document.getElementById("display");
function appendToDisplay(input) {
    display.value+=input;
}
function clearDisplay() {
    display.value="";
}
 function deleteLastChar() {
    const display=document.getElementById('display');
    display.value=display.value.slice(0, -1);
}
function calculate() {
    try {
        display.value = eval(display.value);
    } catch (error) {
        display.value = "Error";
    }
}













































/*const display = document.getElementById("display");
function appendToDisplay(input) {
    display.value += input;
}
function clearDisplay() {
    display.value = "";
}
function deleteLastChar() {
    display.value = display.value.slice(0, -1);
}
function toggleSign() {
    if (display.value) {
        if (display.value.startsWith('-')) {
            display.value = display.value.substring(1);
        } else {
            display.value = '-' + display.value;
        }
    }
}
function calculate() {
    try {
        let expression = display.value.replace(/x/g, '*');
        display.value = eval(expression);
    } catch (error) {
        display.value = "Error";
    }
}*/