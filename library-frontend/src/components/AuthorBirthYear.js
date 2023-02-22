import { useMutation } from '@apollo/client'
import { useEffect, useState } from 'react'
import { EDIT_AUTHOR } from '../queries'

const AuthorBirthYear = () => {
  const [name, setName] = useState('')
  const [year, setYear] = useState('')

  const [changeYear, result] = useMutation(EDIT_AUTHOR)

  useEffect(() => {
    if (result.data && result.data.editAuthor === null) {
      console.error('person not found')
    }
  }, [result.data]) // eslint-disable-line

  const submit = (event) => {
    event.preventDefault()

    changeYear({ variables: { name, year: Number(year) } })

    setName('')
    setYear('')
  }

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          Name
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          Born
          <input
            value={year}
            onChange={({ target }) => setYear(target.value)}
          />
        </div>
        <button type="submit">Update author</button>
      </form>
    </div>
  )
}

export default AuthorBirthYear
