const { recipeModel } = require('../models');
const { newComment } = require('./commentController')

function getRecipes(req, res, next) {
    recipeModel.find()
        .populate('userId')
        .then(recipes => res.json(recipes))
        .catch(next);
}
function getRecipe(req, res, next) {
    const { recipeId } = req.params;

    recipeModel.findById(recipeId)
        .populate({
            path : 'comments',
            populate : {
              path : 'userId'
            }
          })
        .then(recipe => res.json(recipe))
        .catch(next);
}
function delRecipe(req, res, next) {
    const { recipeId } = req.params;

    recipeModel.findOneAndDelete({ _id: recipeId })
        .then((deletedRecipe) => {
            if (!deletedRecipe) {
                return res.status(404).json({ message: 'Recipe not found' });
            }
            res.status(200).json({ message: 'Recipe deleted successfully', deletedRecipe });
        })
        .catch((error) => {
            next(error);
        });
}

async function createRecipe(req, res, next) {
    try {
        const { recipeName, description, image } = req.body;
        const { _id: userId } = req.user;

        const newRecipe = await recipeModel.create({ 
            recipeName, 
            description, 
            image, 
            userId, 
            subscribers: [userId] 
        });

        res.status(201).json(newRecipe);
    } catch (error) {
        next(error);
    }
}

function subscribe(req, res, next) {
    const recipeId = req.params.recipeId;
    const { _id: userId } = req.user;
    recipeModel.findByIdAndUpdate({ _id: recipeId }, { $addToSet: { subscribers: userId } }, { new: true })
        .then(updatedRecipe => {
            res.status(200).json(updatedRecipe)
        })
        .catch(next);
}
function editRecipe(req, res, next) {
    const { recipeId } = req.params;
    const { recipeName, description, image } = req.body;
    const { _id: userId } = req.user;

    recipeModel.findOneAndUpdate(
        { _id: recipeId, userId: userId },
        { recipeName, description, image },
        { new: true, runValidators: true }
    )
        .then((updatedRecipe) => {
            if (!updatedRecipe) {
                return res.status(404).json({ message: 'Recipe not found or unauthorized' });
            }
            res.json(updatedRecipe);
        })
        .catch(next);
}

module.exports = {
    getRecipes,
    createRecipe,
    getRecipe,
    subscribe,
    delRecipe,
    editRecipe
}
