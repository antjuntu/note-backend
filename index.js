const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

const Note = require('./models/note')

const formatNote = (note) => {
  return {
    content: note.content,
    date: note.date,
    important: note.important,
    id: note._id
  }
}

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('public'))


const logger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:', request.path)
  console.log('Body:', request.body)
  console.log('---')
  next()
}

app.use(logger)


app.get('/api/notes', (request, response) => {
  Note  
    .find({})
    .then(notes => {
      response.json(notes.map(note => formatNote(note)))
    })
})

app.get('/api/notes/:id', (request, response) => {
  Note
    .findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(formatNote(note))
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.delete('/api/notes/:id', (request, response) => {
  Note
    .findByIdAndRemove(request.params.id) 
    .then(result => {
      response.status(204).end()
    })
    .catch(error => {
      response.status(400).send({ error: 'malformatted id' })
    })
})

const generateId = () => {
  const maxId = notes.length > 0 ? notes.map(note => note.id).sort((a,b) => a - b).reverse()[0] : 1
  return maxId + 1
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note =  new Note({
    content: body.content,
    important: body.important || false,
    date: new Date()
  })

  note
    .save()
    .then(formatNote)
    .then(savedAndFormattedNote => {
      response.json(savedAndFormattedNote)
    })

  // note
  //   .save()
  //   .then(savedNote => {
  //     return formatNote(savedNote)
  //   })
  //   .then(savedAndFormattedNote => {
  //     response.json(savedAndFormattedNote)
  //   })
})

app.put('/api/notes/:id', (request, response) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important
  }

  Note
    .findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(formatNote(updatedNote))
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

const error = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(error)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
