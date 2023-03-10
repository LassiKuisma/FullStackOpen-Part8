import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'

const Login = ({ show, setToken, setPage }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [login] = useMutation(LOGIN, {
    update: (_cache, { data }) => {
      // Token must be set here (in update), as other queries require
      // authorization header, such as logged-in user query.
      // Setting token with onComplete or effect hook runs these queries
      // before token is added to header.
      const token = data.login.value
      setToken(token)
      localStorage.setItem('libraryapp-user-token', token)
    },
    onError: (error) => {
      console.log('error logging in:', error)
    },
    refetchQueries: ['LoggedInUser'],
  })

  const submit = async (event) => {
    event.preventDefault()

    const loginResult = await login({ variables: { username, password } })
    if (loginResult.errors) {
      console.log('error logging in!')
    }

    if (loginResult.data) {
      setUsername('')
      setPassword('')

      setPage('authors')
    }
  }

  if (!show) {
    return null
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div>
          Username
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          Password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default Login
