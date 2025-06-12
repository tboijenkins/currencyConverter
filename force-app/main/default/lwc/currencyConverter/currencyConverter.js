import { LightningElement } from 'lwc';
import getExchangeRate from '@salesforce/apex/CurrencyConverterController.getExchangeRate';

export default class CurrencyConverter extends LightningElement {
  amount = 0;
  toCurrency = '';
  convertedAmount = null;
  lastCurrency = '';

  connectedCallback() {
    console.log('CurrencyConverter component connected.');
  }

  handleAmountChange(event) {
    this.amount = event.target.value;
  }

  handleToChange(event) {
    this.toCurrency = event.target.value.toUpperCase();
  }

  convertCurrency() {
    getExchangeRate({ toCurrency: this.toCurrency })
      .then(rate => {
        this.convertedAmount = (this.amount * rate).toFixed(2);
      })
      .catch(error => {
        console.error('Error fetching exchange rate', error);
      });

      this.lastCurrency = this.toCurrency;
  }
}
