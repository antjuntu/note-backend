const mongoose = require('mongoose')
const { url } = require('../db')

mongoose.connect(url, { useNewUrlParser: true })

const Note = mongoose.model('Note', {
  content: String,
  date: Date,
  important: Boolean
})

module.exports = Note