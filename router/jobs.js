const express = require('express');
const router = express.Router();
const { auth } = require('../utils');
const {applicationController} = require('../controllers');
const { jobController } = require('../controllers');


// middleware that is specific to this router

router.get('/', jobController.getJobs);
router.post('/', auth(), jobController.createJob);

router.get('/:jobId', jobController.getJob);
router.post('/:jobId', auth(), applicationController.createApplication);
router.put('/:jobId', auth(), jobController.apply);
router.put('/:jobId/edit', auth(), jobController.editJob);
router.put('/:jobId/comments/:commentId', auth(), applicationController.editApplication);
router.delete('/:jobId',auth(),jobController.delJob);
router.delete('/:jobId/comments/:commentId', auth(), applicationController.deleteApplication);

module.exports = router