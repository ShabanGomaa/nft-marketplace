const { ethers, network, deployments, getNamedAccounts } = require("hardhat")
const { expect, assert } = require("chai")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Nft Marketplace Tests", function () {
          let nftMarketplace, basicNft, deployer, player
          const price = ethers.utils.parseEther("0.1")
          const tokenId = 0
          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              //   player = (await getNamedAccounts()).player
              const accounts = await ethers.getSigners()
              player = accounts[1]

              await deployments.fixture("all")
              nftMarketplace = await ethers.getContract("NftMarketplace")
              basicNft = await ethers.getContract("BasicNft")
              await basicNft.mintNft()
              await basicNft.approve(nftMarketplace.address, tokenId)
          })

          it("Lists and can be bought", async function () {
              await nftMarketplace.listItem(basicNft.address, tokenId, price)
              const playerConnectedNftMarketplace = nftMarketplace.connect(player)
              await playerConnectedNftMarketplace.buyItem(basicNft.address, tokenId, {
                  value: price,
              })
              const newOwner = await basicNft.ownerOf(tokenId)
              const deployerProceeds = await nftMarketplace.getProceeds(deployer)
              assert(newOwner.toString() == player.address)
              assert(deployerProceeds.toString() == price.toString())
          })

          //   it("Lists and can be canceled", async function () {
          //       await nftMarketplace.listItem(basicNft.address, tokenId, price)
          //       const playerConnectedNftMarketplace = nftMarketplace.connect(player)
          //       await playerConnectedNftMarketplace.cancelListing(basicNft.address, tokenId)
          //       const deployerProceeds = await nftMarketplace.getProceeds(deployer)
          //       console.log(`deployerProceeds:${deployerProceeds}`)
          //       assert(deployerProceeds.toString() == "")
          //   })
      })
