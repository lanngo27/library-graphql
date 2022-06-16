import { useMutation, useQuery } from '@apollo/client'
import { useState, useEffect } from 'react'
import { Table, Button, Form, Row } from 'react-bootstrap'
import { ALL_AUTHORS } from '../graphql/queries'
import { EDIT_AUTHORS } from '../graphql/mutations'
import Notification from './Notification'

const Authors = () => {
  const [ name, setName ] = useState(null)
  const [ year, setYear ] = useState('')
  const [ authors, setAuthors ] = useState([])
  const [notification, setNotification] = useState(null)
  const result = useQuery(ALL_AUTHORS)
  const [ editResult ] = useMutation(EDIT_AUTHORS, {
    refetchQueries: [ { query: ALL_AUTHORS } ],
    onError: (errors) => {
      setNotification({
        message: errors.graphQLErrors[0].message,
        error: true
      })
    },
    onCompleted: () => {
      setNotification({
        message: `Edited author ${name} successfully!`,
        error: false
      })
    }
  })

  useEffect(() => {
    if (result.data) {
      setAuthors(result.data.allAuthors)
    }
  }, [result])

  if (!result.data) {
    return null
  }

  if (!name && authors.length > 0) {
    setName(authors[0].name)
  }

  const setBirthYear = async (e) => {
    e.preventDefault()

    editResult({ variables: {
      name, setBornTo: parseInt(year)
    } })
    setName('')
    setYear('')
  }

  return (
    <div className="m-3">
      <h2>Authors</h2>

      <Table striped bordered hover className="table-style">
        <thead>
          <tr>
            <th>Name</th>
            <th>Born</th>
            <th>Number of books</th>
          </tr>
        </thead>
        <tbody>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.books.length}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <h2>Set birthyear</h2>
      <p>Only logged-in user is allowed to edit!</p>
      {name
        ? <Form value={name ? name : 'Select author'} onSubmit={setBirthYear}>
          <Form.Group as={Row} className="ms-1 mb-2">
            <Form.Select className="w-50" onChange={({ target }) => setName(target.value)}>
              {authors.map((a) =>
                (<option value={a.name} key={a.name}>{a.name}</option>))
              }
            </Form.Select>
            <p className="ms-0 pt-3">borns in</p>
            <Form.Control
              value={year}
              type="number"
              onChange={({ target }) => setYear(target.value)}
              className="w-25"
            />
            <Button
              type="submit"
              variant="outline-primary"
              className="my-2 p-2 ms-1 w-25">
              Update author
            </Button>
          </Form.Group>
          {notification
            ? <Notification
              message={notification.message}
              error={notification.error}
            />
            : null}
        </Form>
        : null
      }
    </div>
  )
}

export default Authors
