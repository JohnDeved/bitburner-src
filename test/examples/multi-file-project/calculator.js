/** @param {NS} ns */
export async function main(ns, a, b) {
  const num1 = parseInt(a) || 0;
  const num2 = parseInt(b) || 0;
  const sum = num1 + num2;
  
  ns.tprint(`Calculator: ${num1} + ${num2} = ${sum}`);
  
  return sum;
}
