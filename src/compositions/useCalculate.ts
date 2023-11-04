import { ref, readonly } from "vue";
import { OPERATORS, DIGITS } from "../shared/constants";

export function useCalculate() {
  let memory = ref("");
  let degree = ref(false)
  let alfa = ref(false)
  let betta = ref(false)
  let hypo = ref(false)
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
    
    if(operator === '^') degree.value = true
    if(operator === 'à') alfa.value = true
    if(operator === 'ß') betta.value = true
    if(operator === 'hypo') hypo.value = true
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
        const numbers = memory.value.split('^');       
        memory.value = String(Math.pow(Number(numbers[0]), Number(numbers[1])));
      } catch (_) {
        error.value = true;
        memory.value = "";
      } finally {
        clearOnNextDigit.value = true;
        degree.value = false
        alfa.value = false
        betta.value = false
        hypo.value = false
        return
      }
    }
    
    if (alfa.value) {
      try {    
        const numbers = memory.value.split('à')
                
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
        hypo.value = false
        return
      }
    }
    if (betta.value) {
      try {
        const numbers = memory.value.split('ß')

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
        hypo.value = false
        return
      }
    }
    if (hypo.value) {
      try {
      
        const numbers = memory.value.split('hypo')

        const result = Math.sqrt(Math.pow(Number(numbers[0]), 2) + Math.pow(Number(numbers[1]), 2))
        
        memory.value = String(result);

      } catch (_) {
        error.value = true;
        memory.value = "";
      } finally {
        clearOnNextDigit.value = true;
        degree.value = false
        alfa.value = false
        betta.value = false
        hypo.value = false
        return
      }
    }
    if (!degree.value && !alfa.value && !betta.value && !hypo.value) {
      try {
        memory.value = `${eval(memory.value)}`;
      } catch (_) {
        error.value = true;
        memory.value = "";
      } finally {
        clearOnNextDigit.value = true;
      }
    }
    
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
