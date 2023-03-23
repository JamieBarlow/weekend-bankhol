const extraDatesForm = document.querySelector('#extra-dates__form');
const extraDates = document.querySelector('#company-dates');
const chooseYear = document.querySelector('#chooseYear');
let year = document.querySelector('#year-select');
let namedDaysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const companyDatesDisplay = document.querySelector('#company-dates-display');
const bankHols = document.querySelector('#bankHols-display');
const weekends = document.querySelector('#weekends-display');
const bankHolsTable = document.querySelector('#bankHolsTable');
const weekendsTable = document.querySelector('#weekendsTable');
const processingDays = document.querySelector('#processingDays');

let nonProcessingDays = [];

// Enable tooltips
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

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
            const results = (data['england-and-wales'].events);
            console.log(data['england-and-wales']);
            let nonProcessing = [];
            let thisYearResults = results.filter(result => result.date.slice(0, 4) === year);
            let lastYearResults = results.filter(result => result.date.slice(0, 4) === ((year - 1).toString()));
            let endOflastYearResults = lastYearResults.filter(item => item.date.slice(5, 7) === '12');
            nonProcessing.push(...thisYearResults, ...endOflastYearResults);

            // Extract dates from nonProcessing results
            const dates = nonProcessing.map(result => result.date);
            // Extract day of week from results
            const daysOfWeek = dates.map(result => {
                let date = new Date(result);
                let day = date.getDay();
                day = namedDaysOfWeek[day];
                return day;
            });
            // Extract Bank Holiday name from results
            const bankHolNames = nonProcessing.map(result => result.title);

            displayBankHols(dates, daysOfWeek, bankHolNames);
            getWeekends(year);
        });
}

const displayBankHols = (dates, daysOfWeek, bankHolNames) => {
    const header = document.createElement('h2');
    header.innerText = `Bank holiday dates for ${year} (and late ${year - 1})`;
    bankHols.prepend(header);
    const tableBody = document.querySelector('#bankHolTable__body');
    let rowIndex = 1;
    for (let i = 0; i < dates.length; i++) {
        const row = document.createElement('tr');
        tableBody.append(row);
        // Generate column 1 cells (dates)
        const dateCell = document.createElement('th');
        let ukDate = convertGovDateToDMY(dates[i]);
        dateCell.scope = "row";
        dateCell.innerText = ukDate;
        tableBody.childNodes[rowIndex].append(dateCell);
        // Generate column 2 cells (day of week)
        const dayCell = document.createElement('td');
        dayCell.innerText = daysOfWeek[i];
        tableBody.childNodes[rowIndex].append(dayCell);
        // Generate column 3 cells (bank holiday title)
        const title = document.createElement('td');
        title.innerText = bankHolNames[i];
        tableBody.childNodes[rowIndex].append(title);
        // Add date to global array for calculations
        nonProcessingDays.push(convertGovDateToObject(dates[i]));
        rowIndex++;
    }
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
    let weekendDays = [];
    for (let day of daysOfYear) {
        if (day.getDay() === 6 || day.getDay() === 0) {
            nonProcessingDays.push(day);
            weekends.push(day.toLocaleDateString('en-GB'));
            weekendDays.push(namedDaysOfWeek[day.getDay()]);
        }
    }
    
    console.log(`Getweekends: ${nonProcessingDays[2]}`)
    // console.log(nonProcessingDays);
    displayWeekends(weekends, weekendDays);
}

const displayWeekends = (dates, weekendDays) => {
    // console.log(weekends);
    const header = document.createElement('h2');
    header.innerText = `Weekend dates for ${year} (including late ${year - 1} and early ${Number(year) + 1})`;
    weekends.prepend(header);
    const tableBody = document.querySelector('#weekendsTable__body');
    let rowIndex = 1;
    for (let i = 0; i < dates.length; i++) {
        const row = document.createElement('tr');
        tableBody.append(row);
        // Generate column 1 cells (dates)
        const dateCell = document.createElement('th');
        dateCell.scope = "row";
        dateCell.innerText = dates[i];
        tableBody.childNodes[rowIndex].append(dateCell);
        // Generate column 2 cells (day of week)
        const dayCell = document.createElement('td');
        dayCell.innerText = weekendDays[i];
        tableBody.childNodes[rowIndex].append(dayCell);
        rowIndex++;
    }
    console.log(`Display weekends: ${nonProcessingDays[2]}`)
    displayProcessingDays();
}

