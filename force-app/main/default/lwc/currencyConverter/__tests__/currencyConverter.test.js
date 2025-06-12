import { createElement } from 'lwc';
import CurrencyConverter from 'c/currencyConverter';
import getExchangeRate from '@salesforce/apex/CurrencyConverterController.getExchangeRate';

jest.mock(
    '@salesforce/apex/CurrencyConverterController.getExchangeRate',
    () => ({
        default: jest.fn()
    }),
    { virtual: true }
);

describe('c-currency-converter', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        jest.clearAllMocks();
    });

    it('converts currency correctly and displays result', async () => {
        getExchangeRate.mockResolvedValue(0.85); // z.B. 1 USD = 0.85 EUR

        const element = createElement('c-currency-converter', {
            is: CurrencyConverter
        });
        document.body.appendChild(element);

        const inputs = element.shadowRoot.querySelectorAll('lightning-input');

        inputs[0].value = '100';
        inputs[0].dispatchEvent(new CustomEvent('change', {
            detail: { value: '100' }
        }));
        inputs[0].dispatchEvent(new CustomEvent('change'));

        inputs[2].value = 'USD';
        inputs[2].dispatchEvent(new CustomEvent('change', {
            detail: { value: 'USD' }
        }));
        inputs[2].dispatchEvent(new CustomEvent('change'));

        const button = element.shadowRoot.querySelector('lightning-button');
        button.click();

        await Promise.resolve();
        await new Promise((resolve) => setTimeout(resolve, 0)); 

        const result = element.shadowRoot.querySelector('p');
        expect(result.textContent).toContain('85.00 USD');
    });
});
