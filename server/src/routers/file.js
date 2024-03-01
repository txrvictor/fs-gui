const express = require('express')

const router = new express.Router()

router.get('/files', async (req, res) => {
  res.send({
    id: 12345,
    type: 'folder',
  })
})

module.exports = router
