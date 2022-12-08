const { ethers, network } = require("hardhat")
const fs = require("fs")

const frontendContractsFile =
    "../nextjs-nft-marketplace-moralis-fcc-me/constants/networkMapping.json"
const frontEndAbiLocation = "../nextjs-nft-marketplace-moralis-fcc-me/constants/"

module.exports = async function () {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Updating frontend")
        return
        await updateContractAddress()
        await updateAbi()
    }
}

async function updateAbi() {
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    fs.writeFileSync(
        `${frontEndAbiLocation}NftMarketplace.json`,
        nftMarketplace.interface.format(ethers.utils.FormatTypes.json)
    )

    const basicNft = await ethers.getContract("BasicNft")
    fs.writeFileSync(
        `${frontEndAbiLocation}BasicNft.json`,
        basicNft.interface.format(ethers.utils.FormatTypes.json)
    )
}

async function updateContractAddress() {
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    console.log("nftMarketplace")

    const chainId = network.config.chainId.toString()
    console.log(`chainId==${chainId}`)
    const contractAddresses = JSON.parse(fs.readFileSync(frontendContractsFile, "utf8"))

    if (chainId in contractAddresses) {
        console.log(`contractAddresses[chainId] ${contractAddresses[chainId]}`)

        if (!contractAddresses[chainId]["NftMarketplace"].incudes(nftMarketplace.address)) {
            contractAddresses[chainId]["NftMarketplace"].push(nftMarketplace.address)
        }
    } else {
        contractAddresses[chainId] = { NftMarketplace: [nftMarketplace.address] }
    }
    console.log(`contractAddresses==${contractAddresses}`)
    console.log(`nftMarketplace.address==${nftMarketplace.address}`)

    fs.writeFileSync(frontendContractsFile, JSON.stringify(contractAddresses))
}

module.exports.tags = ["all", "frontend"]
