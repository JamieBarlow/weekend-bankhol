const button = document.querySelector('#getDates');
const results = document.querySelector('#results')
let year = document.querySelector('#year-select');
year.value = 2017;

const getDates = () => {
    fetch(`https://www.gov.uk/bank-holidays.json`)
    .then(res => {
        if (res.ok) {
            console.log("RESOLVED!", res);
            return res.json();
        }
        throw new Error('request failed!');
}, networkError => console.log(networkError.message))
    .then(data => {
        const result = (data['england-and-wales'].events);
        const dates = result.map(a => a.date);
        const thisYear = dates.filter(date => date.slice(0, 4) === year);
        displayDates(thisYear);
    })
    
}

const displayDates = (dates) => {
    const header = document.createElement('h2');
    header.innerText = "Bank holiday dates:";
    const list = document.createElement('ul');
    results.append(header, list);
    for (date of dates) {
        const listItem = document.createElement('li');
        listItem.innerText = date;
        list.append(listItem);
    }
    console.log(dates);
}

year.addEventListener('change', function() {
    year = year.value;
});

button.addEventListener('submit', function(e) {
    e.preventDefault();
    getDates();
})