// Converts dates returned from Gov API (format YYYY-MM-DD) to UK display format (DD/MM/YYYY)
const convertGovDateToDMY = (date) => {
    // console.log(date);
    date = `${date.slice(8, 10)}/${date.slice(5, 7)}/${date.slice(0, 4)}`;
    return date;
}

// Converts dates from Gov API (format YYYY-MM-DD) to a JavaScript Date Object
const convertGovDateToObject = (date) => {
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
const convertJSDateToDMY = (date) => {
    let day = date.getDate().toLocaleString('en-US', { minimumIntegerDigits: 2 });
    let month = (date.getMonth() + 1).toLocaleString('en-US', { minimumIntegerDigits: 2 });
    let year = date.getFullYear();
    let ukDate = `${day}/${month}/${year}`
    return ukDate;
}

// Display processing dates
const displayProcessingDays = () => {
    const header = document.createElement('h2');
    header.innerText = "Processing days calendar:";
    // Displaytable
    const table = document.createElement('table');
    table.classList.add('table', 'table-primary', 'table-striped', 'table-hover');
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
    
    table.rows[0].classList.add('table-dark')
    table.rows[1].classList.add('table-info', 'table-group-divider', 'border-dark')
    

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

    // Use to compare dates with nonProcessing days and return the next (or previous) working day, depending on the direction specified. Populates a given table column with bankHols
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
                    table.rows[i + 2].cells[column].innerText = convertJSDateToDMY(newDate);
                    resultDates.push(newDate);
                }
            }
            if (defaultDate === true) {
                table.rows[i + 2].cells[column].innerText = convertJSDateToDMY(dates1[i]);
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

chooseYear.addEventListener('submit', function (e) {
    e.preventDefault();
    getBankHols();
    reveal(companyDatesDisplay);
    reveal(bankHols);
    reveal(weekends);
});

// Displays bankHols for a given element
function reveal(section) {
    section.style.display = "block";
}

// Runs only once to generate header
let displayCompanyHolsHeader = (function() {
    let executed = false;
    return function() {
        if (!executed) {
            executed = true;
            const header = document.createElement('h2');
            header.innerText = `Company holiday dates:`;
            const list = document.createElement('ul');
            companyDatesDisplay.append(header, list);
        }
    }
})();

// Display optional company holidays beneath Company Hols header
const displayCompanyHols = (date) => {
    displayCompanyHolsHeader();
    // Creates new list items
    const newItem = document.createElement('li');
    const deleteButton = document.createElement('button');
    const breakLine = document.createElement('br');
    newItem.innerText = `${convertJSDateToDMY(date)}`;
    newItem.style.display = "inline";
    deleteButton.innerText = " - ";
    companyDatesDisplay.append(newItem, deleteButton, breakLine);
    console.log(date);
    console.log(nonProcessingDays);
}

// Add extra date items to list on submission
extraDatesForm.addEventListener("submit", function(e) {
    e.preventDefault();
    let newDate = new Date(`${extraDates.value}`);
    nonProcessingDays.push(newDate);
    displayCompanyHols(newDate);
})

// Clicking on ' - ' chooseYear to remove list item
companyDatesDisplay.addEventListener('click', function(e) {
    if (e.target.nodeName === "BUTTON") {
        e.target.previousElementSibling.remove();
        e.target.nextElementSibling.remove();
        e.target.remove();
    }
})


// Exporting variables and functions
const variables = {
    extraDatesForm,
    extraDates,
    companyDatesDisplay,
    chooseYear,
    bankHols,
    processingDays,
    year,
    nonProcessingDays
}

const functions = {
    getBankHols,
    displayBankHols,
    convertGovDateToDMY,
    convertUKDateToObject,
    convertGovDateToObject,
    convertJSDateToDMY,
    getWeekends,
    displayWeekends,
    displayProcessingDays,
    displayCompanyHolsHeader,
    displayCompanyHols
}

export { variables, functions }