const { userModel, jobModel, applicationModel } = require('../models');

function newApplication(text, userId, jobId) {
    return applicationModel.create({ text, userId, jobId })
        .then(application => {
            return Promise.all([
                userModel.updateOne({ _id: userId }, { $push: { applications: application._id }, $addToSet: { jobs: jobId } }),
                jobModel.findByIdAndUpdate({ _id: jobId }, { $push: { applications: application._id }, $addToSet: { applicants: userId } }, { new: true })
            ])
        })
}

function getLatestsApplications(req, res, next) {
    const limit = Number(req.query.limit) || 0;

    applicationModel.find()
        .sort({ created_at: -1 })
        .limit(limit)
        .populate('jobId userId')
        .then(applications => {
            res.status(200).json(applications)
        })
        .catch(next);
}

function createApplication(req, res, next) {
    const { jobId } = req.params;
    const { _id: userId } = req.user;
    const { applicationText } = req.body;

    newApplication(applicationText, userId, jobId)
        .then(([_, updatedJob]) => res.status(200).json(updatedJob))
        .catch(next);
}

function editApplication(req, res, next) {
    const { applicationId } = req.params;
    const { applicationText } = req.body;
    const { _id: userId } = req.user;

    // if the userId is not the same as this one of the comment, the comment will not be updated
    applicationModel.findOneAndUpdate({ _id: applicationId, userId }, { text: applicationText }, { new: true })
        .then(updatedApplication => {
            if (updatedApplication) {
                res.status(200).json(updatedApplication);
            }
            else {
                res.status(401).json({ message: `Not allowed!` });
            }
        })
        .catch(next);
}

function deleteApplication(req, res, next) {
    const { applicationId, jobId } = req.params;
    const { _id: userId } = req.user;

    Promise.all([
        applicationModel.findOneAndDelete({ _id: applicationId, userId }),
        userModel.findOneAndUpdate({ _id: userId }, { $pull: { applications: applicationId } }),
        jobModel.findOneAndUpdate({ _id: jobId }, { $pull: { applications: applicationId } }),
    ])
        .then(([deletedOne, _, __]) => {
            if (deletedOne) {
                res.status(200).json(deletedOne)
            } else {
                res.status(401).json({ message: `Not allowed!` });
            }
        })
        .catch(next);
}
module.exports = {
    getLatestsApplications,
    newApplication,
    createApplication,
    editApplication,
    deleteApplication,
    
}
