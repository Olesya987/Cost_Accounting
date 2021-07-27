const Outlay = require("../../DB/models/spend/index");

module.exports.getSpend = async (req, res) => {
  Outlay.find().then((result) => res.send({ costs: result }));
};

module.exports.postSpend = async (req, res) => {
  const { body } = req;
  const value = new Outlay(body);
  value
    .save()
    .then((result) => {
      Outlay.find().then((result) => res.send({ costs: result }));
    })
    .catch((err) => res.send(err));
};

module.exports.patchSpend = async (req, res) => {
  const { body } = req;
  Outlay.updateOne({ _id: body._id }, body)
    .then((result) => {
      Outlay.find().then((result) => res.send({ costs: result }));
    })
    .catch((err) => res.send(err));
};

module.exports.delSpend = async (req, res) => {
  const { query } = req;
  Outlay.deleteOne({ _id: query.id })
    .then((result) => {
      Outlay.find().then((result) => res.send({ costs: result }));
    })
    .catch((err) => res.send(err));
};
