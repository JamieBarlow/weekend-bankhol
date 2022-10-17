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

const displayBankHols = (thisYear) => {
    const header = document.createElement('h2');
    header.innerText = `Bank holiday dates for ${year}`;
    const list = document.createElement('ul');
    results.append(header, list);
    for (let date of thisYear) {
        const listItem = document.createElement('li');
        let ukDate = convertDateToUK(date);
        // nonProcessingDays.push(ukDate);
        // console.log(`Bank hol date: ${date}`);
        nonProcessingDays.push(convertUSDateToObject(date));
        // console.log(nonProcessingDays);
        listItem.innerText = ukDate;
        list.append(listItem);
    }
    // console.log(`Display bank hols: ${nonProcessingDays[3]}`)
}

// Converts dates returned from Gov API (format YYYY-MM-DD) to UK display format (DD/MM/YYYY)
const convertDateToUK = (date) => {
    // console.log(date);
    date = `${date.slice(8, 10)}/${date.slice(5, 7)}/${date.slice(0, 4)}`;
    return date;
}

// Converts dates from Gov API (format YYYY-MM-DD) to a JavaScript Date Object
const convertUSDateToObject = (date) => {
    let dateObject = new Date(date);
    // console.log(`date object: ${dateObject}`)
    return dateObject;
}

// Converts UK format dates (format DD/MM/YYY) to a JavaScript Date Object
const convertUKDateToObject = (date) => {
    let dateObject = new Date(`${date.slice(3, 5)}/${date.slice(0, 2)}/${date.slice(6, 10)}`);
    return dateObject;
}

// Converts JavaScript Date Object to UK display format (DD/MM/YYYY)
const convertJSDateToUK = (date) => {
    let day = date.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2});
    let month = (date.getMonth() + 1).toLocaleString('en-US', {minimumIntegerDigits: 2});
    let year = date.getFullYear();
    let ukDate = `${day}/${month}/${year}`
    return ukDate;
}

const getWeekends = (year) => {
    let daysOfYear = [];
    // get all days of year
    for (let i=0; i < 365; i++) {
        let date = new Date(`January 1, ${year}`);
        date.setDate(date.getDate() + i);
        daysOfYear.push(date);
    }
    // get weekends only by removing week days
    let weekends = [];
    for (let day of daysOfYear) {
        if (day.getDay() === 6 || day.getDay() === 0) {
            nonProcessingDays.push(day);
            weekends.push(day.toLocaleDateString('en-GB'));
        }
    }
    // console.log(`Getweekends: ${nonProcessingDays[3]}`)
    // console.log(nonProcessingDays);
    displayWeekends(weekends);
}

const displayWeekends = (weekends) => {
    // console.log(weekends);
    const header = document.createElement('h2');
    header.innerText = `Weekend dates for ${year}`;
    const list = document.createElement('ul');
    results.append(header, list);
    for (let date of weekends) {
        const listItem = document.createElement('li');
        listItem.innerText = date;
        list.append(listItem);
    }
    // console.log(`Display weekends: ${nonProcessingDays[3]}`)
    displayProcessingDays();
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
    let claimDates = [];
    for (let i = 2; i < table.rows.length; i++) {
        if (i % 2 === 0) {
            let claimDate = `05/${month.toLocaleString('en-US', {minimumIntegerDigits: 2})}/${year}`;
            table.rows[i].cells[0].innerText = claimDate;
            claimDates.push(convertUKDateToObject(claimDate));
            
        } else if (i % 2 === 1) {
            let claimDate = `19/${month.toLocaleString('en-US', {minimumIntegerDigits: 2})}/${year}`;
            table.rows[i].cells[0].innerText = claimDate;
            claimDates.push(convertUKDateToObject(claimDate));
            month++;
        }
    }
    // Column F dates
    function compareDates(dates1, dates2, direction, column) {
        let resultDates = [];
        let defaultDate = true;
        console.log(`Dates1 time: ${dates1}`)
        console.log(`Dates2 time: ${dates2}`)
        for (let i = 0; i < dates1.length; i++) {
            for (let j = 0; j < dates2.length; j++) {
                if (dates1[i].getTime() === dates2[j].getTime()) {
                    defaultDate = false;
                    let newDate = new Date(`${dates1[i]}`);
                    newDate.setDate(`${direction(newDate.getDate())}`);
                    console.log(`Date at first stage: ${newDate}`);
                    for (let k = 0; k < dates2.length; k++) {
                        if (newDate.getTime() === dates2[k].getTime()) {
                            newDate.setDate(`${direction(newDate.getDate())}`);
                            console.log(`Date at second stage: ${newDate}`);
                            for (let l = 0; l < dates2.length; l++) {
                                if (newDate.getTime() === dates2[l].getTime()) {
                                    newDate.setDate(`${direction(newDate.getDate())}`)
                                    console.log(`Date at third stage: ${newDate}`);
                                }
                            }
                        }
                    }
                    table.rows[i + 2].cells[column].innerText = newDate;
                    resultDates.push(newDate); 
                }
            } 
            if (defaultDate === true) {
                table.rows[i + 2].cells[column].innerText = dates1[i];
                resultDates.push(dates1[i]);
            }
            defaultDate = true;
        }
        return resultDates;
    }

    // Pass the below functions as the 'direction' argument to count days either forwards or backwards;
    function forwards(a) {
        a++;
        return a;
    } 
    function backwards(a) {
        a--;
        return a;
    }

    compareDates(claimDates, nonProcessingDays, forwards, 5);
    let paymentDates = compareDates(claimDates, nonProcessingDays, forwards, 5);
    // console.log(paymentDates);

    // Column E dates
    function columnEdates(dates) {
        let colEdates = [];
        // Shift dates back by 1
        for (let i = 0; i < dates.length; i++) {
            let newDate = new Date(dates[i]);
            newDate.setDate(newDate.getDate() - 1);
            colEdates.push(newDate);
        }
        // Feed dates into compareDates function (backwards), and put into 4th column
        compareDates(colEdates, nonProcessingDays, backwards, 4)
        return colEdates;
    }
    columnEdates(paymentDates);
    let bankProcessingDates = columnEdates(paymentDates);

    // Column D dates
    function columnDdates(dates) {
        let colDdates = [];
        for (let i = 0; i < dates.length; i++) {
            let newDate = new Date(dates[i]);
            newDate.setDate(newDate.getDate() - 1);
            colDdates.push(newDate);
        }
        compareDates(colDdates, nonProcessingDays, backwards, 3);
    }
    columnDdates(bankProcessingDates);
    let colDdates = columnDdates(bankProcessingDates);

    console.log(`Claim dates: ${claimDates}`);
    console.log(`Non processing days: ${nonProcessingDays}`);
    console.log(`Display processing days: ${nonProcessingDays[3]}`)
    processingDays.append(header, table);

}



year.addEventListener('change', function() {
    year = year.value;
});

button.addEventListener('submit', function(e) {
    e.preventDefault();
    getBankHols();
});