const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override'); //This allows browsers to simulate PUT and DELETE requests, which are not supported in HTML forms.
const Campground = require('./models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp')  //the name of the db is yelp-camp
    .then(() => console.log('Database connected'))
    .catch(err => console.error('Connection error:', err));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:")); //Listens for the "error" event on the database connection.
db.once("open", () => {
    console.log("Database connected");  //Listens for the "open" event, which fires once when the connection is successfully established.
})


const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
//This is a built-in middleware in Express that parses incoming URL-encoded form data.
app.use(methodOverride('_method'));
//The '_method' parameter tells method-override to look for a query parameter in the request.

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
})

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    //Stores the new campground in the MongoDB database using Mongoose
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
    //${campground._id} is the unique ID assigned by MongoDB when the campground is saved.
})

app.get('/campgrounds/:id', async (req, res) => { //:id is a route parameter, meaning any value placed in that position (e.g., /campgrounds/123) will be captured.
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/show', { campground });
})

app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground });
})

app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }) //uses spread syntax (...) to extract form data properly.
    res.redirect(`/campgrounds/${campground._id}`)
})

app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
})


app.listen(3000, () => {
    console.log('Serving on port 3000')
})





