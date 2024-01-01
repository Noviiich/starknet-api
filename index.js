require('dotenv').config();
const { Account, Provider, defaultProvider, callContract, RpcProvider, cairo, CallData } = require('starknet');

// Load environment variables
// const privateKey = process.env.PRIVATE_KEY || '0x0';
// const walletAddress = process.env.WALLET_ADDRESS || '0x0';
const privateKey = "0x51c2eecf9c0d9ce70989414eda5887f0fda7300649a07973bae1f7fcc860d3f";
const walletAddress = "0x1E490291FBe5690D7afE6F972ED53AE3abDa4Bd1852413E847b1f5f162A1805";
const URL = "https://starknet-mainnet.infura.io/v3/45046923615c4d60a17f3bf8f3fd21cf";

(async () => {
    try {
        // Initialize provider and account
        const provider = new RpcProvider({ nodeUrl: URL });
        const account = new Account(provider, walletAddress, privateKey, '1');

        // Call contracts using multicall
        const multiCallResult = await account.execute(
            [
                {
                    // Calling the first contract
                    contractAddress: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
                    entrypoint: "approve",
                    // approve 1 wei for bridge
                    calldata: CallData.compile({
                        spender: "0x10884171baf1914edc28d7afb619b40a4051cfae78a094a55d230f19e944a28", // spender
                        ampunt: cairo.uint256(100000000000000),
                    })
                },
                {
                    // Calling the second contract
                    contractAddress: "0x010884171baf1914edc28d7afb619b40a4051cfae78a094a55d230f19e944a28",
                    entrypoint: "swap",
                    // transfer 1 wei to the contract address
                    calldata: CallData.compile({
                        pool_id: cairo.felt("0x1"),
                        token_from_addr: cairo.felt("0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7"),
                        amount_from: cairo.uint256(100000000000000),
                        amount_to_min: cairo.uint256(180026)
                    })
                }
            ]
        );
        console.log(`Transaction sent with hash: ${multiCallResult.transaction_hash}`);
        // Wait for the transaction to be confirmed
        await provider.waitForTransaction(multiCallResult.transaction_hash);
    } catch (error) {
        console.error('Error occurred:', error);
    }
})();
