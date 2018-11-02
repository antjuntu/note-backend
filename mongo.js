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
//   .then(result => {
//     console.log('note saved')
//     mongoose.connection.close()
//   })

Note 
  .find({ important: false})
  .then(result => {
    console.log(result)
    mongoose.connection.close()
  })

  // let notes = [
  //   {
  //     id: 1,
  //     content: 'HTML on helppoa 1111',
  //     date: '2017-12-10T17:30:31.098Z',
  //     important: true
  //   },
  //   {
  //     id: 2,
  //     content: 'Selain pystyy suorittamaan vain javascriptiä',
  //     date: '2017-12-10T18:39:34.091Z',
  //     important: false
  //   },
  //   {
  //     id: 3,
  //     content: 'HTTP-protokollan tärkeimmät metodit ovat GET ja POST',
  //     date: '2017-12-10T19:20:14.298Z',
  //     important: true
  //   }
  // ]