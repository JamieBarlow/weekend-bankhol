const button = document.querySelector('#getDates');
const results = document.querySelector('#results')
let year = document.querySelector('#year-select');
const processingDays = document.querySelector('#processingDays');
let nonProcessingDays = [];

function getBankHols() {
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
            const dates = result.map(a => {
                return a.date;
            });
            const thisYear = dates.filter(date => date.slice(0, 4) === year);
            displayBankHols(thisYear);
            getWeekends(year);
        });
}

const convertDateToUK = (date) => {
    // console.log(date);
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
        let ukDate = convertDateToUK(date);
        nonProcessingDays.push(ukDate);
        listItem.innerText = ukDate;
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
            nonProcessingDays.push(day.toLocaleDateString('en-GB'));
        }
    }
    displayWeekends(weekends);
}

const displayWeekends = (weekends) => {
    // console.log(weekends);
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

const displayProcessingDays = () => {
    const header = document.createElement('h2');
    header.innerText = "Processing days calendar:";
    // Displaytable
    const table = document.createElement('table');
    for (let i = 0; i < 26; i++) {
        const tr = table.insertRow();
        for (let j = 0; j < 8; j++) {
            const td = tr.insertCell();
        }
    }
    // Populate table values
    table.rows[0].cells[0].innerText = "Claim Date";
    table.rows[0].cells[1].innerText = "DD Dedupe Report";
    table.rows[0].cells[2].innerText = "Claim run @ 9.00am (completed by Apps Support Team)";
    table.rows[0].cells[3].innerText = "Date to send claim file (completed by Supporter Payments)";
    table.rows[0].cells[4].innerText = "Bank Processing Date";
    table.rows[0].cells[5].innerText = "Payment Date";
    table.rows[0].cells[6].innerText = "ARUDD Reporting (completed by Operations Team)";
    table.rows[0].cells[7].innerText = "ARUDD Reporting sweep-up (completed by Operations Team)";
    table.rows[1].cells[0].innerText = "Step 1 - Capture the 5th or 19th of the month";
    table.rows[1].cells[1].innerText = "Step 8 - 3 working days before claim run";
    table.rows[1].cells[2].innerText = "Step 7 - 1 working day before the claim file is sent";
    table.rows[1].cells[3].innerText = "Step 4 - 1 working day before the procesing date";
    table.rows[1].cells[4].innerText = "Step 3 - 1 working day before the payment date";
    table.rows[1].cells[5].innerText = "Step 2 - 5th or 19th of the month but must be a working day, if falls on weekend of bank holiday, the payment date will be next working day following the 5th or 19th.";
    table.rows[1].cells[6].innerText = "Step 5 - 1 working day after the payment date";
    table.rows[1].cells[7].innerText = "Step 6 - 2 working days after the payment date";
    // Column A dates
    let month = 1;
    for (let i = 2; i < table.rows.length; i++) {
        if (i % 2 === 0) {
            table.rows[i].cells[0].innerText = `05/${month.toLocaleString('en-US', {minimumIntegerDigits: 2})}/${year}`;
        } else if (i % 2 === 1) {
            table.rows[i].cells[0].innerText = `19/${month.toLocaleString('en-US', {minimumIntegerDigits: 2})}/${year}`;
            month++;
        }
    }
    // Column F dates
    for (let i = 2; i < table.rows.length; i++) {
        if (table.rows[i].cells[0].innerText === nonProcessingDays) {
            console.log("match!")
        }
    }
    console.log(nonProcessingDays);
    console.log(nonProcessingDays[0]);
    processingDays.append(header, table);
}



year.addEventListener('change', function() {
    year = year.value;
});

button.addEventListener('submit', function(e) {
    e.preventDefault();
    getBankHols();
    displayProcessingDays();
})

