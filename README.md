<div align="center">
  <h1>Direct Debit Processing Calendar :closed_book:</h1>
  <strong>By Jamie Barlow</strong>
</div>

## Purpose / Background :bulb:

- This is a browser app that can be used to determine Direct Debit processing days for a selected year by accounting for weekends, bank holidays and other non-work days. 
- Companies who operate a [Direct Debit scheme](https://www.directdebit.co.uk/) will rely on a processing calendar to determine their schedule for specific Direct Debit processes, both internally and in terms of DD claim submission to Bacs. This is to ensure that the agreed withdrawal date, between Service User (company, payee) and the customer, is met (as per the [Direct Debit guarantee](https://www.directdebit.co.uk/direct-debit-explained/direct-debit-guarantee/)). Processing dates for both Service User and bank are determined by working days, and therefore need to be adjusted to account for bank holidays, weekends, and office closures. Determining when these dates are can be a manual, complex and error-prone process, and so this app was created to meet a real challenge / need for automation.
- There is a [3 day processing cycle](https://www.bacs.co.uk/services/bacs-schemes/getting-started/direct-debit/#:~:text=To%20collect%20Direct%20Debit%20payments,then%20transmitted%20to%20each%20institution.) operated by Bacs. This is accounted for in the app's calculations. The app also accounts for further company-specific internal processes that the claim submission is dependent upon - in this case the 'DD Dedupe Report', 'Claim Run' and 'ARUDD Reporting' are also included (see Features section below for further detail).
- Ultimately this app is designed to provide a reliable, consistent and maintainable means of determining Direct Debit processing days, mitigating error and risk. A company will typically load DD data via an annual 'rectification' process which depends on precise calendar data. Failure to generate this data correctly may result in multiple negative impacts that are difficult and/or costly to fix: missed or delayed submissions, payment reconciliation issues, knock-on impact on future claims, damage to reputation or the company's Service User status.
- By factoring in extra holidays / office closure dates which can be added manually by the user, the app is also flexible and can comprehensively cover all non-processing days.
- The app has been manually debugged and tested, and will be further unit-tested before deployment, using the Mocha testing framework.

## Features :heavy_check_mark:

- Bank holidays are calculated using the [UK Government Bank Holidays API](https://www.api.gov.uk/gds/bank-holidays/#bank-holidays), which returns bank holiday data in JSON format. Depending on the year selected, this is parsed and added to a list of bank holiday dates (from the current year and late previous year, due to processes overlapping calendar years).
- Weekend dates are calculated using the [JavaScript Date object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date). Again this includes some overlap into the previous and next calendar year.
- Your organisation may have extra holidays or office closures, which are not accounted for in the standard list of bank holidays or weekends. The app therefore allows you to enter further dates individually ('DD/MM/YYYY' format). Clicking 'Add' will add this to a display list, and also to the collection of 'non-processing' dates that are factored into the calculation.
- The web app can currently be run in 2 different ways, depending on use-case and enterprise access privileges:
  - Via Node.js, using Express to host the app via local server
  - Via 'Live Server' extension within the VSCode editor
- The app can calculate:
  - **Claim date** - this is the 5th or 19th of each month (as specified by the requesting organisation)
  - **Payment Date** - this is the 5th or 19th (as per claim date), adjusted according to working days. The app compares the date with all non-working dates, and shifts the date forwards by 1 working day if this falls on a non-working date.
  - **Bank processing date** - this is 1 working day before the payment date. The date will be shifted back by 1 working day if this falls on a non-working date.
  - **Claim file submission** - this is 1 working day before the bank processing date. The date will again be shifted back by 1 working day if this falls on a non-working date.
  - **Claim run** - the claim file submission depends on this process, which runs 1 working day before. The date will again be shifted back by 1 working day if this falls on a non-working date.
  - **DD Dedupe Report** - DDs flagged as duplicates will be removed ('de-duplicated') 3 working days before the claim run. To ensure this, if there are any non-working dates which are presented between the default Dedupe date and the claim run date, this date will be shifted backwards by the appropriate number of working days.
  - **ARUDD reporting** - reporting for ARUDD (Automated Return of Unpaid Direct Debits) will occur 1 working day after the payment date. The date will be shifted forwards by 1 working day if this falls on a non-working day.
  - **ARUDD reporting sweep-up** - this will occur 1 working day after ARUDD reporting, and will be shifted forwards by 1 working day if this falls on a non-working day. 
  - All results are displayed in standard table format, and can be easily viewed or copied as necessary.

## Technologies :floppy_disk:

- HTML/CSS
- JavaScript
- Express.js (web framework)
- EJS (embedded JavaScript templating)
- Mocha (JS testing framework) with Chai (testing assertion library)
- Git Version Control

## How to Use :page_with_curl:

- The app can currently be launched in one of 2 ways:
### Using Node.js
  - Use the command `node index.js` in the terminal to start the server
  - You should see the message 'App listening at http://localhost:3000'
  - Open a new tab in your browser and navigate to [http://localhost:3000](http://localhost:3000)
### Using VSCode Live Server extension
  - From VSCode editor, make sure that you have the ['Live Server'](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension installed
  - From the project folder, right-click the index.html file, and select 'Open with Live Server.'
- In the text input box, enter any holidays (i.e. office closure dates) from the current *and* previous year (DD/MM/YYYY format) and click the 'Add' button after each entry. Repeat as necessary. You should now see these displayed underneath the form.
- Choose a year from the dropdown menu
- Click 'Give me dates'. You should now see a list of ad hoc holiday dates, bank holiday dates, and weekends, followed by a table displaying your DD calendar dates.

## Testing and Debugging :computer:

The app uses a four-phase test pattern (setup, exercise, verify, teardown) to unit-test functions and ensure that they are reliable. To run the test suite:
- Open the Developer Tools in your browser (in Chrome, Ctrl + Shift + I) and open the Console tab.
- Type `mocha.run()` in the console and press enter.
- The test suite should now run and display the results on your page:

![Mocha test screenshot](https://github.com/JamieBarlow/weekend-bankhol/blob/master/resources/mochatest.PNG)

## Development Challenges :wrench:

The below challenges have all been accounted for in the design of this app, but they are worthy of consideration to ensure that any future development or changes remain fit for purpose:

- Bank holidays can add multiple non-working days between processing days. As a result, shifting a processing date forwards or backwards by 1 working date may still lead to the adjusted date falling on a non-working day. The app therefore runs checks multiple times, and shifts the date as necessary until it is confirmed that the date provided is in fact a valid working day.
- DD claims at the start of a calendar year will result in lead-up processes that need to occur in the previous calendar year. The app therefore factors in non-processing dates from later in the previous year (bank holidays and weekends). For ad hoc, manually added non-working dates, the user is also asked to provide these for both current and previous calendar years.
- In some cases, follow-up processes will spill over to the next calendar year, so weekends from early in the following year will also be accounted for.
- The gap of 3 working days between the DD Dedupe Report process and the Claim Run presents some logical challenges that can easily lead to manual error. A user attempting to calculate this manually might presume that you simply need to find the date 3 days before the claim run, check whether this lands on a non-processing day, and then adjust (shift back 1 working day) as necessary. However, non-working days *between* these 2 dates will also need to be accounted for. The app therefore needs to shift the date back 1 day at a time, checking that this is a valid processing day *each time* , and shifting back the required number of days on each iteration.
- The app works with a range of date formats: the 'YYYY-MM-DD' format returned by the UK Gov API, the 'DD/MM/YYYY' format (required for DD display and validation), and instances of the [JavaScript Date object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date). All calculations are performed using the JavaScript Date object, so this is reliant on a series of conversion functions. These have been unit-tested - see the [Testing and Debugging](https://github.com/JamieBarlow/weekend-bankhol/edit/master/README.md#testing-and-debugging-computer) section.


## Upcoming features :hourglass:

- Further automated unit-testing and integration-testing (currently tests apply to date conversion functionality)
- Export functionality (Excel format)
- Claim date flexibility: the app is currently limited to claims on the 5th or 19th per month, but this can vary per organisation or via agreement with the participating bank.

## License :scroll:

- [GNU GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html)
