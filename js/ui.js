// create the UI class
class UI {
    constructor(){
        this.init()
    }
    init(){
        this.printCurrencies()
    }
    // Prints the options to be selected
    printCurrencies() {
        let dbPromise = idb.open('currency-db', 3, upgradeDb => {
            switch(upgradeDb.oldVersion){
                case 0:
                    upgradeDb.createObjectStore('allCurrencyName')
                case 1:
                    upgradeDb.createObjectStore('converter',{keyPath: 'id'})
            }
            
            
        });
        currencyConverterAPI.getCurrenciesList()
             .then(data => {
                //console.log(data)
                const currencies = data.currencies
                const results = currencies.results
                //console.log(results)
                //build the <select> from the values
                const selectFrom = document.querySelector('#fromCurrency')
                
                for(const currency of Object.values(results)){
                    // add the options
                    const option = document.createElement('option')
                    option.value = currency.id 
                    option.appendChild(document.createTextNode(currency.currencyName))
                    selectFrom.appendChild(option)
                    //console.log(`${currency.id} -- ${currency.currencyName}`
                    dbPromise.then(db => {
                        const tranx = db.transaction('allCurrencyName', 'readwrite')
                        const nameDb = tranx.objectStore('allCurrencyName')
                        nameDb.put(`${currency.id}`, `${currency.currencyName}`)
                    })
                }
                const selectTo = document.querySelector('#toCurrency')
                for(const currency of Object.values(results)){
                    // add the options
                    const option = document.createElement('option')
                    option.value = currency.id 
                    option.appendChild(document.createTextNode(currency.currencyName))
                    selectTo.appendChild(option)
                    //console.log(`${currency.id} -- ${currency.currencyName}`)
                    dbPromise.then(db => {
                        const tranx = db.transaction('allCurrencyName', 'readwrite')
                        const nameDb = tranx.objectStore('allCurrencyName')
                        nameDb.put(`${currency.id}`, `${currency.currencyName}`)
                    })
                }
                
                      
            }).catch(err =>{console.log(err)})
    }
    // error message card
    errorMessage(message, className){
        const div = document.createElement('div')
        div.className = className
        div.appendChild(document.createTextNode(message))

        const msgDiv = document.querySelector('.messages')
        msgDiv.appendChild(div)

        //remove the error message after 4 seconds
        setTimeout(() => {
            document.querySelector('.messages div').remove()
        },
            4000)
    }

    //display converted currency
    displayValue(value){
        //console.log(value)
        let valueHTML = ``
        valueHTML += `
        <div class="card green darken-4">
            <div class="card-content white-text">
                <span class="card-title">Result</span>
                <p>${value}</p>
            </div>
        </div>
        `
        const divResult = document.querySelector('#result')
        divResult.innerHTML = valueHTML
    }
}