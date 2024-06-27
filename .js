const factF = a => {
   if(a > 512) return Infinity
   let n = 1
   for(let i = 2; i < a+1; i++) {
      n *= i
   }
   return n
}

class ArgumentMismatch extends Error {
   constructor(message) {
      super(message)
      this.name = 'ArgumentMismatch'
      if (Error.captureStackTrace)
         Error.captureStackTrace(this, ArgumentMismatch)
   }
}

const constants = {
   "PI": Math.PI,
   "E": Math.E,
   "LN2": Math.LN2,
   "LN10": Math.LN10,
   "LOG2E": Math.LOG2E,
   "LOG10E": Math.LOG10E,
   "SQRT2": Math.SQRT2,
   "SQRT1_2": Math.SQRT1_2,
   "SQRT5": Math.sqrt(5),
   "GOLDEN_RATIO": (1 + Math.sqrt(5)) / 2,
   "C": 299792458,
   "G": 6.67430e-11,
   "PLANCK": 6.62607015e-34,
   "AVOGADRO": 6.02214076e23,
   "BOLTZMANN": 1.380649e-23,
   "GAS": 8.314462618,
   "EULER_MASCHERONI": 0.5772156649015329
}

constants["PHI"] = constants.GOLDEN_RATIO
constants["π"]   = constants.PI

operators = {
   "+"     : { name: "addition operator"             , func: (a,b) => a + b, prio: 0   },
   "-"     : { name: "subtraction operator"          , func: (a,b) => a - b, prio: 1   }, 
   "*"     : { name: "multiplication operator"       , func: (a,b) => a * b, prio: 2   },
   "/"     : { name: "division operator"             , func: (a,b) => a / b, prio: 3   },
   "**"    : { name: "power operator"                , func: (a,b) => a **b, prio: 4   },
   "%"     : { name: "modular operator"              , func: (a,b) => a % b, prio: 5    },
   "!"     : { name: "factorial operator"            , func: factF         , prio: Infinity },
   "sqrt"  : { name: "square root function"          , func: Math.sqrt     , prio: Infinity },
   "cbrt"  : { name: "cubic root function"           , func: Math.cbrt     , prio: Infinity },
   "ln"    : { name: "natural logarithm function"    , func: x => Math.log(x, Math.E), prio: Infinity },
   "log"   : { name: "logarithmic function"          , func: (x, b) => Math.log(x)/Math.log(b), prio: Infinity },
   "pow"   : { name: "power function"                , func: Math.pow  , prio: Infinity },
   "exp"   : { name: "exponential function"          , func: Math.exp  , prio: Infinity },
   "atan"  : { name: "arctangent function"           , func: Math.atan , prio: Infinity },
   "acos"  : { name: "arccosine function"            , func: Math.acos , prio: Infinity },
   "asin"  : { name: "arcsine function"              , func: Math.asin , prio: Infinity },
   "cos"   : { name: "cosine function"               , func: Math.cos  , prio: Infinity },
   "sin"   : { name: "sine function"                 , func: Math.sin  , prio: Infinity },
   "tan"   : { name: "tangent function"              , func: Math.tan  , prio: Infinity },
   "sinh"  : { name: "hyperbolic sine function"      , func: Math.sinh , prio: Infinity },
   "cosh"  : { name: "hyperbolic cosine function"    , func: Math.cosh , prio: Infinity },
   "tanh"  : { name: "hyperbolic tangent function"   , func: Math.tanh , prio: Infinity },
   "atanh" : { name: "hyperbolic arctangent function", func: Math.atanh, prio: Infinity },
   "asinh" : { name: "hyperbolic arcsine function"   , func: Math.asinh, prio: Infinity },
   "acosh" : { name: "hyperbolic arccosine function" , func: Math.acosh, prio: Infinity },
   "abs"   : { name: "absolute value function"       , func: Math.abs  , prio: Infinity },
}

operators["mod"]       = operators["%"]
operators["^"]         = operators["**"]
operators["√"]         = operators["sqrt"]
operators["fact"]      = operators["!"]
operators["factorial"] = operators["!"]
operators["arccos"]    = operators["acos"]
operators["arcsin"]    = operators["asin"]
operators["arctan"]    = operators["atan"]
operators["arctg"]     = operators["atan"]
operators["tg"]        = operators["tan"]
operators["tang"]      = operators["tan"]
operators["th"]        = operators["tanh"]
operators["sh"]        = operators["sinh"]
operators["ch"]        = operators["cosh"]
operators["argth"]     = operators["atanh"]
operators["argsh"]     = operators["asinh"]
operators["argch"]     = operators["acosh"]
operators["argtanh"]   = operators["atanh"]
operators["argsinh"]   = operators["asinh"]
operators["argcosh"]   = operators["acosh"]

