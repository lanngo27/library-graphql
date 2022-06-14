import { Form, Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../graphql/mutations'
import Notification from './Notification'

const LoginForm = ({ setToken, setUser }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState(null)
  const nav = useNavigate()

  const [login, result] = useMutation(LOGIN, {
    onError: (errors) => {
      setNotification({
        message: errors.graphQLErrors[0].message,
        error: true
      })
    }
  })

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value

      setToken(token)
      setUser(username)
      localStorage.setItem('library-username', username)
      localStorage.setItem('library-user', token)

      setUsername('')
      setPassword('')

      nav('/')
    }
  }, [result.data]) // eslint-disable-line

  const submit = (event) => {
    event.preventDefault()

    login({ variables: { username, password } })
  }
  //
  return (
    <div className="d-flex justify-content-center align-items-center h-75">
      <Form onSubmit={submit} className="login-container p-8">
        <h3>Log in</h3>
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
        <Button
          id="login-button"
          type="submit"
          variant="primary"
          className="btn btn-outline-light btn-lg px-5"
        >
          Log in
        </Button>
        <p className="text-right">
          Not registered yet? <Link to="/signup">Sign up</Link>
        </p>

        {notification
          ? <Notification message={notification.message} error={notification.error}/>
          : null}
      </Form>
    </div>
  )
}

export default LoginForm