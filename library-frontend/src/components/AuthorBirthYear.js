import { useMutation } from '@apollo/client'
import { useEffect, useState } from 'react'
import { EDIT_AUTHOR } from '../queries'

const AuthorBirthYear = ({ authors }) => {
  const [name, setName] = useState('Select author')
  const [year, setYear] = useState('')

  const [changeYear, result] = useMutation(EDIT_AUTHOR)

  useEffect(() => {
    if (result.data && result.data.editAuthor === null) {
      console.error('person not found')
    }
  }, [result.data]) // eslint-disable-line

  const submit = (event) => {
    event.preventDefault()

    if (name === 'Select author') {
      console.log('Please select author first')
      return
    }

    changeYear({ variables: { name, year: Number(year) } })

    setName('Select author')
    setYear('')
  }

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          <select value={name} onChange={({ target }) => setName(target.value)}>
            <option>Select author</option>
            {authors.map((author) => (
              <option key={author.id} value={author.name}>
                {author.name}
              </option>
            ))}
          </select>
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