const operators_list = Object.keys(operators)
const constants_list = Object.keys(constants)

function isDigit(x) {
   return (x >= '0' && x <= '9') || x === '.'
}

function isWhiteSpace(x) {
   return /\s/.test(x)
}

function isNumber(data){
   return typeof(data) === "number"
}
function isOperator(data){
   return typeof(data) !== "number"
}

function operatorExists(op){
   return operators_list.includes(op)
}
function calcOutput(output){
   if(output.length === 0) return null
   let i = 0
   while(i<output.length){
      if(isNumber(output[i])) i++
      else {
         const operator = output[i]
         if(operator.func.length === 2){
            if(output[i-2] === undefined){
               if(output[i-1] !== undefined)
                  throw new ArgumentMismatch(`Expected a second argument for ${operator.name}, received one.`)
               else
                  throw new ArgumentMismatch(`Expected exactly 2 arguments for ${operator.name}, received none.`)
            }
            output[i] = operator.func(output[i-2], output[i-1])
         }
         else {
            if(output[i-1] === undefined)
               throw new ArgumentMismatch(`Expected an argument for ${operator.name}.`)
            output[i] = operator.func(output[i-1])
         }
         output = output.slice(0, i-operator.func.length).concat(output.slice(i))
         i -= operator.func.length
      }
   }
   if(output.length > 1)
      throw new ArgumentMismatch("A function has received more arguments than expected, leading to ambiguity.")
   return output[0]
}
function parseNumber(expression){
   const value = parseFloat(expression)
   if(Number.isNaN(value)) throw new SyntaxError(`Invalid Number: ${expression}`)
   return value
}
function parseOperator(expression){
   const operator = operators[expression]
   if(!operator) 
      throw new SyntaxError(`Invalid Operator: ${expression}`)
   return operator
}

function replaceConstants(expression) {
   for (const [key, value] of Object.entries(constants)) {
       expression = expression.replace(new RegExp(`\\b${key}\\b`, 'g'), value);
   }

   return expression;
}

function execute(expression){
   expression = replaceConstants(expression)

   const output = []
   const holdings = [[]]
   let LAST_IS_CHARACTER = false
   let current = ""
  
   function saveNumber(){
      if(!current) return
      const number = parseNumber(current)
      output.push(number)
      current = ""
   }
   function saveOperator(){
      if(!current) return
      const operator = parseOperator(current)
      const holding = holdings[holdings.length-1]

      while(holding.length && operator.prio < holding[holding.length - 1].prio)
         output.push(holding.pop())
      holding.push(operator)
      
      current = ""
   }

   for(const ch of expression) {
      if(isWhiteSpace(ch)) continue
      if(ch === ","){
         if(LAST_IS_CHARACTER) saveOperator()
         else saveNumber()
         const holding = holdings[holdings.length-1]
         while( holding.length )
            output.push(holding.pop())
         continue
      }
      if(ch === ")" || ch === "(" || ch === "]" || ch === "["){
         if(LAST_IS_CHARACTER) saveOperator()
         else saveNumber()
         if(ch === "(" || ch === "[") holdings.push([])
         else {
            const holding = holdings.pop()
            while( holding.length )
               output.push(holding.pop())
         }
         continue
      }


      if(ch === "-"){
         if(LAST_IS_CHARACTER){
            LAST_IS_CHARACTER = false
            saveOperator()
            current = ch
            continue
         } else if (current[current.length - 1] === "e"){
            LAST_IS_CHARACTER = false
            current += ch
            continue
         }
      } else if(ch === "+" && current[current.length - 1] === "e"){
         LAST_IS_CHARACTER = false
         current += ch
         continue
      }

      let CUR_IS_CHARACTER = !isDigit(ch)
      if(CUR_IS_CHARACTER) {
         if(LAST_IS_CHARACTER) {
            if(operatorExists(current) && !operatorExists(current+ch))
               saveOperator()
         }
         else {
            if(ch !== "e")
               saveNumber()
            else
               CUR_IS_CHARACTER = false
         }
      }
      else if (LAST_IS_CHARACTER)
         saveOperator()
      
      current += ch
      LAST_IS_CHARACTER = CUR_IS_CHARACTER
   }
   if(!LAST_IS_CHARACTER) saveNumber()
   else if (LAST_IS_CHARACTER) saveOperator()
   
   while( holdings[0].length )
      output.push(holdings[0].pop())

   return calcOutput(output)
}