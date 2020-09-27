//BUTTON GENERATION LOOP


//generating numbers

const buttonsIDArr = ['clear','/','*','delete','7','8','9','-','4','5','6','+','1','2','3','equals-button','0','.','^','ans','(',')'];
const buttonsTextArr = ['C','/','X','Del','7','8','9','-','4','5','6','+','1','2','3','=','0','.','^','ans','(',')'];
const buttonsClassArr = ['command','input','input','command','input','input','input','input','input','input','input','input','input','input','input','command','input','input','input','input','input','input'];
const buttonsArea = document.querySelector('.buttons.numbers');

buttonsIDArr.forEach((buttonId,index) => {
    let container = document.createElement('div');
    container.id = buttonId;
    container.classList.add(buttonsClassArr[index]);
    container.classList.add('button-container');
    let topFace = document.createElement('div');
    topFace.classList.add('button-top-face');
    let bottomFace = document.createElement('div');
    bottomFace.classList.add('button-bottom-face');
    let leftFace = document.createElement('div');
    leftFace.classList.add('button-left-face');
    let rightFace = document.createElement('div');
    rightFace.classList.add('button-right-face');
    let frontFace = document.createElement('div');
    frontFace.classList.add('button-front-face');
    frontFace.innerText = buttonsTextArr[index];

    container.append(topFace,bottomFace,leftFace,rightFace,frontFace);

    buttonsArea.append(container);
});

//generating variables

const varButtonsIDArr = ['x','x-value','x-set','x-clear','y','y-value','y-set','y-clear'];
const varButtonsTextArr = ['x','','M+','M-','y','','M+','M-'];
const varButtonsClassArr = ['input','var-value','command','command','input','var-value','command','command'];
const varButtonsArea = document.querySelector('.buttons.variables');

varButtonsIDArr.forEach((buttonId,index) => {
    let container = document.createElement('div');
    container.id = buttonId;
    container.classList.add(varButtonsClassArr[index]);
    container.classList.add('button-container');
    let topFace = document.createElement('div');
    topFace.classList.add('button-top-face');
    let bottomFace = document.createElement('div');
    bottomFace.classList.add('button-bottom-face');
    let leftFace = document.createElement('div');
    leftFace.classList.add('button-left-face');
    let rightFace = document.createElement('div');
    rightFace.classList.add('button-right-face');
    let frontFace = document.createElement('div');
    frontFace.classList.add('button-front-face');
    frontFace.innerText = varButtonsTextArr[index];

    container.append(topFace,bottomFace,leftFace,rightFace,frontFace);

    varButtonsArea.append(container);
});

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
let multiplyOpeningBracketRegex = /(?<!^)(?<!\()(?<![\+\-\*\/\^])\(/g;
let multiplyClosingBracketRegex = /\)(?![\+\-\*\/\^])(?!$)(?!\))/g

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
    if (!(isNaN(parseInt(character)))) {
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
                inputType(currentString.charAt(currentString.length - 1)) == '.' ||
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
                (
                    inputType(currentString.charAt(currentString.length - 1)) == 'digit' ||
                    inputType(currentString.charAt(currentString.length - 1)) == '.' ||
                    inputType(currentString.charAt(currentString.length - 1)) == ')'
                )&&(
                    ((currentString.match(/\(/g) ? currentString.match(/\(/g).length : 0) > (currentString.match(/\)/g) ? currentString.match((/\)/g)).length : 0))
                )
            ) {
                return true;
            } else {
                console.log(currentString)
                console.log(currentString.match(/\(/));
                console.log(currentString.match(/\)/));
                
                
                return false
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
        pressButton(button);
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
    pressButton(equalsBtn);
    answer = evaluateExpression(display.innerText, answer);
    display.innerText = answer;
    secondaryDisplay.innerText = "";
    newExpression = true;
};
equalsBtn.addEventListener('click', equalsEvent);

