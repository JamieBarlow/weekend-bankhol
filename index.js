const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
const path = require('path');
app.set('views', path.join(__dirname, '/views'));

// Serving static assets including JS functions
// app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));


app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
})

app.get('/', (req, res) => {
    res.render("home.ejs");
})

app.get('/results', (req, res) => {
    res.render("results.ejs");
})

app.get('*', (req, res) => {
    res.send("I don't know that path!");
})

// Testing server is set up correctly
// app.use((req, res) => {
//     console.log("We got a new request!");
// })