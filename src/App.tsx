
import './App.css'
import { TonConnectButton, useTonConnectUI } from '@tonconnect/ui-react';
import { Cell, StateInit,TonClient, WalletContractV4, beginCell, contractAddress, internal, storeStateInit, toNano } from "@ton/ton";
import { mnemonicToPrivateKey } from "@ton/crypto";
import { hex } from "../build/main.compiled.json";
function App() {

    const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));
    const [tonConnectUI, setOptions] = useTonConnectUI();
    //--------------------------------------------------------------------
    //                 СОЗДАНИЯ ДАННЫХ ДЛЯ СМАРТ_КОНТРАКТА
    //--------------------------------------------------------------------
    const codeCell = Cell.fromBoc(Buffer.from(hex, "hex"))[0];
    const dataCell =
        beginCell()
        .storeUint(112312864,64) //Первое число это telegram id
        .endCell();
    
    const stateInit: StateInit = {
        code: codeCell,
        data: dataCell,
    };
    
    const ad = contractAddress(0, {
        code: codeCell,
        data: dataCell,
    });
    //--------------------------------------------------------------------
    //                 ФУНКЦИЯ ДЕПЛОЯ ЭТОГО КОНТРАКТА
    //--------------------------------------------------------------------
    async function deploy (){

        const client = new TonClient({
            endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
        });
        //Тут надо вводить seed-фразу кошелька который будет создавать контракты
        let mnemonics = 'claim ceiling leaf gauge old acquire option summer rib puppy first swear lizard season nut stereo mercy season saddle satisfy point broom catch flip'.split(" ");
        let keyPair = await mnemonicToPrivateKey(mnemonics);

        let workchain = 0;
        let wallet = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey });

        await sleep(10000);
        let contract = client.open(wallet);
        await sleep(10000);
        let seqno: number = await contract.getSeqno();
        await sleep(10000);
        
        await contract.sendTransfer({
            seqno,
            secretKey: keyPair.secretKey,
            messages: [internal({
                value: '0.01',
                to: ad,
                init: stateInit,
            })]
        })
    }
  return (
    <>
        <TonConnectButton/>
        <br/>
        <br/>
        <button onClick={() => deploy()}>Создать контракт</button> 
        <h3>Адрес контракта: {ad.toString()}</h3>
        <br/>   
        <br/>
        <br/>
        <input placeholder='$TON' type='number' id='ton'/>
        <br/>
        <a onClick={() => {
            const transaction = {
                validUntil: Math.floor(Date.now() / 1000) + 360,
                messages: [
                    {
                        address: ad.toString(), // destination address
                        amount: toNano(Number(document.getElementById('ton')?.value)).toString(10), //Toncoin in nanotons
                    },    
                ]
            }
            tonConnectUI.sendTransaction(transaction).then(() =>{location.reload()})                        
        }}>отправить деньги</a>
    </>
  )
}

export default App