//CLEAR================================================================================
const clearBtn = document.querySelector('#clear');
const clearEvent = () => {
    pressButton(clearBtn);
    display.innerText = "";
    secondaryDisplay.innerText = "";
    answer = '0';
    newExpression = false;
};
clearBtn.addEventListener('click', clearEvent);

//BACKSPACE==============================================================================
const deleteBtn = document.querySelector('#delete');
const backspaceEvent = () => {
    pressButton(deleteBtn);
    //if previous char is an s delete 3 (for ans)
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
    variableDict.x=secondaryDisplay.innerText;
    xValue.innerText = variableDict.x;
})
xClear.addEventListener('click',()=>{
    variableDict.x='';
    xValue.innerText = '';
})

ySet.addEventListener('click',()=>{
    variableDict.y=secondaryDisplay.innerText;
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
            inputButtonEvent(e.key,document.getElementById(e.key));
            break;
        case 'a':
        case 'ArrowLeft':
            yRotation -= 10;
            updateRotation();
            break;
        case 'd':
        case 'ArrowRight':
            yRotation += 10;
            updateRotation();
            break;
        case 'w':
        case 'ArrowUp':
            xRotation += 10;
            updateRotation();
            break;
        case 's':
        case 'ArrowDown':
            xRotation -= 10;
            updateRotation();
            break;
        case 'q':
            zRotation -= 10;
            updateRotation();
            break;
        case 'e':
            zRotation += 10;
            updateRotation();
            break;
        default:
            break;
    }
});

//mouse drag detection================================================================================

//store previous mouse location (x,y)
let previousMouseLocation = [];

//detect if mouse is held down
let mousedown = null;
document.addEventListener('mousedown',(e)=>{
    mousedown=true
    previousMouseLocation = [e.x,e.y];
});

document.addEventListener('mouseup',()=>{mousedown=false});


document.addEventListener('mousemove',(e)=>{
    if(mousedown){
        let xMovement = e.x - previousMouseLocation[0];
        let yMovement = e.y - previousMouseLocation[1];
        yRotation += (xMovement/10);
        xRotation += (yMovement/10);
        updateRotation();
        previousMouseLocation = [e.x,e.y];
    }
});


//=====================================================================================================

// document.addEventListener('click',e=>{console.log(e.target)});

//TO ADD
////DONE after pressing =, if the next input is a digit/ans then the main display should be cleared before adding, rather than just appending the digit to the answer.
//change previous character is possible, rather than rejecting input, eg if display is 5+ and * is input, change display to 5* rather than rejecting input
//add arrows to navigate through input 
////DONE ans isnt working properly
//rewrite event listeners to be a singel event listener and respond appropriately based on e.target.innerHTML or similar.
//DONE Two decimal placs in a row breaks it
//standard form causes issuses (js return this from some calcs),  add step to parser
//max number of characters??
//add mouse interaction for rotation - FIX TO ACCOUNT FOR CURRENT LOCATION OF AXIS. Also add touch support
//DONE changed to secondary value //m+ should only be able to be added when newexpression = true
//media queries to resize calculator and info boxes
//background - stars or someshit idk
//add CUSTOMISE allowing color choice and backface text or something 
//DONE prevent closing a bracket that hasnt been opened

//DISPLAY STUFF
const calculator = document.querySelector('.calculator')

const updateRotation = () => {
    transformStr = `rotateX(${xRotation}deg) rotateY(${yRotation}deg) rotateZ(${zRotation}deg`;
    calculator.style.transform = transformStr;
};

//initial values
let xRotation = 40;
let yRotation = 20;
let zRotation = -20;
updateRotation();

//more info box
const infoPane = document.querySelector('.info-pane');
const opener = document.querySelector('.opener');
const moreInfo = document.querySelector('.about');

opener.addEventListener('click',()=>{
    moreInfo.classList.toggle('shown');
    infoPane.classList.toggle('shown');
});

//function to depress button on click
const pressButton = button => {
    button.classList.add('pressed');
    setTimeout(()=>{button.classList.remove('pressed')},200);
}


