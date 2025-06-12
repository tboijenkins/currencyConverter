public with sharing class CurrencyConverterController {
    
    @AuraEnabled(cacheable=true)
    public static Decimal getExchangeRate(String toCurrency) {
        String apiKey = 'e776de4e71867518a0dfd2be29885435';
        String url = 'http://data.fixer.io/api/latest?access_key=' + apiKey + '&symbols=' + toCurrency;


        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint(url);
        request.setMethod('GET');
        HttpResponse response = http.send(request);

        if (response.getStatusCode() == 200) {
            Map<String, Object> result = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
            if ((Boolean) result.get('success')) {
                Map<String, Object> rates = (Map<String, Object>) result.get('rates');
                return Decimal.valueOf(String.valueOf(rates.get(toCurrency)));
            } else {
                throw new AuraHandledException('Fixer API Error: ' + result.get('error'));
            }
        } else {
            throw new AuraHandledException('HTTP Error: ' + response.getStatus());
        }
    }

}