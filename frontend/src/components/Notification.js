import { Alert } from 'react-bootstrap'

const Notification = (props) => {
  if (props.message === null) return null
  let messageType = 'success'
  if (props.error) {
    messageType = 'danger'
  }

  return (
    <Alert key={messageType} variant={messageType}>
      {props.message}
    </Alert>
  )
}

export default Notification
