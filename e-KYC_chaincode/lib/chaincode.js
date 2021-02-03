'use strict';

const { Contract } = require('fabric-contract-api');

class ChainCode extends Contract {

    async InitLedger(ctx) {
        const customers = [
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

        for (const customer of customers) {
            customer.docType = 'customer';
            await ctx.stub.putState(customer.ID, Buffer.from(JSON.stringify(customer)));
            console.info(`Customer ${customer.ID} initialized`);
        }
    }

    async ReadCustomer(ctx, id) {
        const customerJSON = await ctx.stub.getState(id);
        if (!customerJSON || customerJSON.length === 0) {
            throw new Error(`The customer with ID = ${id} does not exist`);
        }
        return customerJSON.toString();
    }

    async CreateCustomer(ctx, id, name, gender, pan, aadarNo, bank) {
        const customer = {
            ID: id,
            Name: name,
            Gender: gender,
            Pan: pan,
            Aadar_no: aadarNo,
            Bank: bank,
        };
        ctx.stub.putState(id, Buffer.from(JSON.stringify(customer)));
        return JSON.stringify(customer);
    }
    
    async UpdateCustomer(ctx, id, name, gender, pan, aadarNo, bank) {
        const exists = await this.CustomerExists(ctx, id);
        if (!exists) {
            throw new Error(`The customer with ID = ${id} does not exist`);
        }

        const updatedCustomer = {
            ID: id,
            Name: name,
            Gender: gender,
            Pan: pan,
            Aadar_no: aadarNo,
            Bank: bank,
        };
        return ctx.stub.putState(id, Buffer.from(JSON.stringify(updatedCustomer)));
    }
    
    async DeleteCustomer(ctx, id) {
        const exists = await this.CustomerExists(ctx, id);
        if (!exists) {
            throw new Error(`The customer with ID = ${id} does not exist`);
        }
        return ctx.stub.deleteState(id);
    }

    async CustomerExists(ctx, id) {
        const customerJSON = await ctx.stub.getState(id);
        return customerJSON && customerJSON.length > 0;
    }

    async TransferCustomer(ctx, id, newPan) {
        const customerString = await this.ReadCustomer(ctx, id);
        const customer = JSON.parse(customerString);
        customer.Pan = newPan;
        return ctx.stub.putState(id, Buffer.from(JSON.stringify(customer)));
    }

    async GetAllCustomers(ctx) {
        const allCustomers = [];
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
            allCustomers.push({ Key: result.value.key, Record: record });
            result = await iterator.next();
        }
        return JSON.stringify(allCustomers);
    }


}

module.exports = ChainCode;
