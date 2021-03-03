export default function storeFavorites(login, favorites) {
  const allFavorites = JSON.parse(localStorage.getItem('favorites'))
  allFavorites[login] = favorites
  localStorage.setItem('favorites', JSON.stringify(allFavorites))
}
