const addContentToStore = store => {
  // called when the store is initialized
  store.subscribe((mutation, state) => {
    if (mutation.type === "ADD_CONTENT") {
    }
  })
}
