import { createSlice } from "@reduxjs/toolkit";
import { isArray } from "lodash";
import { prettyRound } from "@/dashboard/utils/functions";
import localStore from "store";
import {
  NETWORKS_KEY,
  USER_DATA_KEY,
} from "@/dashboard/utils/constants/common";

// Slice

const slice = createSlice({
  name: "searchData",
  initialState: {
    networks: localStore.get(NETWORKS_KEY) || {
      networks: [],
    },
    userData: { apps: {} },
    algoUsdPrice: 0,
    btcUsdPrice: 0,
    ethUsdPrice: 0,
  },
  reducers: {
    changeNetworks: (state, action) => {
      state.networks = action.payload;
    },
    changeUserData: (state, action) => {
      state.userData = action.payload;
    },


    changeAlgoUsdPrice: (state, action) => {
      state.algoUsdPrice = action.payload;
    },
    changeBtcUsdPrice: (state, action) => {
      state.btcUsdPrice = action.payload;
    },
    changeEthUsdPrice: (state, action) => {
      state.ethUsdPrice = action.payload;
    },
  },
});

export default slice.reducer;

// Actions

const {
  changeNetworks,
  changeUserData,
  changeAlgoUsdPrice,
  changeBtcUsdPrice,
  changeEthUsdPrice,
} = slice.actions;

export const updateNetworks: any = (networks) => (dispatch) => {
  localStore.set(NETWORKS_KEY, networks);
  dispatch(changeNetworks(networks));
};

export const updateUserData: any = (userData) => (dispatch) => {
  localStore.set(USER_DATA_KEY, userData);
  dispatch(changeUserData(userData));
};


export const updateAlgoUsdPrice = () => async (dispatch) => {
  const now = Math.floor(Date.now() / 1000);
  const start = now - 86400;
  const data = await fetch(
    `https://price.algoexplorerapi.io/price/algo-usd/history?since=${start}&until=${now}&interval=1H`,
  );
  if (data) {
    const dataJson = await data.json();
    if (dataJson?.history) {
      const newPrice = dataJson.history[dataJson.history.length - 1].high;
      dispatch(changeAlgoUsdPrice(prettyRound(newPrice, 2)));
    }
  }
};

export const updateBtcUsdPrice = () => async (dispatch) => {
  const now = Math.floor(Date.now() / 1000);
  const start = now - 86400;
  const data = await fetch(
    `https://price.algoexplorerapi.io/price/btc-usd/history?since=${start}&until=${now}&interval=1H`,
  );
  if (data) {
    const dataJson = await data.json();
    if (dataJson?.history) {
      const newPrice = dataJson.history[dataJson.history.length - 1].high;
      dispatch(changeBtcUsdPrice(prettyRound(newPrice, 2)));
    }
  }
};

export const updateEthUsdPrice = () => async (dispatch) => {
  const data = await fetch("https://api.myalgo.com/asset/prices");
  if (data) {
    const dataJson = await data.json();
    if (isArray(dataJson)) {
      const filtered = dataJson.filter((item) => item.assetId === 386195940);
      if (filtered?.length === 1) {
        const price = prettyRound(filtered[0].averagePrice, 2);
        dispatch(changeEthUsdPrice(price));
      }
    }
  }
};
