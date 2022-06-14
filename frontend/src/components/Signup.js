import { Form, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { SIGNUP } from '../graphql/mutations'
import Notification from './Notification'

const SignupForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [favoriteGenre, setFavoriteGenre] = useState('')
  const [notification, setNotification] = useState(null)

  const [signup] = useMutation(SIGNUP, {
    onError: (errors) => {
      setNotification({
        message: errors.graphQLErrors[0].message,
        error: true
      })
    },
    onCompleted: () => {
      setNotification({
        message: `Created user ${username} successfully!`,
        error: false
      })
    }
  })

  const handleSignup = (event) => {
    event.preventDefault()

    signup({ variables: { username, password, favoriteGenre } })
    setUsername('')
    setPassword('')
    setFavoriteGenre('')
  }

  return (
    <div className="d-flex justify-content-center align-items-center h-75">
      <Form onSubmit={handleSignup} className="login-container p-8">
        <h3>Sign up</h3>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            className="w-100"
            type="text"
            name="username"
            value={username}
            placeholder="Enter your username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            className="w-100"
            type="password"
            name="password"
            value={password}
            placeholder="Enter your password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Favorite genre</Form.Label>
          <Form.Control
            className="w-100"
            type="text"
            name="genre"
            value={favoriteGenre}
            placeholder="Enter your favorite genre"
            onChange={({ target }) => setFavoriteGenre(target.value)}
          />
        </Form.Group>
        <Button
          id="signup-button"
          type="submit"
          variant="primary"
          className="btn btn-outline-light btn-lg px-5"
        >
          Register
        </Button>
        <p className="text-right">
          Already registered? <Link to="/login">Log in</Link>
        </p>

        {notification
          ? <Notification message={notification.message} error={notification.error}/>
          : null}
      </Form>
    </div>
  )
}

export default SignupForm
