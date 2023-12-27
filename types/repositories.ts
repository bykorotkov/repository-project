export interface RepositoriesData {
    id: number
    html_url: string
    full_name: string
    stargazers_count: number
    forks_count: number
    owner: RepositoriesDataOwner
}

export interface RepositoriesDataOwner {
    avatar_url: string
}
