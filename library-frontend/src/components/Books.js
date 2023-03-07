import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ALL_GENRES } from '../queries'
import { useState } from 'react'

const GenreSelection = ({ genreQuery, setGenre }) => {
  if (genreQuery.loading) {
    return <div>Loading genres...</div>
  }

  const genres = [
    ...new Set(genreQuery.data.allBooks.flatMap((book) => book.genres)),
  ]

  return (
    <div>
      <button onClick={() => setGenre('All genres')}>All genres</button>
      {genres.map((genre) => (
        <button key={genre} onClick={() => setGenre(genre)}>
          {genre}
        </button>
      ))}
    </div>
  )
}

const Books = (props) => {
  const [genreToShow, setGenreToShow] = useState('All genres')
  const result = useQuery(ALL_BOOKS, {
    variables: {
      genre: genreToShow !== 'All genres' ? genreToShow : undefined,
    },
  })
  const genresResult = useQuery(ALL_GENRES)

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>Loading...</div>
  }

  const books = result.data.allBooks

  return (
    <div>
      <h2>books</h2>
      <div>
        In genre <b>{genreToShow}</b>
      </div>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <GenreSelection genreQuery={genresResult} setGenre={setGenreToShow} />
    </div>
  )
}

export default Books
