import { isNumber } from 'lodash'

declare global {
    interface Window {
        localStorage: Storage
    }
}

/**
 * Reading a value from local storage always returns a string. It can lead to type problems in JavaScript. This method checks whether the value is a boolean, number, or string and returns the value as the proper type.
 * @param key The local storage key.
 * @param defaultValue Optional default value to return when the item is not found in the local storage.
 */
export function getLocalStorageItemSafely(key, defaultValue = undefined) {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const value = localStorage.getItem(key)
        if (value !== null) {
            if (['true', 'false'].includes(value)) {
                return Boolean(value === 'true')
            } else if (isNumber(value)) {
                return +value
            } else {
                return value
            }
        } else if (defaultValue !== undefined) {
            return defaultValue
        }
        return null
    } else {
        return defaultValue !== undefined ? defaultValue : null
    }
}

export function getLocalStorage(name: string) {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        return localStorage.getItem(name)
    }
    return null
}

export function setLocalStorage(name: string, value: any) {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(name, JSON.stringify(value))
    }
}

export function deleteLocalStorage(name: string) {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.removeItem(name)
    }
}

export function clearLocalStorage() {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.clear()
    }
}

export function clearLocalStorageExcept(exceptions: string[]) {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const keys = Object.keys(localStorage);
        for (let key of keys) {
            if (!exceptions.includes(key)) {
                localStorage.removeItem(key);
            }
        }
    }
}
