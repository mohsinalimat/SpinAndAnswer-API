const router = require('express').Router();
const { usersCtrl } = require('../Controllers');
const registerMiddleWare = require('../middlewares');
const { auth } = require('../middlewares');
const multer  = require('multer');
const fs  = require('fs');
const upload = multer({ dest: 'upload/'});
// Obtain all the active users
router.get('/', [auth.haveSession, auth.havePermissions], usersCtrl.getAll);
//Obtain a specific user by its id
router.get('/:userId', auth.haveSession, usersCtrl.get);
//Get every questions of user
router.get('/:userId/questions', [auth.canCheck, auth.haveSession], usersCtrl.getQuestionsBy);
//Delete logically a user giving its id
router.delete('/:userId', [auth.haveSession, auth.havePermissions], usersCtrl.changeActive);
//Create a new user validating the information given by the user
router.post('/', usersCtrl.create);
// Modify the whole user resource giving its id
router.put('/:userId', auth.haveSession, usersCtrl.modify);
// Obtain all the friends of a specific user
router.get('/:userId/friends', [auth.canCheck, auth.haveSession], usersCtrl.getAllFriends);
// Create a new friend
router.post('/friends/', auth.haveSession, usersCtrl.addFriend);
// Delete a friend of a specific user
router.delete('/:userId/friends/', auth.haveSession, usersCtrl.modifyFriendship);
// Accept a friend request
router.patch('/friends/', auth.haveSession, usersCtrl.acceptFriend);
//Get url by mail to reset password
router.patch('/reset', usersCtrl.resetPassword);
//Reset password
router.patch('/reset/:tokenId', auth.haveSession, usersCtrl.changePassword);

router.get('/:userId/friendshipRequest', [auth.haveSession, auth.canCheck], usersCtrl.friendshipRequest);

router.post('/upload', upload.single('picture'), (req, res, next) => {
  console.log(req.body);
  console.log(req.file);
  fs.rename(req.file.path, `uploads/file-${req.file.filename}`, (err) => {
  if (err) throw err;
    console.log('Rename complete!');
  });
  next();
  res.send('finished');
}, (req, res) => {
  res.send('Uploading');
});

module.exports = router;
