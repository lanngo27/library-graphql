import { useQuery } from '@apollo/client'
import { useState, useEffect } from 'react'
import { Table, Button } from 'react-bootstrap'
import { ALL_BOOKS, ALL_BOOKS_OF_GENRE } from '../graphql/queries'

const Books = () => {
  const [ selectedGenre, setSelectedGenre ] = useState(null)
  const [ genres, setGenres ] = useState([])
  const [ books, setBooks ] = useState([])
  const [ filteredBooks, setFilteredBooks ] = useState([])
  const result = useQuery(ALL_BOOKS)
  const filterResult = useQuery(ALL_BOOKS_OF_GENRE, {
    variables: { genre: selectedGenre }
  })

  useEffect(() => {
    if (result.data) {
      setBooks(result.data.allBooks)
      let genresList = ['All genres']
      books.forEach(b => {
        b.genres.forEach((g) => {
          if (genresList.indexOf(g) === -1) {
            genresList.push(g)
          }
        })
      })
      setGenres(genresList)
      setFilteredBooks(books)
      setSelectedGenre(null)
    }
  }, [result, books])

  useEffect(() => {
    if (filterResult.data) {
      setFilteredBooks(filterResult.data.allBooks)
    }
  }, [filterResult])

  if (!result.data) {
    return null
  }

  const filterBooks = (g) => {
    if (g === 'All genres') {
      setSelectedGenre(null)
    }
    else{
      setSelectedGenre(g)
    }
  }

  return (
    <div className="p-2">
      <h2>Books</h2>
      <p>
        Genre: <b>{selectedGenre === null ? 'All genres' : selectedGenre}</b>
      </p>

      <div>
        {genres.length > 0 &&
          genres.map((g) => (
            <Button
              className="me-1 mb-1"
              variant="outline-primary"
              onClick={() => filterBooks(g)}
              key={g}>
              {g}
            </Button>
          ))}
      </div>

      <Table striped bordered hover className="mt-3 table-style">
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

export default Books
