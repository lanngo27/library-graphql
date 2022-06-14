import { useQuery } from '@apollo/client'
import { useState, useEffect } from 'react'
import { Table } from 'react-bootstrap'
import { ME, ALL_BOOKS_OF_GENRE } from '../graphql/queries'

const Recommended = () => {
  const [ favioriteGenre, setFavioriteGenre ] = useState(null)
  const [ filteredBooks, setFilteredBooks ] = useState([])
  const result = useQuery(ME)
  const filterResult = useQuery(ALL_BOOKS_OF_GENRE, {
    variables: { genre: favioriteGenre }
  })

  useEffect(() => {
    if (result.data && result.data.me) {
      setFavioriteGenre(result.data.me.favoriteGenre)
    }
  }, [result])

  useEffect(() => {
    if (filterResult.data) {
      setFilteredBooks(filterResult.data.allBooks)
    }
  }, [filterResult])

  if (!result.data) {
    return null
  }

  return (
    <div className="p-2">
      <h2>Recommendations</h2>

      <p>
        Books in your favorite genre: <b>{favioriteGenre}</b>
      </p>

      <Table striped bordered hover className="table-style">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default Recommended
