// this file collects the packaged group of API endpoints and prefixes them with the path /api

const router = require('express').Router();
const apiRoutes = require('./api');
const homeRoutes = require('./home-routes');
const dashboardRoutes = require('./dashboard-routes.js');

// api endpoint files
router.use('/api', apiRoutes);

router.use('/', homeRoutes);
router.use('/dashboard', dashboardRoutes);

// if any endpoint doesn't exist, a 404 error is resolved
router.use((req, res) => {
  res.status(404).end();
});

module.exports = router;
