/* eslint-disable import/no-anonymous-default-export */

import actions from './globalActions'
import { DefaultPipeState, PIPECONNECT_STATE_KEY } from '@/dashboard/utils/constants/common'

interface ReducerData {
    type: string
    payload?: any
}

declare global {
    interface Window {
        localStorage: Storage
    }
}

export const algorandGlobalInitialData = {
    pipeConnectState: DefaultPipeState,
}

export default (state = algorandGlobalInitialData, { type, payload }: ReducerData) => {
    if (type === actions.PIPE_CONNECT_CHANGE) {
        localStorage.setItem(PIPECONNECT_STATE_KEY, JSON.stringify(payload))
        return {
            ...state,
            pipeConnectState: payload,
        }
    }

    if (type === actions.FETCH_STARTED) {
        return {
            ...state,
            loading: true,
        }
    }

    if (type === actions.FETCH_SUCCESS) {
        return {
            ...state,
            loading: false,
        }
    }

    if (type === actions.FETCH_ERROR) {
        return {
            ...state,
            loading: false,
        }
    }

    return state
}
