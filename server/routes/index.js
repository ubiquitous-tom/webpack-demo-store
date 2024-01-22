const express = require('express')

const router = express.Router()
const initializeApp = require('./initializeapp')
const initializeAppPost = require('./initializeapppost')
const applyPromo = require('./applypromo')
const changePassword = require('./changepassword')
const changeEmail = require('./changeemail')
const stripeKey = require('./stripekey')
// const lang = require('./lang')
const profile = require('./profile')
const logout = require('./logout')
const stripeCard = require('./stripecard')
const csrfPreAuth = require('./csrfpreauth')
const plansChange = require('./planschange')
const plansAvailable = require('./plansavailable')
const stripeDefaultCard = require('./stripedefaultcard')
const currentMembership = require('./currentmembership')

router.get('/hello', (req, res) => {
  // res.json({ custom: 'response' });
  res.status(200).send('Hello World!')
})

router.get('/initializeapp', initializeApp)
router.get('/stripekey', stripeKey)
// router.get('/lang', lang)
router.get('/acorn/plans/available', plansAvailable)
router.get('/stripedefaultcard', stripeDefaultCard)
router.get('/currentmembership', currentMembership)
router.get('/profile', profile)
router.get('/logout', logout)

router.post('/initializeapp', initializeAppPost)
router.post('/applypromo', applyPromo)
router.post('/changepassword', changePassword)
router.post('/changeemail', changeEmail)
router.post('/acorn/plans/change', plansChange)
router.post('/stripecard', stripeCard)
router.post('/api/user/csrfPreAuth', csrfPreAuth)

module.exports = router
