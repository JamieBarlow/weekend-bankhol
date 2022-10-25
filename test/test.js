// Importing app functions and Mocha assert functionality
import { variables, functions } from '../public/js/functions.js'
const assert = chai.assert;

console.log(variables.extraDatesForm);

describe('+', () => {
    it('returns the sum of its arguments', () => {
        assert.isOk(3 + 4 === 7);
    })
})

describe('convertGovDateToDMY', () => {
    it('converts dates returned from Gov API (format YYYY-MM-DD) to UK display format (DD/MM/YYYY)', () => {
        const expected = '01/06/2022';
        const actual = functions.convertGovDateToDMY('2022-06-01');
        assert.strictEqual(actual, expected);
    })
})

describe('convertGovDateToObject', () => {
    it('Converts dates from Gov API (format YYYY-MM-DD) to a JavaScript Date Object', () => {
        const expected = new Date('January 1, 2022');
        const actual = functions.convertGovDateToObject('2022-01-01');
        assert.deepEqual(actual, expected)
    })
})

describe('convertUKDateToObject', () => {
    it('Converts UK format dates (format DD/MM/YYY) to a JavaScript Date Object', () => {
        const expected = new Date('January 1, 2022');
        const actual = functions.convertUKDateToObject('01/01/2022');
        assert.deepEqual(actual, expected);
    })
})

describe('convertJSDateToDMY', () => {
    it('Converts JavaScript Date Object to UK display format (DD/MM/YYYY)', () => {
        const expected = '01/01/2022';
        const actual = functions.convertJSDateToDMY(new Date('January 1, 2022'));
        assert.deepEqual(actual, expected);
    })
})




// To run tests in the browser, use mocha.run() in the console