const { jobModel } = require('../models');

function getJobs(req, res, next) {
    jobModel.find()
        .populate('userId')
        .then(jobs => res.json(jobs))
        .catch(next);
}
function getJob(req, res, next) {
    const { jobId } = req.params;

    jobModel.findById(jobId)
        .populate({
            path : 'applications',
            populate : {
              path : 'userId'
            }
          })
        .then(job => res.json(job))
        .catch(next);
}
function delJob(req, res, next) {
    const { jobId } = req.params;

    jobModel.findOneAndDelete({ _id: jobId })
        .then((deletedJob) => {
            if (!deletedJob) {
                return res.status(404).json({ message: 'Job not found' });
            }
            res.status(200).json({ message: 'Job deleted successfully', deletedJob });
        })
        .catch((error) => {
            next(error);
        });
}

async function createJob(req, res, next) {
    try {
        const { jobTitle, description, company, location, salary, category, image } = req.body;
        const { _id: userId } = req.user;

        const newJob = await jobModel.create({ 
            jobTitle, 
            description, 
            company,
            location,
            salary,
            category,
            image, 
            userId, 
            subscribers: [] 
        });

        res.status(201).json(newJob);
    } catch (error) {
        next(error);
    }
}

function apply(req, res, next) {
    const jobId = req.params.jobId;
    const { _id: userId } = req.user;
    jobModel.findByIdAndUpdate({ _id: jobId }, { $addToSet: { applicants: userId } }, { new: true })
        .then(updatedJob => {
            res.status(200).json(updatedJob);
        })
        .catch(next);
}
function editJob(req, res, next) {
    const { jobId } = req.params;
    const { jobTitle, description, company, location, salary, category, image } = req.body;
    const { _id: userId } = req.user;

    recipeModel.findOneAndUpdate(
        { _id: jobId, userId: userId },
        { jobTitle, description, company, location, salary, category, image },
        { new: true, runValidators: true }
    )
        .then((updatedJob) => {
            if (!updatedJob) {
                return res.status(404).json({ message: 'Job not found or unauthorized' });
            }
            res.json(updatedJob);
        })
        .catch(next);
}

module.exports = {
    getJobs,
    getJob,
    delJob,
    createJob,
    apply,
    editJob
}
