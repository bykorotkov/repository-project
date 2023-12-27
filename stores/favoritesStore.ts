import { makeAutoObservable } from "mobx"
import { RepositoriesData } from "@/types/repositories"

class FavoritesStore {
    favorites: RepositoriesData[] = []

    constructor() {
        makeAutoObservable(this, {
            favorites: true
        })
    }

    addToFavorites(repository: RepositoriesData) {
        const isAlreadyAdded = this.favorites.some((favorite) => favorite.id === repository.id)
        if (!isAlreadyAdded) {
            this.favorites.push(repository)
        }
    }

    removeFromFavorites(repository: RepositoriesData) {
        const index = this.favorites.findIndex((favorite) => favorite.id === repository.id)
        if (index !== -1) {
            this.favorites.splice(index, 1)
        }
    }
}

const favoritesStore = new FavoritesStore()

export default favoritesStore
