const button = document.querySelector('#getDates');
const results = document.querySelector('#results')
let year = document.querySelector('#year-select');
// year.value = "2017";

const getBankHols = () => {
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
        displayBankHols(thisYear);
        getWeekends(year);
    })
}

const convertDateToUK = (date) => {
    date = `${date.slice(8, 10)}/${date.slice(5, 7)}/${date.slice(0, 4)}`;
    return date;
}

const displayBankHols = (thisYear) => {
    const header = document.createElement('h2');
    header.innerText = `Bank holiday dates for ${year}`;
    const list = document.createElement('ul');
    results.append(header, list);
    for (date of thisYear) {
        const listItem = document.createElement('li');
        listItem.innerText = convertDateToUK(date);
        list.append(listItem);
    }
}

const getWeekends = (year) => {
    let endOfYear = new Date(`December 31, ${year}`);
    let daysOfYear = [];
    // get all days of year
    for (let i= new Date(`January 1, ${year}`); i <= endOfYear; i.setDate(i.getDate() + 1)) {
        daysOfYear.push(new Date(i));
    }
    // get weekends only by removing week days
    let weekends = [];
    for (day of daysOfYear) {
        if (day.getDay() === 6 || day.getDay() === 0) {
            weekends.push(day.toLocaleDateString('en-GB'));
        }
    }
    displayWeekends(weekends);
}

const displayWeekends = (weekends) => {
    console.log(weekends);
    const header = document.createElement('h2');
    header.innerText = `Weekend dates for ${year}`;
    const list = document.createElement('ul');
    results.append(header, list);
    for (date of weekends) {
        const listItem = document.createElement('li');
        listItem.innerText = date;
        list.append(listItem);
    }
}



year.addEventListener('change', function() {
    year = year.value;
});

button.addEventListener('submit', function(e) {
    e.preventDefault();
    getBankHols();
})

