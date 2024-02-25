const express = require('express')
var morgan = require('morgan')

const app = express()

app.use(express.json())

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

morgan.token('body', req => {
    const body = req.body
    if (!body.name || !body.number || req.method !== 'POST') {
        return ' '
    }
    return JSON.stringify(req.body)
})
const requestLogger = morgan(':method :url :status :res[content-length] - :response-time ms :body')

app.use(requestLogger)

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/info', (request, response) => {
    const currentTime = new Date();
    const formattedTime = currentTime.toUTCString();

    response.send(
        `
            <p>Phonebook has info for ${persons.length} people<br></p>
            <p>${formattedTime.toLocaleString()}</p>
        `
    )
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'The name or number is missing'
        })
    }

    if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'The name must be unique'
        })
    }

    const person = {
        id: Math.floor(Math.random() * 10000),
        name: body.name,
        number: body.number,
    }

    persons = persons.concat(person)

    response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})