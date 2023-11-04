import { ref, readonly } from "vue";
import { OPERATORS, DIGITS } from "../shared/constants";

export function useCalculate() {
  let memory = ref("");
  let degree = ref(false)
  let alfa = ref(false)
  let betta = ref(false)
  let error = ref(false);
  let clearOnNextDigit = ref(false);

  function isOperator(string: string) {
    return OPERATORS.includes(string);
  }

  function isDigit(string: string) {
    return DIGITS.includes(string);
  }

  function lastCharIsOperator(string: string) {
    const stringNormalized = string.replace(/\s/g, "");
    return isOperator(stringNormalized[stringNormalized.length - 1]);
  }

  function addDigit(digit: string) {
    if (!isDigit(digit)) {
      throw new Error("Invalid param, is not a valid digit");
    }

    const lastDigit = memory.value[memory.value.length - 1];

    if (lastDigit === "." && digit === ".") return;
    if (lastDigit === "0" && memory.value.length === 1) clear();
    if (clearOnNextDigit.value) clear();
    if ((!memory.value || lastCharIsOperator(memory.value)) && digit === ".") memory.value += "0";

    clearOnNextDigit.value = false;
    memory.value += `${digit}`;
  }

  function addOperator(operator: string) {
    if (!isOperator(operator)) {
      throw new Error("Invalid param, is not a valid operator");
    }

    if (!memory.value && operator !== "-") return;
    if (lastCharIsOperator(memory.value)) eraseLast();
    console.log('operator', operator);
    
    if(operator === '^') degree.value = true
    if(operator === 'à') alfa.value = true
    if(operator === 'ß') betta.value = true
    clearOnNextDigit.value = false;
    memory.value += `${operator}`;
  }

  function calculateResult() {
    if (!memory.value) return;

    if (lastCharIsOperator(memory.value)) {
      memory.value = memory.value.slice(0, memory.value.length - 1);
    }
    if (degree.value) {
      try {
        const mathExpression = memory.value.replace(/\b0*((\d+\.\d+|\d+))\b/g, "$1"); 
        const numbers = mathExpression.split('^');       
        memory.value = String(Math.pow(Number(numbers[0]), Number(numbers[1])));
      } catch (_) {
        error.value = true;
        memory.value = "";
      } finally {
        clearOnNextDigit.value = true;
        degree.value = false
        alfa.value = false
        betta.value = false
        return
      }
    }
    
    if (alfa.value) {
      try {
        const mathExpression = memory.value.replace(/\b0*((\d+\.\d+|\d+))\b/g, "$1"); 
        console.log('alfa', mathExpression);
        
        const numbers = mathExpression.split('à')
                
        const atan = Math.atan(Number(numbers[0]) / Number(numbers[1]))
        const degs = radToDeg(atan)
        
        memory.value = String(degs);
        
      } catch (_) {
        error.value = true;
        memory.value = "";
      } finally {
        clearOnNextDigit.value = true;
        degree.value = false
        alfa.value = false
        betta.value = false
        return
      }
    }
    if (betta.value) {
      try {
        const mathExpression = memory.value.replace(/\b0*((\d+\.\d+|\d+))\b/g, "$1");
        console.log('betta', mathExpression);
        
        const numbers = mathExpression.split('ß')
        console.log('numbers', numbers);
        const atan = Math.atan(Number(numbers[1]) / Number(numbers[0]))
        const degs = radToDeg(atan)
        
        memory.value = String(degs);
       
      
        
      } catch (_) {
        error.value = true;
        memory.value = "";
      } finally {
        clearOnNextDigit.value = true;
        degree.value = false
        alfa.value = false
        betta.value = false
        return
      }
    }
    if (!degree.value && !alfa.value && !betta.value) {
      try {
      const mathExpression = memory.value.replace(/\b0*((\d+\.\d+|\d+))\b/g, "$1"); // remove octal numeric
      console.log('usieal', mathExpression);
      
      memory.value = `${eval(mathExpression)}`;
    } catch (_) {
      error.value = true;
      memory.value = "";
    } finally {
      clearOnNextDigit.value = true;
    }
    }

    degree.value = false
    alfa.value = false
    betta.value = false
    
  }

  function eraseLast() {
    if (!memory.value.length) return;

    memory.value = memory.value.slice(0, memory.value.length - 1);
    clearOnNextDigit.value = false;
  }

  function clear() {
    memory.value = "";
    error.value = false;
  }
  function radToDeg (rad: number): number {
    const degs = (rad * 180) / Math.PI;
    
		return degs
	}

  return {
    memory: readonly(memory),
    error: readonly(error),
    addDigit,
    addOperator,
    calculateResult,
    eraseLast,
    clear,
  };
}
