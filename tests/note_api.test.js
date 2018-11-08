const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Note = require('../models/note')

const initialNotes = [
  {
    content: 'HTML on helppoa',
    important: false
  },
  {
    content: 'HTTP-protokollan tärkeimmät metodit ovat GET ja POST',
    important: true
  }
]

beforeAll(async () => {
  await Note.remove({})

  for (let note of initialNotes) {
    let noteObject = new Note(note)
    await noteObject.save()
  }

  // const noteObjects = initialNotes.map(note => new Note(note))
  // const promiseArray = noteObjects.map(note => note.save())
  // await Promise.all(promiseArray)
})

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all notes are returned', async () => {
  const response = await api
    .get('/api/notes')

  expect(response.body.length).toBe(initialNotes.length)
})

test('a specific note is within the returned notes', async () => {
  const response = await api
    .get('/api/notes')

  const contents = response.body.map(r => r.content)

  expect(contents).toContain('HTTP-protokollan tärkeimmät metodit ovat GET ja POST')
})

test('a valid note can be added', async () => {
  const newNote = {
    content: 'async/await',
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api
    .get('/api/notes')


  const contents = response.body.map(r => r.content)

  expect(response.body.length).toBe(initialNotes.length + 1)
  expect(contents).toContain('async/await')
})

test('note without content is not added', async () => {
  const newNote = {
    important: true
  }

  const initialNotes = await api
    .get('/api/notes')

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(400)

  const response = await api
    .get('/api/notes')

  expect(response.body.length).toBe(initialNotes.body.length)
})

afterAll(() => {
  server.close()
})
