

import { algorandGlobalInitialData } from '../redux/algorand/global/globalReducers';
import { isEmpty, isNumber } from 'lodash';
import algosdk from 'algosdk';
import { getEndpoints, staticEndpoints } from './endPoints';
import { CacherDomain, Sizes } from './constants/common';
import { getNetworkType } from '@/dashboard/utils/endPoints';

const isMainnet = getNetworkType();

export function removeArrayItemOnce(arr, value) {
  const index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

export function getPreviousWeek(date = new Date()) {
  const previous = new Date(date.getTime());
  previous.setDate(date.getDate() - 7);
  return previous;
}

export function swapArrayElements(arr, i1, i2) {
  let temp = arr[i1];
  arr[i1] = arr[i2];
  arr[i2] = temp;
}

export const arrayMove = (arr, fromIndex, toIndex) => {
  const newArr = [...arr];
  newArr.splice(toIndex, 0, newArr.splice(fromIndex, 1)[0]);
  return newArr;
};

export function signedAlgoToED255(signed) {
  let decodedTxn = algosdk.decodeSignedTransaction(signed);
  let sig = decodedTxn.sig;
  let txnBytes = algosdk.encodeUnsignedTransaction(decodedTxn.txn);
  let prefix = cBuffer('TX');
  let newArray = [...sig, ...prefix, ...txnBytes];
  let u8New = Uint8Array.from(newArray);
  return u8New;
}

function cBuffer(text) {
  let array = [];
  for (let i = 0; i < text.length; i++) {
    array.push(text.charCodeAt(i));
  }

  let buffer = Uint8Array.from(array);
  return buffer;
}

export const noOp = () => null;

export function timeSince(date) {
  const seconds = Math.floor((new Date() - date) / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + ' years';
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + ' months';
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + ' days';
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + ' hours';
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + ' minutes';
  }
  return Math.floor(seconds) + ' seconds';
}

export const updateTheme = (isDarkEnabled) => {
  // Get CSS variables for background/foreground
  const styles = getComputedStyle(document.body);
  const black = styles.getPropertyValue('--black');
  const white = styles.getPropertyValue('--white');
  const docEl = document.documentElement;

  if (isDarkEnabled) {
    docEl.style.setProperty('--background', white);
    docEl.style.setProperty('--foreground', black);
    document.querySelector('body').classList.remove('light');
  } else {
    docEl.style.setProperty('--background', black);
    docEl.style.setProperty('--foreground', white);
    document.querySelector('body').classList.add('light');
    document.querySelector('body').classList.remove('dark');
  }
};

/**
 * Reading a value from local storage always return a string. It can lead to type problems in JavaScript. This method check whether the value is a boolean, number or string and returns the value as the proper type.
 * @param key The local storage key.
 * @param defaultValue Optional default value to return when the item is not found in the local storage.
 */
export function getLocalStorageItemSafely(key, defaultValue = undefined) {
  const value = localStorage.getItem(key);
  if (value !== null) {
    if (['true', 'false'].includes(value)) {
      return Boolean(value === 'true');
    } else if (isNumber(value)) {
      return +value;
    } else {
      return value;
    }
  } else if (defaultValue !== undefined) {
    return defaultValue;
  }
  return null;
}

export const pushToIndex = (arr, index, val) =>
  index >= arr.length
    ? arr.concat(val)
    : arr.reduce((prev, x, i) => prev.concat(i === index ? [val, x] : x), []);

export async function copyTextToClipboard(text) {
  if ('clipboard' in navigator) {
    return await navigator.clipboard.writeText(text);
  } else {
    return document.execCommand('copy', true, text);
  }
}

export function getHoursDiff(startDate, endDate) {
  const msInHour = 1000 * 60 * 60;
  return Math.round(Math.abs(endDate - startDate) / msInHour);
}

export function convertTimeMD(isoStamp) {
  let date = new Date(isoStamp);
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let dt = date.getDate();
  let hours = date.getHours();
  let min = date.getMinutes();
  let sec = date.getSeconds();

  if (dt < 10) {
    dt = '0' + dt;
  }
  if (month < 10) {
    month = '0' + month;
  }

  return month + '-' + dt + ' ' + hours + ':' + min + ':' + sec;
}

export function convertTimeYM(isoStamp) {
  let date = new Date(isoStamp);
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let dt = date.getDate();
  let hours = date.getHours();
  let min = date.getMinutes();
  let sec = date.getSeconds();

  if (dt < 10) {
    dt = '0' + dt;
  }
  if (month < 10) {
    month = '0' + month;
  }

  return year + '-' + month + '-' + dt + ' ' + hours + ':' + min + ':' + sec;
}

/**
 * Gets the current Global Pipe State.
 * @param globalPipeState The current pipe state.
 * @return The current state or the initial pipe state values if the state is empty.
 * */
export function getCurrentGlobalPipeState(globalPipeState) {
  return isEmpty(globalPipeState) ? algorandGlobalInitialData.pipeConnectState : globalPipeState;
}

/**
 * Check whether the Global Pipe State will change with the given input or not.
 * @param globalPipeState The current pipe state.
 * @param newData The presumed changed pipe state.
 * @return Returns true if the input will change the pipe state, false otherwise.
 * */
export function globalPipeStateChanged(globalPipeState, newData) {
  let changed = false;
  Object.entries(newData).forEach(([key, value]) => {
    if (globalPipeState[key] !== value) {
      changed = true;
    }
  });
  return changed;
}

/**
 * Finds each occurrence of a lower case character followed by an upper case character, and insert a space between them.
 * @param s
 */
export function putSpaceBetweenCamelCase(s) {
  return s.replace(/([a-z])([A-Z])/g, '$1 $2');
}

/**
 * Shortens string to `XXXX...XXXX`, with `XXX` padding determined by optional `pad` parameter
 */
export function truncateString(str, pad = 6) {
  if (str) {
    const { length } = str;
    const start = str.substring(0, pad);
    return `${start}...${str.substring(length - pad, length)}`;
  }
}

export function truncateMicroString(str, pad = 5) {
  if (str) {
    const { length } = str;
    const start = str.substring(0, pad);
    return `${start}...${str.substring(length - pad, length)}`;
  }
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

async function getAlgoPrice() {
  let data = await fetch(isMainnet ? staticEndpoints.algoPrice : null);
  let dataJSON = await data.json();
  let price = dataJSON.price;
  let open_24h = dataJSON.open_24h;
  let change_24h = ((price - open_24h) / open_24h) * 100;

  return { price, open_24h, change_24h };
}

function calculateOpen24h(currentPrice, change24h) {
  return currentPrice / (1 + change24h / 100);
}

async function getAssetPrice(assetId) {
  let data = await fetch(staticEndpoints.assetPrice + `${assetId}/list?currency=USD`);
  let dataJSON = await data.json();
  let price = dataJSON.price;
  let open_24h = calculateOpen24h(dataJSON.price, dataJSON.change24h);
  let change_24h = dataJSON.change24h;
  let name = dataJSON.name;
  let ticker = dataJSON.ticker;

  return { price, open_24h, change_24h, name, ticker };
}



export async function getBalances(address, assetArray = [], all = false) {
  const endPoints = getEndpoints();
  let baseUrl = endPoints.indexer + 'accounts/';

  let data = await fetch(baseUrl + address);
  let dataJSON = await data.json();

  let algos = dataJSON.account.amount;

  let assets = {};

  if (dataJSON.account?.assets) {
    dataJSON.account.assets.forEach((aobject) => {
      if (!all) {
        if (assetArray.includes(aobject['asset-id'])) {
          assets[aobject['asset-id']] = aobject.amount;
        }
      } else {
        assets[aobject['asset-id']] = aobject?.amount || 0;
      }
    });
  }

  return {
    algo: algos,
    assets: assets,
  };
}

/* test usage

getBalances("ZW3ISEHZUHPO7OZGMKLKIIMKVICOUDRCERI454I3DB2BH52HGLSO67W754", [473073010]).then(DATA => {
  console.log(DATA)
})
*/

// Image caching
export function getFallbackSrc(url) {
  return url?.replace('https://ipfs.io/ipfs/', CacherDomain.IPFS) + `?w=${Sizes.general}&fit=clip`;
}

export function getCacherImageUrl(url, width) {
  const endPoints = getEndpoints();
  if (url) {
    if (url.startsWith(endPoints.ipfs)) {
      return url.replace(endPoints.ipfs, CacherDomain.IPFS) + `?w=${width}&fit=clip`;
    }
  }
  return url;
}
