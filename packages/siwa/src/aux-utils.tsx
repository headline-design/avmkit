export const parseIntegerNumber = (number: string): number => {
    const parsed = parseInt(number);
    //@ts-ignore
    if(parsed === NaN) throw new Error("Invalid number.");
    if(parsed === Infinity) throw new Error("Invalid number.");
    return parsed;
  }