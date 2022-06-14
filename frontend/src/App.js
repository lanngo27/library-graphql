import { useEffect, useState } from 'react'
import { useApolloClient, useSubscription } from '@apollo/client'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { Button, Navbar, Container, Nav, Offcanvas } from 'react-bootstrap'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import { BOOK_ADDED } from './graphql/subscriptions'
import { ME, ALL_AUTHORS, ALL_BOOKS, ALL_BOOKS_OF_GENRE } from './graphql/queries'
import Recommended from './components/Recommended'
import Signup from './components/Signup'

const uniqByTitle = (a) => {
  let seen = new Set()
  return a.filter((item) => {
    let k = item.title
    return seen.has(k) ? false : seen.add(k)
  })
}

export const updateCacheGenre = (cache, book, genre) => {
  // update recommended book for user
  cache.updateQuery({
    query: ALL_BOOKS_OF_GENRE,
    variables: { genre: genre }
  }, (data) => {
    if (!data) return
    return {
      allBooks: uniqByTitle(data.allBooks.concat(book))
    }
  })
}

export const updateCache = (cache, newBook) => {
  cache.updateQuery({ query: ALL_BOOKS }, (data) => {
    if (!data) return
    return {
      allBooks: uniqByTitle(data.allBooks.concat(newBook.book))
    }
  })

  updateCacheGenre(cache, newBook.book, null)

  const userData = cache.readQuery({ query: ME })
  if (userData && userData.me)
  {
    if (newBook.book.genres.includes(userData.me.favoriteGenre)) {
      updateCacheGenre(cache, newBook.book, userData.me.favoriteGenre)
    }
  }

  // update author
  const updateAuthor = (authors, data) => {
    if (authors.filter(a => a.name === data.name).length === 0)
      return authors.concat(data)
    return authors.map(a => a.name === data.name ? data : a)
  }
  cache.updateQuery({ query: ALL_AUTHORS }, (data) => {
    if (!data) return
    return {
      allAuthors: updateAuthor(data.allAuthors, newBook.author)
    }
  })
}

const App = () => {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState('')
  const client = useApolloClient()
  const nav = useNavigate()

  useEffect(() => {
    const savedToken = localStorage.getItem('library-user')
    if (savedToken) {
      setToken(savedToken)
      setUser(localStorage.getItem('library-username'))
    }
  }, [])

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBookAndAuthor = subscriptionData.data.bookAdded

      updateCache(client.cache, addedBookAndAuthor)
    }
  })

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    nav('/login')
  }

  return (
    <div className="h-100">
      <Navbar
        sticky="top"
        className="mb-3"
        bg="primary"
        variant="dark"
        expand="md"
      >
        <Container fluid>
          <Navbar.Brand>Library App</Navbar.Brand>
          <Nav className="me-auto"></Nav>
          <Navbar.Toggle aria-controls={'offcanvasNavbar-expand-sm'} />
          <Navbar.Offcanvas
            id={'offcanvasNavbar-expand-sm'}
            aria-labelledby={'offcanvasNavbarLabel-expand-sm'}
            placement="end"
            bg="dark"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={'offcanvasNavbarLabel-expand-sm'}>
                Library App
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-left flex-grow-1 pe-3">
                <Nav.Link as={Link} to="/">
                  Books
                </Nav.Link>
                <Nav.Link as={Link} to="/authors">
                  Authors
                </Nav.Link>
                <Nav.Link as={Link} to="/addbook">
                  Add Book
                </Nav.Link>
                {token
                  ? <Nav.Link as={Link} to="/recommended">
                    Recommended
                  </Nav.Link>
                  : <>
                    <Nav.Link as={Link} to="/login">
                      Log in
                    </Nav.Link>
                    <Nav.Link as={Link} to="/signup">
                      Sign up
                    </Nav.Link>
                  </>
                }
              </Nav>
              {token
                ? <Nav className="justify-content-end flex-grow-1 pe-3">
                  <Navbar.Text>Signed in as: {user}</Navbar.Text>
                  <Button variant="primary" type="submit" onClick={logout}>
                    Log out
                  </Button>
                </Nav>
                : null
              }
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
      <Routes>
        <Route path="/" element={<Books />} />
        <Route path="/authors" element={<Authors />} />
        <Route path="/addbook" element={<NewBook />} />
        <Route path="/recommended" element={<Recommended />} />
        <Route path="/login" element={<LoginForm setToken={setToken} setUser={setUser}/>} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  )
  //
}

export default App
