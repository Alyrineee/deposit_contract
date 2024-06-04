import { address, Cell, Slice, toNano, } from "@ton/core";
import { DepositContract } from "../wrappers/DepositContract";
import { compile, NetworkProvider } from "@ton/blueprint";

export async function run(provider: NetworkProvider) {
    const myContract = DepositContract.createFromConfig(
        {
            telegram_id: 5253078747,
        },
        await compile("DepositContract")
    );

    const openedContract = provider.open(myContract);

    openedContract.sendDeploy(provider.sender(), toNano("0.05"));

    await provider.waitForDeploy(myContract.address);
}