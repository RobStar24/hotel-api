const catchError = require("../utils/catchError");
const Review = require("../models/Review");
const Hotel = require("../models/Hotel");

const getAll = catchError(async (req, res) => {
  const { hotelId, offset, perPage } = req.query;
  const where = {};
  if (hotelId) where.hotelId = hotelId;
  const results = await Review.findAll({
    include: [Hotel],
    where,
    offset: offset || 0,
    limit: perPage || 5,
  });
  const total = await Review.count({ where });
  return res.json({ total, results });
});

const create = catchError(async (req, res) => {
  if (!req.user)
    return res
      .status(401)
      .json({ message: "You must be authenticated to create a review" });

  const { body } = req;
  const userId = req.user.id;

  if (body.userId && body.userId !== userId) {
    return res
      .status(403)
      .json({ message: "You do not have permission to perform this action" });
  }

  const newReview = {
    ...body,
    userId,
  };
  const result = await Review.create(newReview);
  return res.status(201).json(result);
});

const remove = catchError(async (req, res) => {
  const { id } = req.params;
  await Review.destroy({ where: { id } });
  return res.sendStatus(204);
});

const update = catchError(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const review = await Review.findOne({ where: { id, userId } });
  if (!review) return res.status(404).json({ message: "Review not found" });

  const { rating, comment } = req.body;
  const result = await review.update(
    { rating, comment },
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
