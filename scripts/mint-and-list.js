const { ethers, network } = require("hardhat")

const { moveBlocks } = require("../utils/move-blocks")

const PRICE = ethers.utils.parseEther("0.1")

async function mintAndList() {
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    const basicNft = await ethers.getContract("BasicNft")
    console.log("Minting")
    const mintTrx = await basicNft.mintNft()
    const mintTrxReceipt = await mintTrx.wait(1)
    const tokenId = mintTrxReceipt.events[0].args.tokenId
    console.log("Approving NFT")

    const approvalTrx = await basicNft.approve(nftMarketplace.address, tokenId)
    await approvalTrx.wait(1)
    console.log("Listing Nft...")
    const trx = await nftMarketplace.listItem(basicNft.address, tokenId, PRICE)
    await trx.wait(1)
    console.log("Listed!")
    if (network.config.chainId == "31337") {
        await moveBlocks(1, (sleepAmount = 1000))
    }
}

mintAndList()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
