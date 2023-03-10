import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ME } from '../queries'
import BookList from './BookList'

const RecommendedBooks = ({ show }) => {
  const userQuery = useQuery(ME)

  const user = userQuery.data?.me
  const genre = user?.favouriteGenre

  const bookQuery = useQuery(ALL_BOOKS, {
    variables: {
      genre: genre,
    },
    skip: !genre,
  })

  if (!show) {
    return null
  }

  if (userQuery.loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <div>Not logged in.</div>
  }

  const books = bookQuery.data?.allBooks

  return (
    <div>
      <h2>Recommendations for {user.username}</h2>
      Books in your favourite genre <b>{genre}</b>
      <BookList books={books} />
    </div>
  )
}

export default RecommendedBooks
