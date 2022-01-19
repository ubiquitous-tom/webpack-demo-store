const express = require('express')

const router = express.Router()
const initializeApp = require('./routes/initializeapp')
const applyPromo = require('./routes/applypromo')
const changePassword = require('./routes/changepassword')
const changeEmail = require('./routes/changeemail')
const stripeKey = require('./routes/stripekey')
const lang = require('./routes/lang')
const logout = require('./routes/logout')
const stripeCard = require('./routes/stripecard')
const plansChange = require('./routes/planschange')
const plansAvailable = require('./routes/plansavailable')
const stripeDefaultCard = require('./routes/stripedefaultcard')
const currentMembership = require('./routes/currentmembership')

router.get('/hello', (req, res) => {
  // res.json({ custom: 'response' });
  res.status(200).send('Hello World!')
})

router.get('/initializeapp', initializeApp)
router.get('/stripekey', stripeKey)
router.get('/lang', lang)
router.get('/acorn/plans/available', plansAvailable)
router.get('/stripedefaultcard', stripeDefaultCard)
router.get('/currentmembership', currentMembership)
router.get('/logout', logout)

router.post('/applypromo', applyPromo)
router.post('/changepassword', changePassword)
router.post('/changeemail', changeEmail)
router.post('/acorn/plans/change', plansChange)
router.post('/stripecard', stripeCard)

module.exports = router
// THIS FILE IS NOT IN USED AT THE MOMENT.
