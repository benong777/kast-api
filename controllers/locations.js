const Location = require('../models/Location');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

// Get all locations
const getAllLocations = async (req, res) => {
  const locations = await Location.find().sort('name');  // sort optionally by name
  res.status(StatusCodes.OK).json({ locations, count: locations.length });
};

// Get single location by ID
const getLocationById = async (req, res) => {
  const { id } = req.params;
  const location = await Location.findById(id);

  if (!location) {
    throw new NotFoundError(`No location found with id ${id}`);
  }

  res.status(StatusCodes.OK).json({ location });
};

// Create a new location
const createLocation = async (req, res) => {
  const { _id, name, address } = req.body;
  if (!_id || !name || !address) {
    throw new BadRequestError('Name and address are required fields');
  }

  const location = await Location.create({ _id, name, address });
  res.status(StatusCodes.CREATED).json({ location });
};

// Update existing location by ID
const updateLocation = async (req, res) => {
  const { id } = req.params;
  const { name, address } = req.body;

  if (!name || !address) {
    throw new BadRequestError('Name and address cannot be empty');
  }

  const location = await Location.findByIdAndUpdate(
    id,
    { name, address },
    { new: true, runValidators: true }
  );

  if (!location) {
    throw new NotFoundError(`No location found with id ${id}`);
  }

  res.status(StatusCodes.OK).json({ location });
};

// Delete location by ID
const deleteLocation = async (req, res) => {
  const { id } = req.params;

  const location = await Location.findByIdAndDelete(id);

  if (!location) {
    throw new NotFoundError(`No location found with id ${id}`);
  }

  res.status(StatusCodes.OK).json({ msg: 'Location deleted successfully' });
};

module.exports = {
  getAllLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
};
