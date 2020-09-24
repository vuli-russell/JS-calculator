//CALCULATION FUNCTIONS

//Regular expressions
//two sets of any number of digits, optionally followed by a . and any further digits, separated by the relevant operator. Second set of digit has an optional + or - sign. First set of digits for all expect subtraction 
// let bracketsRegex = /\(.*\)/;
let bracketsRegex = /\([^\)\(]*\)/
let indiciesRegex = /([\-]?\d+(?:\.\d+)?)\^([\+\-]?\d+(?:\.\d+)?)/;
let divisionRegex = /([\-]?\d+(?:\.\d+)?)\/([\+\-]?\d+(?:\.\d+)?)/;
let multiplicationRegex = /([\-]?\d+(?:\.\d+)?)\*([\+\-]?\d+(?:\.\d+)?)/;
let additionRegex = /([\-]?\d+(?:\.\d+)?)\+([\+\-]?\d+(?:\.\d+)?)/;
let subtractionRegex = /([\-]?\d+(?:\.\d+)?)\-([\+\-]?\d+(?:\.\d+)?)/;

//to remove trailing operator from string if present
let trailingOperatorRegex = /(^[\d\/\*\+\-\^]+\d)?(?:[\/\*\+\-\^]+$)/;

// to check that there arent two deicmal points in a number
let decimalPointRegex = /\.[\d]*\./;

//to find lonely decimal places
let leadingDecimalPlaceRegex = /(?<!\d)\./g;
let trailingDecimalPlaceRegex = /\.(?!\d)/g;

//to multiply brackets if no operator is given
let multiplyOpeningBracketRegex = /(?<!^)(?<![\+\-\*\/\^])\(/g;
let multiplyClosingBracketRegex = /\)(?![\+\-\*\/\^])(?!$)/g

//variable Regex - update to include other variables
let variableRegex = /[xy]/g;

const evaluateindicies = (inputStr) => {
    outputStr = inputStr;
    let i = 0;
    while (outputStr.includes('^') && i < inputStr.length) {
        outputStr = outputStr.replace(indiciesRegex, (p1, p2, p3) => {
            return (parseFloat(p2) ** parseFloat(p3));
        });
        i++;
    }
    return outputStr;
};

const evaluateDivision = (inputStr) => {
    outputStr = inputStr;
    let i = 0;
    while (outputStr.includes('/') && i < inputStr.length) {
        outputStr = outputStr.replace(divisionRegex, (p1, p2, p3) => {
            return (parseFloat(p2) / parseFloat(p3));
        });
        i++;
    }
    return outputStr;
};

const evaluateMultiplication = (inputStr) => {
    outputStr = inputStr;
    let i = 0;
    while (outputStr.includes('*') && i < inputStr.length) {
        outputStr = outputStr.replace(multiplicationRegex, (p1, p2, p3) => {
            return (parseFloat(p2) * parseFloat(p3));
        });
        i++;
    }
    return outputStr;
};

const evaluateAddition = (inputStr) => {
    outputStr = inputStr;
    let i = 0;
    //starts searching at position 1 to prevent being stuck in loop when answer has a + sign. Dont think i need this
    while (outputStr.includes('+', 1) && i < inputStr.length) {
        outputStr = outputStr.replace(additionRegex, (p1, p2, p3) => {
            return (parseFloat(p2) + parseFloat(p3));
        });
        i++;
    }
    return outputStr;
};

const evaluateSubtraction = (inputStr) => {
    outputStr = inputStr;
    let i = 0;
    //starts searching at position 1 to prevent being stuck in loop when answer is negative
    while (outputStr.includes('-', 1) && i < inputStr.length) {
        outputStr = outputStr.replace(subtractionRegex, (p1, p2, p3) => (parseFloat(p2) - parseFloat(p3)));
        i++;
    }
    return outputStr;
};



