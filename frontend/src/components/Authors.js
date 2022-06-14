import { useMutation, useQuery } from '@apollo/client'
import { useState, useEffect } from 'react'
import { Table, Button, Form, Row } from 'react-bootstrap'
import { ALL_AUTHORS } from '../graphql/queries'
import { EDIT_AUTHORS } from '../graphql/mutations'

const Authors = () => {
  const [ name, setName ] = useState(null)
  const [ year, setYear ] = useState('')
  const [ authors, setAuthors ] = useState([])
  const result = useQuery(ALL_AUTHORS)
  const [ editResult ] = useMutation(EDIT_AUTHORS, {
    refetchQueries: [ { query: ALL_AUTHORS } ]
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
    <div className="p-2">
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
      <div>
        {name
          ? <Form onSubmit={setBirthYear} className="ms-2">
            <Form.Group as={Row}>
              <Form.Select className="w-50">
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
                className="m-1 p-2 ms-1 w-25">
                Update author
              </Button>
            </Form.Group>
          </Form>
          : null
        }
      </div>
    </div>
  )
}

export default Authors
