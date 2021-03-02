export default function storeFavorites(login, favorites) {
  const allFavorites = JSON.parse(localStorage.getItem('favorites'))
  allFavorites[login] = favorites
  return localStorage.setItem('favorites', JSON.stringify(allFavorites))
}
