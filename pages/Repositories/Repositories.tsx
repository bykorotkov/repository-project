"use client"
import React, { useCallback, useEffect, useState } from "react"
import classes from "./Repositories.module.scss"
import axios, { CancelToken, CancelTokenSource } from "axios"
import { RepositoriesData } from "@/types/repositories"
import favoritesStore from "@/stores/favoritesStore"
import { observer } from "mobx-react-lite"
import CopyButton from "@/pages/Repositories/CopyButton/CopyButton"

const Repositories = observer(() => {
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [repositories, setRepositories] = useState<RepositoriesData[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [cancelTokenSource, setCancelTokenSource] = useState<CancelTokenSource>(axios.CancelToken.source())

    useEffect(() => {
        return () => {
            cancelTokenSource.cancel("Request canceled by the user")
        }
    }, [cancelTokenSource])

    useEffect(() => {
        const newCancelTokenSource = axios.CancelToken.source()
        setCancelTokenSource(newCancelTokenSource)

        const delaySearch = setTimeout(() => {
            if (searchTerm) {
                handleSearch(searchTerm, newCancelTokenSource.token)
            }
        }, 1000)

        return () => clearTimeout(delaySearch)
    }, [searchTerm])

    const handleSearch = async (term: string, cancelToken: CancelToken) => {
        try {
            setLoading(true)
            const response = await axios.get(`https://api.github.com/search/repositories?q=${term}`, {
                cancelToken: cancelToken
            })
            setRepositories(response.data.items)
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log("Request canceled", error.message)
            } else {
                console.error("Error fetching data:", error)
            }
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target
        setSearchTerm(event.target.value)
    }, [])

    const handleAddToFavorites = (repository: RepositoriesData) => {
        favoritesStore.addToFavorites(repository)
    }

    const handleRemoveFromFavorites = (repo: RepositoriesData) => {
        favoritesStore.removeFromFavorites(repo)
    }

    return (
        <section className={classes.Repositories}>
            <div className={classes.QueryString}>
                <input
                    value={searchTerm}
                    onChange={handleInputChange}
                    className={classes.QueryInput}
                    type={"text"}
                    placeholder={"Введите текст"}
                />
                <CopyButton text={searchTerm} />
            </div>

            {loading ? (
                <p className={classes.Loader}>Loading...</p>
            ) : repositories.length ? (
                <div className={classes.RepoLists}>
                    <div className={classes.ListContainer}>
                        <h2 className={classes.Head}>Список репозиториев</h2>
                        <div className={classes.Body}>
                            {repositories.map((repo, i) => (
                                <div
                                    className={classes.ListItem}
                                    key={repo.id}
                                >
                                    <div className={classes.TopBlock}>
                                        <div className={classes.Logo}>
                                            <img
                                                src={repo.owner.avatar_url}
                                                alt="Avatar"
                                            />
                                        </div>
                                        <div className={classes.Info}>
                                            <p>Repository: {repo.full_name}</p>
                                            <p>Stars: {repo.stargazers_count}</p>
                                            <p>Forks: {repo.forks_count}</p>
                                        </div>
                                    </div>

                                    <a
                                        href={repo.html_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={classes.Button}
                                    >
                                        Подробнее
                                    </a>
                                    {
                                        <button
                                            className={classes.repoButton}
                                            onClick={() => handleAddToFavorites(repo)}
                                        >
                                            Добавить в избранное
                                        </button>
                                    }
                                </div>
                            ))}
                        </div>
                    </div>

                    {favoritesStore.favorites ? (
                        <div className={classes.FavoritesListContainer}>
                            <h2 className={classes.Head}>Список избранных репозиториев</h2>
                            <div className={classes.Body}>
                                {favoritesStore.favorites.map((repo, i) => (
                                    <div
                                        className={classes.ListItem}
                                        // key={repo.id}
                                        key={i}
                                    >
                                        <div className={classes.TopBlock}>
                                            <div className={classes.Logo}>
                                                <img
                                                    src={repo.owner.avatar_url ? repo.owner.avatar_url : ""}
                                                    alt="Avatar"
                                                />
                                            </div>
                                            <div className={classes.Info}>
                                                <p>Repository: {repo.full_name}</p>
                                                <p>Stars: {repo.stargazers_count}</p>
                                                <p>Forks: {repo.forks_count}</p>
                                            </div>
                                        </div>
                                        <a
                                            href={repo.html_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={classes.Button}
                                        >
                                            Подробнее
                                        </a>
                                        <button
                                            className={classes.repoButton}
                                            onClick={() => favoritesStore.removeFromFavorites(repo)}
                                        >
                                            Удалить из избранного
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : null}
                </div>
            ) : null}
        </section>
    )
})

export default Repositories
