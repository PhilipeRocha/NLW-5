import {createContext, useState, ReactNode, useContext} from 'react'

interface IEpisode {
    title: string
    members: string
    thumbnail:string
    duration: number;
    url: string;
}

interface IPlayerContextData {
    episodeList: IEpisode[]
    currentEpisodeIndex: number
    isPlaying: boolean
    play: (episode: IEpisode) => void
    togglePlay: () => void
    playNext: () => void
    playPrevious: () => void
    playList: (list: IEpisode[], index: number) => void
    setPlayingState: (state: boolean) => void
    isLooping: boolean
    toggleLoop: () => void
    isShuffling: boolean
    toggleShuffle: () => void
    clearPlayerState: () => void
    hasNext: boolean
    hasPrevious: boolean
}

export const PlayerContext = createContext({} as IPlayerContextData)

interface IPlayerContextProviderProps {
    children: ReactNode;
}

export function PlayerContextProvider( {children}: IPlayerContextProviderProps ) {
    const [episodeList, setEpisodeList] = useState([])
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isLooping, setIsLooping] = useState(false)
    const [isShuffling, setIsShuffling] = useState(false)

    const hasPrevious = currentEpisodeIndex > 0
    const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length

    function play(episode: IEpisode) {
        setEpisodeList([episode])
        setCurrentEpisodeIndex(0)
        setIsPlaying(true)
    }

    function playList(list: IEpisode[], index: number) {
        setEpisodeList(list)
        setCurrentEpisodeIndex(index)
        setIsPlaying(true)
    }

    function togglePlay() {
        setIsPlaying(!isPlaying)
    }

    function toggleLoop() {
        setIsLooping(!isLooping)
    }

    function toggleShuffle() {
        setIsShuffling(!isShuffling)
    }

    function setPlayingState(state: boolean) {
        setIsPlaying(state)
    }

    function clearPlayerState() {
        setEpisodeList([])
        setCurrentEpisodeIndex(0)
    }

    function playNext() {

        if(isShuffling) {
            const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)

            setCurrentEpisodeIndex(nextRandomEpisodeIndex)
        } else if(hasNext) {
            setCurrentEpisodeIndex(currentEpisodeIndex + 1)
        }
    }

    function playPrevious() {
        if(hasPrevious) {
            setCurrentEpisodeIndex(currentEpisodeIndex - 1)
        }
    }


    return (
        <PlayerContext.Provider value={{ episodeList, 
            currentEpisodeIndex, 
            play, 
            isPlaying, 
            togglePlay, 
            playList,
            playPrevious,
            playNext,
            hasNext,
            hasPrevious,
            isLooping,
            toggleLoop,
            isShuffling,
            toggleShuffle,
            clearPlayerState,
            setPlayingState
        }}>

            {children}
        </PlayerContext.Provider>
    )
}

export const usePlayer = () => {
    return useContext(PlayerContext)
}