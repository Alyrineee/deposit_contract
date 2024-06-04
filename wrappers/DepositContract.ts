import { SendMode,beginCell,contractAddress,Address, Contract,Cell,ContractProvider,Sender,Slice} from "@ton/core";

export type depositContractConfig = {
    telegram_id: number,
};

export function depositContractConfigToCell(config: depositContractConfig): Cell {
    return beginCell()
    .storeUint(config.telegram_id, 64)
    .endCell();
}

export class DepositContract implements Contract{
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell }
      ) {}
    
      static createFromConfig(
        config: depositContractConfig,
        code: Cell,
        workchain = 0
      ) {
        const data = depositContractConfigToCell(config);
        const init = { code, data };
        const address = contractAddress(workchain, init);
        return new DepositContract(address, init);
      }
      async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
          value,
          sendMode: SendMode.PAY_GAS_SEPARATELY,
          body: 
          beginCell()    
          .endCell(),
        });
    }
    

}