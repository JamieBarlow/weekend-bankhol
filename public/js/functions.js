const extraDatesForm = document.querySelector('#extra-dates');
const userInput = document.querySelector('#cruk-dates');
const extraDatesDisplay = document.querySelector('#cruk-dates-display');
const button = document.querySelector('#getDates');
const results = document.querySelector('#nonProcessingDates-display')
const processingDays = document.querySelector('#processingDays');
let year = document.querySelector('#year-select');
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
            let thisYear = dates.filter(date => date.slice(0, 4) === year);
            let lastYear = dates.filter(date => date.slice(0, 4) === ((year - 1).toString()));
            lastYear = lastYear.filter(item => item.slice(5, 7) === '12');
            thisYear.push(...lastYear);
            displayBankHols(thisYear);
            getWeekends(year);
        });
}

const displayBankHols = (thisYear) => {
    const header = document.createElement('h2');
    header.innerText = `Bank holiday dates for ${year} (and late ${year - 1})`;
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
    console.log(`Display bank hols: ${nonProcessingDays[2]}`)
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
    dateObject.setHours(0);
    // console.log(`date object: ${dateObject}`)
    return dateObject;
}

// Converts UK format dates (format DD/MM/YYY) to a JavaScript Date Object
const convertUKDateToObject = (date) => {
    let dateObject = new Date(`${date.slice(3, 5)}/${date.slice(0, 2)}/${date.slice(6, 10)}`);
    dateObject.setHours(0);
    return dateObject;
}

// Converts JavaScript Date Object to UK display format (DD/MM/YYYY)
const convertJSDateToUK = (date) => {
    let day = date.getDate().toLocaleString('en-US', { minimumIntegerDigits: 2 });
    let month = (date.getMonth() + 1).toLocaleString('en-US', { minimumIntegerDigits: 2 });
    let year = date.getFullYear();
    let ukDate = `${day}/${month}/${year}`
    return ukDate;
}

