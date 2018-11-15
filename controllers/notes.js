const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')
const mongoose = require('mongoose')

notesRouter.get('/', async (request, response) => {
  const notes = await Note
    .find({})
    .populate('user', { username: 1, name: 1 })

  response.json(notes.map(Note.format))
})

notesRouter.get('/:id', async (request, response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
      return response.status(400).send({ error: 'malformatted id' })
    }

    const note = await Note.findById(request.params.id)

    if (note) {
      response.json(Note.format(note))
    } else {
      response.status(404).end()
    }
  } catch (exception) {
    console.log(exception)
  }
})

notesRouter.delete('/:id', async (request, response) => {
  try {
    await Note.findByIdAndRemove(request.params.id)

    response.status(204).end()
  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }
})

notesRouter.post('/', async (request, response) => {
  try {
    const body = request.body

    if (body.content === undefined) {
      return response.status(400).json({ error: 'content missing' })
    }

    const user = await User.findById(body.userId)

    const note = new Note({
      content: body.content,
      important: body.important === undefined ? false : body.important,
      date: new Date(),
      user: user._id
    })

    const savedNote = await note.save()

    user.notes = user.notes.concat(savedNote._id)
    await user.save()

    response.json(Note.format(savedNote))
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong...' })
  }
})

notesRouter.put('/:id', (request, response) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important
  }

  Note
    .findOneAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(Note.format(updatedNote))
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

module.exports = notesRouter