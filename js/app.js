//instantiate new objects

const currencyConverterAPI = new CurrencyConverterAPI()
const ui = new UI()

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('sw.js', {scope: '/currencyConverter/'})
        .then(reg => {
        // registration worked
        console.log(`Registration succeeded. Scope is ${reg.scope}`)
        }).catch(error => {
        // registration failed
        console.log(`Registration failed with ${error}`)
        })
    })
  }

let dbPromise = idb.open('currency-db', 1, function(upgradeDb) {
                    upgradeDb.createObjectStore('currencyName',{keyPath: 'id'});
                });


// hold the form
const form = document.getElementById('form')

// add event listener
form.addEventListener('submit', event =>{
    event.preventDefault()

    //read amount
    const amountString = document.getElementById('amount').value
    const amountNumber = parseFloat(amountString)

    // read fromCurrency
    const fromCurrency = document.getElementById('fromCurrency').value

    // read toCurrency
    const toCurrency = document.getElementById('toCurrency').value

    const query = `${fromCurrency}_${toCurrency}`

    if(amountNumber==='' || fromCurrency==='' || toCurrency===''){
        
        //console.log(`All inputs are mandatory`)
        //display an error
        ui.errorMessage('All fields must be filled correctly', 'deep-orange darken-4 card-panel')
    }else{
        //console.log(amountNumber, fromCurrency, toCurrency)
        //Query API
        //console.log(currencyConverterAPI.queryConversionAPI(fromCurrency, toCurrency))
        let converted = currencyConverterAPI.queryConversionAPI(fromCurrency, toCurrency)
        .then(data => {
            return data.results
        }).catch(err =>{console.log(err)})

        //promise chaining ooo
        converted.then(data => {
            //console.log(data)
            for(const value of Object.values(data)){
                //console.log(value)
                ui.displayValue(value.val*amountNumber)
                dbPromise.then(db => {
                    return db
                }).then( dbValue => {
                    let tx = dbValue.transaction('currencyName', 'readwrite')
                    let currencyStore = tx.objectStore('currencyName')
                    currencyStore.put({
                        rate: value.val,
                        id: query
                    })
                    console.log(value.val)
                })
            }
          
        }).catch(err =>{console.log(err)})


        
    }

    

})