const getWeekends = (year) => {
    let daysOfYear = [];
    // get all days of year, with extra 15 days from previous and subsequent years to account for crossover
    for (let i = 0; i < 395; i++) {
        let date = new Date(`January 1, ${year}`);
        date.setDate(date.getDate() - 15);
        date.setDate(date.getDate() + i);
        date.setHours(0);
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
    console.log(`Getweekends: ${nonProcessingDays[2]}`)
    // console.log(nonProcessingDays);
    displayWeekends(weekends);
}

const displayWeekends = (weekends) => {
    // console.log(weekends);
    const header = document.createElement('h2');
    header.innerText = `Weekend dates for ${year} (including late ${year - 1} and early ${Number(year) + 1})`;
    const list = document.createElement('ul');
    results.append(header, list);
    for (let date of weekends) {
        const listItem = document.createElement('li');
        listItem.innerText = date;
        list.append(listItem);
    }
    console.log(`Display weekends: ${nonProcessingDays[2]}`)
    displayProcessingDays();
}



// Column A
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
    // Populate table top 2 rows
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
            let claimDate = `05/${month.toLocaleString('en-US', { minimumIntegerDigits: 2 })}/${year}`;
            table.rows[i].cells[0].innerText = claimDate;
            claimDates.push(convertUKDateToObject(claimDate));

        } else if (i % 2 === 1) {
            let claimDate = `19/${month.toLocaleString('en-US', { minimumIntegerDigits: 2 })}/${year}`;
            table.rows[i].cells[0].innerText = claimDate;
            claimDates.push(convertUKDateToObject(claimDate));
            month++;
        }
    }

     // Pass the below functions as the 'direction' argument to other functions in order to push days either forwards or backwards;
     function forwards(a) {
        a++;
        return a;
    }
    function backwards(a) {
        a--;
        return a;
    }

    // Shift dates back or forward by 1 day, using 'forwards' or 'backwards' utility functions as the direction argument (use this before comparing with non-processing days)
    function shiftDates(dates, direction) {
        let newDates = [];
        // Shift dates back by 1
        for (let i = 0; i < dates.length; i++) {
            let newDate = new Date(dates[i]);
            newDate.setDate(`${direction(newDate.getDate())}`);
            newDate.setHours(0);
            newDates.push(newDate);
        }
        return newDates;
    }

    // Use to compare dates with nonProcessing days and return the next (or previous) working day, depending on the direction specified. Populates a given table column with results
    function compareDates(dates1, dates2, direction, column) {
        let resultDates = [];
        let defaultDate = true;
        for (let i = 0; i < dates1.length; i++) {
            let newDate = new Date(`${dates1[i]}`);
            for (let j = 0; j < dates2.length; j++) {
                if (newDate.getTime() === dates2[j].getTime()) {
                    defaultDate = false;
                    newDate.setDate(`${direction(newDate.getDate())}`);
                    newDate.setHours(0);
                    for (let k = 0; k < dates2.length; k++) {
                        if (newDate.getTime() === dates2[k].getTime()) {
                            newDate.setDate(`${direction(newDate.getDate())}`);
                            for (let l = 0; l < dates2.length; l++) {
                                if (newDate.getTime() === dates2[l].getTime()) {
                                    newDate.setDate(`${direction(newDate.getDate())}`);
                                    for (let m = 0; m < dates2.length; m++) {
                                        if (newDate.getTime() === dates2[m].getTime()) {
                                            newDate.setDate(`${direction(newDate.getDate())}`);
                                        }
                                    }
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

    // Column F dates
    let colF = claimDates;
    compareDates(colF, nonProcessingDays, forwards, 5);
    colF = compareDates(claimDates, nonProcessingDays, forwards, 5);

    // Column E dates
    let colE = shiftDates(claimDates, backwards);      // Note we are shifting the original claim dates backwards, instead of passing in the modified column F dates
    compareDates(colE, nonProcessingDays, backwards, 4);
    colE = compareDates(colE, nonProcessingDays, backwards, 4);

    // Column D dates
    let colD = shiftDates(colE, backwards);
    compareDates(colD, nonProcessingDays, backwards, 3);
    colD = compareDates(colD, nonProcessingDays, backwards, 3);

    // Column C dates
    let colC = shiftDates(colD, backwards);
    compareDates(colC, nonProcessingDays, backwards, 2);
    colC = compareDates(colC, nonProcessingDays, backwards, 2);

    // Column B dates (shifting back 3 days)
    let colB = shiftDates(colC, backwards);
    colB = compareDates(colB, nonProcessingDays, backwards, 1);
    colB = shiftDates(colB, backwards);   // Shifting back a 2nd day
    colB = compareDates(colB, nonProcessingDays, backwards, 1);
    colB = shiftDates(colB, backwards);   // Shifting back a 3rd day
    colB = compareDates(colB, nonProcessingDays, backwards, 1);

    // Column G dates
    let colG = shiftDates(colF, forwards);
    compareDates(colG, nonProcessingDays, forwards, 6);
    colG = compareDates(colG, nonProcessingDays, forwards, 6);

    // Column H dates
    let colH = shiftDates(colG, forwards);
    compareDates(colH, nonProcessingDays, forwards, 7);
    colH = compareDates(colH, nonProcessingDays, forwards, 7);


    // console.log(`Claim dates: ${claimDates}`);
    // console.log(`Non processing days: ${nonProcessingDays}`);
    // console.log(`Display processing days: ${nonProcessingDays[3]}`)
    processingDays.append(header, table);

}



year.addEventListener('change', function () {
    year = year.value;
});

button.addEventListener('submit', function (e) {
    e.preventDefault();
    getBankHols();
});

// Runs only once to generate header
let displayCRUKHolsHeader = (function() {
    let executed = false;
    return function() {
        if (!executed) {
            executed = true;
            const header = document.createElement('h2');
            header.innerText = `CRUK holiday dates:`;
            const list = document.createElement('ul');
            extraDatesDisplay.append(header, list);
        }
    }
})();

// Display optional CRUK holidays beneath CRUK Hols header
const displayCRUKHols = (date) => {
    displayCRUKHolsHeader();
    // Creates new list items
    const newItem = document.createElement('li');
    const deleteButton = document.createElement('button');
    const breakLine = document.createElement('br');
    newItem.innerText = `${convertJSDateToUK(date)}`;
    newItem.style.display = "inline";
    deleteButton.innerText = " - ";
    extraDatesDisplay.append(newItem, deleteButton, breakLine);
    console.log(date);
    console.log(nonProcessingDays);
}

// Add extra date items to list on submission
extraDatesForm.addEventListener("submit", function(e) {
    e.preventDefault();
    let newDate = new Date(`${convertUKDateToObject(userInput.value)}`);
    nonProcessingDays.push(newDate);
    displayCRUKHols(newDate);
})

// Clicking on ' - ' button to remove list item
extraDatesDisplay.addEventListener('click', function(e) {
    if (e.target.nodeName === "BUTTON") {
        e.target.previousElementSibling.remove();
        e.target.nextElementSibling.remove();
        e.target.remove();
    }
})