//combines all in bodmas order
const evaluateExpression = (expression, ans) => {
    //generate variable regex?? also needs to be in inputEvent below so seems like alot fo effort.
    //look at regex object to build all regex dynamically (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)

    //replace any variables with their values
    expression = expression.replace(variableRegex, (p1)=>`(${variableDict[p1]})`);

    //include ans
    expression = expression.replace(/ans/g, `(${ans})`);

    //add multiply sign between brackets where no operator is specified
    expression = expression.replace(multiplyOpeningBracketRegex, '*(')
    expression = expression.replace(multiplyClosingBracketRegex, ')*')

    //remove trailing operator
    expression = expression.match(trailingOperatorRegex) ? [...expression].slice(0, expression.length - 1).join('') : expression

    //add 0's before and after decimal places whihc dont have digits.
    if (expression.match(leadingDecimalPlaceRegex)) {
        expression = expression.replace(leadingDecimalPlaceRegex, "0.");
    }
    //input check prevents this
    if (expression.match(trailingDecimalPlaceRegex)) {
        expression = expression.replace(trailingDecimalPlaceRegex, ".0");
    }

    //evaluate brackets recursively
    while (expression.match(bracketsRegex)) {
        expression = expression.replace(bracketsRegex, (match => {
            return evaluateExpression([...match].slice(1, match.length - 1).join(""), ans);
        }))
    };

    //calculate 
    expression = evaluateindicies(expression);
    expression = evaluateDivision(expression);
    expression = evaluateMultiplication(expression);
    expression = evaluateAddition(expression);
    expression = evaluateSubtraction(expression);

    return expression;
}


// Page

//get display element
const display = document.querySelector('p.display.main');
const secondaryDisplay = document.querySelector('p.display.secondary');

//check that next input is valid, (eg cant have /* in string). Run before adding to input;
//if previous value is not a number, next one can only be a -.
//returns true if input it ok, false if not. Input should replace rather than append on false return

//allows switch statement
const inputType = (character) => {
    if (!(isNaN(parseInt(character))) || character === '.') {
        return 'digit';
    } else if (character === 's') {
        return 'ans';
    } else if(variableRegex.test(character)){
        return 'variable';
    }else {
        return character;
    }
};

const inputCheck = (newInput, currentString) => {
    switch (inputType(newInput)) {
        case 'digit':
        case 'ans':
            return true;
        case 'variable':
            if(variableDict[newInput]){
                return true;
            } else {
                return false
            };
        case '-':
            if (inputType(currentString.charAt(currentString.length - 1)) == '-') {
                return false;
            } else {
                return true;
            }
            case '^':
            case '/':
            case '*':
            case '+':
                if (
                    inputType(currentString.charAt(currentString.length - 1)) == 'digit' ||
                    inputType(currentString.charAt(currentString.length - 1)) == '(' ||
                    inputType(currentString.charAt(currentString.length - 1)) == ')' ||
                    inputType(currentString.charAt(currentString.length - 1)) == 'ans'||
                    inputType(currentString.charAt(currentString.length - 1)) == 'variable'
                ) {
                    return true;
                } else {
                    return false;
                }
                case '.':
                    if ((currentString + newInput).match(decimalPointRegex)) {
                        return false;
                    } else {
                        return true;
                    }
                    case '(':
                        return true;
                    case ')':
                        if (
                        inputType(currentString.charAt(currentString.length - 1)) == 'digit'||
                        inputType(currentString.charAt(currentString.length - 1)) == ')'
                        ) {
                            return true;
                        }
                        default:
                            return false;
    }
};

//save answer so ans button can be used
let answer = '0';

//set to true if equals was just pressed
let newExpression = false;

//contains info on stored variables
let variableDict = {
    x: '',
    y: ''
};

//INPUTS================================================================================
//get input buttons
const buttons = document.querySelectorAll('div.input');

const inputButtonEvent = (id,button) => {
    if (inputCheck(id, display.innerText)) {
        if (newExpression){
            if(/[0-9(?:ans)]/.test(id)||variableRegex.test(id)){
                display.innerText = '';
            }else {
                display.innerText = 'ans'
            }
        };
        display.innerText += id
        secondaryDisplay.innerText = evaluateExpression(display.innerText, answer);
        newExpression=false;
    } else {
        if(button){
            button.classList.add('invalid-input');
            setTimeout(() => {
                button.classList.remove('invalid-input');
            }, 500);
        }
    }
};


buttons.forEach(button => {
    button.addEventListener('click',()=>{
        inputButtonEvent(button.id,button);
    });
});

