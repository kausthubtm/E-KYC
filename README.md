# E-KYC
It is an application for maintaining e-KYC using blockchains with the help of Hyperledger Fabric.
This tool will help various organizations to join hands and store the data oftheir users in the network, thus minimizing the redundant process of getting
the user data for each organization.

### Installation

- Refer to [prerequisites](https://hyperledger-fabric.readthedocs.io/en/release-2.2/prereqs.html) for setting up the necessary environment to run HyperLedger Fabic.
- Refer to [download](https://hyperledger-fabric.readthedocs.io/en/release-2.2/install.html) to install the Samples, Binaries, and Docker Images.
- Refer to [Getting started]() to check whether Hyperledger works and also to understand its working.
- Download or clone the code and add the folders 'e-KYC_application' and 'e-KYC_chaincode' in the fabric-samples folder. 

### Set up of the project

#### `$ cd .../fabric-samples/e-KYC_application`
Move to the 'e-KYC_application' folder

#### `$ ./networkStart.sh`
This brings up the test-network which containes three Peers and two organisations : one is Peer0 in Org1, another one is Peer0 in Org2 and last one is an orderer peer. The command also creates a channel called 'mychannel' and deploys the chaincode in the network. 

#### `$ cd application`
Move into the 'application' folder

#### `$ npm install`
Install node modules and necessary files required. 

#### `$ node app.js`
This enables us to pass queries or invoke or interact with the network.
