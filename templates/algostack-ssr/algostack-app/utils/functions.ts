import { algorandGlobalInitialData } from "../redux/algorand/global/globalReducers";
import { isEmpty, isNumber } from "lodash";

/**
 * Reading a value from local storage always return a string. It can lead to type problems in JavaScript. This method checks whether the value is a boolean, number, or string and returns the value as the proper type.
 * @param key The local storage key.
 * @param defaultValue Optional default value to return when the item is not found in the local storage.
 */
export function getLocalStorageItemSafely(key, defaultValue = undefined) {
  // Check if we are in a browser environment
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    const value = localStorage.getItem(key);
    if (value !== null) {
      if (["true", "false"].includes(value)) {
        return value === "true";
      } else if (!isNaN(Number(value)) && isFinite(Number(value))) {
        return +value;
      } else {
        return value;
      }
    } else if (defaultValue !== undefined) {
      return defaultValue;
    }
    return null;
  } else {
    // Return defaultValue if in SSR environment
    return defaultValue !== undefined ? defaultValue : null;
  }
}

/**
 * Gets the current Global Pipe State.
 * @param globalPipeState The current pipe state.
 * @return The current state or the initial pipe state values if the state is empty.
 * */
export function getCurrentGlobalPipeState(globalPipeState) {
  return isEmpty(globalPipeState)
    ? algorandGlobalInitialData.pipeConnectState
    : globalPipeState;
}

/**
 * Rounds a number without unnecessary trailing zeros
 * @param num Number to round.
 * @param decimals Round the number to this many decimals or the default value if missing.
 * @return The rounded number or undefined it the param was undefined.
 * */
export function prettyRound(num, decimals = 3) {
  if (isNumber(num)) {
    return parseFloat(num.toFixed(decimals));
  }
  return num;
}
