const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    type: String,
    address: {
        street: String,
        streetNumber: String, //Tänkte ha detta som Number, men ändrade till String för att bokstäver ska fungera, t.ex. 16B
        municipality: String,
        geo: {
            lat: Number,
            long: Number
        },
    },
    price: Number,
    monthlyFee: Number,
    activeBidding: Boolean
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;