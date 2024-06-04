import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { Cell, StateInit,TonClient, WalletContractV4, beginCell, contractAddress, internal, storeStateInit } from "@ton/ton";
import { mnemonicNew, mnemonicToPrivateKey } from "@ton/crypto";
import './index.css'
import { hex } from "../build/main.compiled.json";
import { TonConnectUIProvider } from '@tonconnect/ui-react';



const manifestUrl = 'https://raw.githubusercontent.com/ton-community/tutorials/main/03-client/test/public/tonconnect-manifest.json';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <TonConnectUIProvider manifestUrl={manifestUrl}>
    <App />
  </TonConnectUIProvider>,
)
