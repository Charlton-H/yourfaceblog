const router = require('express').Router();

router.get('/', (req, res) => {
  // res.render passes this object to homepage.handlebars
  res.render('homepage', {
    id: 1,
    post_url: 'https://handlebarsjs.com/guide',
    title: 'Handlebars Docs',
    created_at: new Date(),
    vote_count: 10,
    comments: [{}, {}],
    users: {
      username: 'test_user',
    },
  });
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

module.exports = router;