//EQUALS================================================================================
const equalsBtn = document.querySelector('#equals-button');
const equalsEvent = () =>{
    answer = evaluateExpression(display.innerText, answer);
    display.innerText = answer;
    secondaryDisplay.innerText = "";
    newExpression = true;
};
equalsBtn.addEventListener('click', equalsEvent);

//CLEAR================================================================================
const clearBtn = document.querySelector('#clear');
const clearEvent = () => {
    display.innerText = "";
    secondaryDisplay.innerText = "";
    answer = '0';
    newExpression = false;
};
clearBtn.addEventListener('click', clearEvent);

//BACKSPACE==============================================================================
const deleteBtn = document.querySelector('#delete');
const backspaceEvent = () => {
    display.innerText = display.innerText.slice(0, -1);
    secondaryDisplay.innerText = evaluateExpression(display.innerText, answer);
    newExpression = false;
}
deleteBtn.addEventListener('click', backspaceEvent); //THIS ISNT RUNNING ON CLICK. The function works fine when accessed via keypress(line282). On click does register the div being clicked (line 293)

//VARIABLE BUTTONS - This is all awful and im sure could be improved alot alot alot alot
// should generate these from the variablesDict
const xValue = document.querySelector('#x-value');
const xSet = document.querySelector('#x-set');
const xClear = document.querySelector('#x-clear');

const yValue = document.querySelector('#y-value');
const ySet = document.querySelector('#y-set');
const yClear = document.querySelector('#y-clear');

xSet.addEventListener('click',()=>{
    variableDict.x=display.innerText;
    xValue.innerText = variableDict.x;
})
xClear.addEventListener('click',()=>{
    variableDict.x='';
    xValue.innerText = '';
})

ySet.addEventListener('click',()=>{
    variableDict.y=display.innerText;
    yValue.innerText = variableDict.y;
})
yClear.addEventListener('click',()=>{
    variableDict.y='';
    yValue.innerText = '';
})


//Keyboard Interaction========================================================================
calcInputs = ['(',')','^','/','*','+','-','.']

const checkKeyType = (key) => {
    if (!(isNaN(parseInt(key))) || calcInputs.includes(key)){
        return 'input button';
    } else {
        return key;
    }
};

document.addEventListener('keydown', e => {
    switch (checkKeyType(e.key)) {
        case 'Enter':
            equalsEvent();
            break;
        case 'Backspace':
            backspaceEvent();
            break;
        case 'Delete':
            clearEvent();
            break;
        case 'input button':
            inputButtonEvent(e.key,null);
            break;
        case 'a':
        case 'ArrowLeft':
            yRotateInput -= 10;
            updateRotation();
            break;
        case 'd':
        case 'ArrowRight':
            yRotateInput += 10;
            updateRotation();
            break;
        case 'w':
        case 'ArrowUp':
            xRotateInput += 10;
            updateRotation();
            break;
        case 's':
        case 'ArrowDown':
            xRotateInput -= 10;
            updateRotation();
            break;
        case 'q':
            zRotateInput -= 10;
            updateRotation();
            break;
        case 'e':
            zRotateInput += 10;
            updateRotation();
            break;
        default:
            break;
    }
});

// document.addEventListener('click',e=>{console.log(e.target)});

//TO ADD
////DONE after pressing =, if the next input is a digit/ans then the main display should be cleared before adding, rather than just appending the digit to the answer.
//change previous character is possible, rather than rejecting input, eg if display is 5+ and * is input, change display to 5* rather than rejecting input
//add arrows to navigate through input 
////DONE ans isnt working properly
//rewrite event listeners to be a singel event listener and respond appropriately based on e.target.innerHTML or similar.
//Two decimal placs in a row breaks it
//standard form causes issuses (js return this from some calcs),  add step to parser
//max number of characters??
//add mouse interaction for rotation
//m+ should only be able to be added when newexpression = true

//DISPLAY STUFF
const calculator = document.querySelector('.calculator')

const updateRotation = () => {
    transformStr = `rotateX(${xRotateInput}deg) rotateY(${yRotateInput}deg) rotateZ(${zRotateInput}deg`;
    calculator.style.transform = transformStr;
};

//initial values
let xRotateInput = 40;
let yRotateInput = 20;
let zRotateInput = -20;
updateRotation();




