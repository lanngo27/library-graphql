import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useMutation } from '@apollo/client'
import { ADD_BOOKS } from '../graphql/mutations'
import Notification from './Notification'

const NewBook = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])
  const [notification, setNotification] = useState(null)

  const cleanGenre = str => str.trim().charAt(0).toUpperCase() + str.trim().slice(1).toLowerCase()

  const [ addBook ] = useMutation(ADD_BOOKS, {
    onError: (errors) => {
      setNotification({
        message: errors.graphQLErrors[0].message,
        error: true
      })
    },
    onCompleted: () => {
      setNotification({
        message: `Book ${title} is added successfully!`,
        error: false
      })
    }
  })

  const submit = (event) => {
    event.preventDefault()

    const publishedToNumber = parseInt(published)

    addBook({ variables: {
      title, author, published: publishedToNumber, genres
    } })

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(cleanGenre(genre)))
    setGenre('')
  }

  return (
    <div className="m-3">
      <p>Only logged-in user is allowed to add new book!</p>
      <Form onSubmit={submit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            className="w-50"
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Author</Form.Label>
          <Form.Control
            className="w-50"
            type="text"
            placeholder="Enter author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Published year</Form.Label>
          <Form.Control
            className="w-50"
            type="number"
            placeholder="Enter published year"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control
            className="w-50 mb-3"
            type="text"
            placeholder="Enter book genre"
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <Button onClick={addGenre} className="w-25">
            Add genre
          </Button>
        </Form.Group>
        <div>Genres: {genres.join(' ')}</div>
        <Button type="submit" className="my-2 w-25">
          Create
        </Button>
        {notification
          ? <Notification message={notification.message} error={notification.error}/>
          : null}
      </Form>
    </div>
  )
}

export default NewBook
