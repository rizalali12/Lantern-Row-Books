export const goToId = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
}
