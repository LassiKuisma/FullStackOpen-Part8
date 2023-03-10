import { useQuery } from '@apollo/client'
import { ME } from '../queries'

const RecommendedBooks = ({ show }) => {
  const userQuery = useQuery(ME)

  if (!show) {
    return null
  }

  if (userQuery.loading) {
    return <div>Loading...</div>
  }

  const user = userQuery.data.me
  if (!user) {
    return <div>Not logged in.</div>
  }

  const genre = user.favouriteGenre

  return (
    <div>
      <h2>Recommendations for {user.username}</h2>
      Books in your favourite genre <b>{genre}</b>
    </div>
  )
}

export default RecommendedBooks
