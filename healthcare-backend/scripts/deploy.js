const hre = require("hardhat");

async function main() {
    const Healthcare = await hre.ethers.getContractFactory("Healthcare");
    const contract = await Healthcare.deploy();

    await contract.deployed();
    console.log("Address of contract:", contract.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
