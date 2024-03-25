const Booking = require("./Booking");
const City = require("./City");
const Hotel = require("./Hotel");
const Image = require("./Image");
const Review = require("./Review");
const User = require("./User");

Hotel.belongsTo(City);
City.hasMany(Hotel);

Image.belongsTo(Hotel);
Hotel.hasMany(Image);

Booking.belongsTo(User);
User.hasMany(Booking);

Booking.belongsTo(Hotel);
Hotel.hasMany(Booking);

Review.belongsTo(User);
User.hasMany(Review);

Review.belongsTo(Hotel);
Hotel.hasMany(Review);
