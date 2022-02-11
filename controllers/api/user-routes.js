const router = require('express').Router();
const { User, Post, Vote } = require('../../models');

router.get('/', (req, res) => {
  User.findAll({
    attributes: { exclude: ['password'] },
  })
    .then((dbUserData) => res.json(dbUserData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
  User.findOne({
    attributes: { exclude: ['password'] },
    where: { id: req.params.id },
    include: [
      {
        model: Post,
        attributes: ['id', 'title', 'post_url', 'created_at'],
      },
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'created_at'],
        include: {
          model: Post,
          attributes: ['title'],
        },
      },
      {
        model: Post,
        attributes: ['title'],
        through: Vote,
        as: 'voted_posts',
      },
    ],
  })
    .then((dbUserData) => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post('/', (req, res) => {
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  })
    .then((dbUserData) => res.json(dbUserData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post('/login', (req, res) => {
  // this route uses endpoint /login which is prefixed with /api/users already
  // using the User model and sequelize's findOne method
  // we are attempting to locate User record where email input, from request, matches
  User.findOne({
    where: { email: req.body.email },
  }).then((dbUserData) => {
    // result of the query is passed as dbUserData and if null, resolve with message that email was not found
    if (!dbUserData) {
      res.status(400).json({ message: 'No user with that email address!' });
      return;
    }
    // res.json({ user: dbUserData });

    // using dbUserData and the created method within User model class, we are comparing if password matches
    // using bcrypt's compareSync method
    // then assigning that boolean to validPassword
    const validPassword = dbUserData.checkPassword(req.body.password);

    // if validPassword not true, resolve message that password is incorrect
    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect Password!' });
      return;
    }
    // if validPassword is true, that password was accepted by sending resolve message user is now logged in
    res.json({ user: dbUserData, message: 'You are now logged in!' });
  });
});

router.put('/:id', (req, res) => {
  User.update(req.body, {
    individualHooks: true,
    where: { id: req.params.id },
  })
    .then((dbUserData) => {
      if (!dbUserData[0]) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete('/:id', (req, res) => {
  User.destroy({ where: { id: req.params.id } })
    .then((dbUserData) => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
