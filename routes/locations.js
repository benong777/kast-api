const express = require('express');
const router = express.Router();

const commentsRouter = require('./comments');

const {
  getAllLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation
} = require('../controllers/locations');

//-- Locations
// router.route('/').post(createLocation).get(getAllLocations);
router.route('/').post(createLocation)
router.route('/:id').get(getLocationById).delete(deleteLocation).patch(updateLocation);

//-- Comments
// Mount commentsRouter on /:locationId/comments with mergeParams to access locationId
router.use('/:locationId/comments', commentsRouter);

module.exports = router;