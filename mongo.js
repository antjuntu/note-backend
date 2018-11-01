const mongoose = require('mongoose')

const { url } = require('./db')

mongoose.connect(url, { useNewUrlParser: true })

const Note = mongoose.model('Note', {
  content: String,
  date: Date,
  important: Boolean
})

// const note = new Note({
//   content: 'HTML on helppoa2222',
//   date: new Date(),
//   important: true
// })

// note
//   .save()
//   .then(response => {
//     console.log('note saved')
//     mongoose.connection.close()
//   })

Note 
  .find({ important: false})
  .then(result => {
    console.log(result)
    mongoose.connection.close()
  })