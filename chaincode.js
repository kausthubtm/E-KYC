/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class ChainCode extends Contract {

    async InitLedger(ctx) {
        const assets = [
            {
                ID: '1',
                Name: 'Kausthub',
                Gender: 'M',
                Pan: 123,
                Aadar_no: 2323,
                Bank: 'abc',
            },
            {
                ID: '2',
                Name: 'Devika',
                Gender: 'F',
                Pan: 223,
                Aadar_no: 4643,
                Bank: 'xyz',
            },
            {
                ID: '3',
                Name: 'Nithin',
                Gender: 'M',
                Pan: 323,
                Aadar_no: 7823,
                Bank: 'abc'
            },
            {
                ID: '4',
                Name: 'Deeksha',
                Gender: 'F',
                Pan: 423,
                Aadar_no: 2532,
                Bank: 'abc'
            },
            {
                ID: '5',
                Name: 'David',
                Gender: 'M',
                Pan: 523,
                Aadar_no: 9832,
                Bank: 'xyz'
            },
        ];

        for (const asset of assets) {
            asset.docType = 'asset';
            await ctx.stub.putState(asset.ID, Buffer.from(JSON.stringify(asset)));
            console.info(`Asset ${asset.ID} initialized`);
        }
    }

    async ReadAsset(ctx, id) {
        const assetJSON = await ctx.stub.getState(id); // get the asset from chaincode state
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`The asset ${id} does not exist`);
        }
        return assetJSON.toString();
    }

    async CreateAsset(ctx, id, name, gender, pan, aadarNo, bank) {
        const asset = {
            ID: id,
            Name: name,
            Gender: gender,
            Pan: pan,
            Aadar_no: aadarNo,
            Bank: bank,
        };
        ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));
        return JSON.stringify(asset);
    }
    
    async UpdateAsset(ctx, id, name, gender, pan, aadarNo, bank) {
        const exists = await this.AssetExists(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }

        // overwriting original asset with new asset
        const updatedAsset = {
            ID: id,
            Name: name,
            Gender: gender,
            Pan: pan,
            Aadar_no: aadarNo,
            Bank: bank,
        };
        return ctx.stub.putState(id, Buffer.from(JSON.stringify(updatedAsset)));
    }
    
    // DeleteAsset deletes an given asset from the world state.
    async DeleteAsset(ctx, id) {
        const exists = await this.AssetExists(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }
        return ctx.stub.deleteState(id);
    }

    // AssetExists returns true when asset with given ID exists in world state.
    async AssetExists(ctx, id) {
        const assetJSON = await ctx.stub.getState(id);
        return assetJSON && assetJSON.length > 0;
    }

    // TransferAsset updates the owner field of asset with given id in the world state.
    async TransferAsset(ctx, id, newPan) {
        const assetString = await this.ReadAsset(ctx, id);
        const asset = JSON.parse(assetString);
        asset.Pan = newPan;
        return ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));
    }

    async GetAllAssets(ctx) {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: result.value.key, Record: record });
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }


}

module.exports = ChainCode;
