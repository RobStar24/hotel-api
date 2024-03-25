const catchError = require("../utils/catchError");
const Booking = require("../models/Booking");
const User = require("../models/User");
const Hotel = require("../models/Hotel");
const Image = require("../models/Image");
const City = require("../models/City");

const getAll = catchError(async (req, res) => {
  const userId = req.user.id;
  const bookings = await Booking.findAll({
    where: { userId },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName", "email", "gender"],
      },
      {
        model: Hotel,
        include: [Image, City],
      },
    ],
  });
  return res.json(bookings);
});

const create = catchError(async (req, res) => {
  const { checkIn, checkOut, hotelId } = req.body;
  const userId = req.user.id;
  const result = await Booking.create({ checkIn, checkOut, userId, hotelId });
  return res.status(201).json(result);
});

const remove = catchError(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const booking = await Booking.findOne({ where: { id, userId } });
  if (!booking) return res.status(404).json({ message: "Booking not found" });
  await booking.destroy();
  return res.sendStatus(204);
});

const update = catchError(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const booking = await Booking.findOne({ where: { id, userId } });
  if (!booking) return res.status(404).json({ message: "Booking not found" });
  const { checkIn, checkOut } = req.body;
  const result = await booking.update(
    { checkIn, checkOut },
    {
      returning: true,
    }
  );
  if (result[0] === 0) return res.sendStatus(404);
  return res.json(result);
});

module.exports = {
  getAll,
  create,
  remove,
  update,
};
