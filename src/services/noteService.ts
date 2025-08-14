import axios from "axios";
import type { Note } from '../types/note'

axios.defaults.baseURL = 'https://notehub-public.goit.study/api';
axios.defaults.headers["Authorization"] = `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`

type Tags = "Work" | "Personal" | "Meeting" | "Shopping" | "Todo" | undefined

interface FetchNotesResponse {
    notes: Note[]
    totalPages: number
}

export const fetchNotes = async (search: string, page: number = 1, perPage: number = 12, tag?: Tags) => {

    const response = await axios<FetchNotesResponse>("/notes", {
        params: {
            search,
            page,
            perPage,
            tag,
        },
    })
    return response.data
}

export const createNote = async (title: string, content: string, tag: string) => {

    const response = await axios.post<Note>("notes", {
        title,
        content,
        tag,
    })
    return response.data
    
}


export const deleteNote = async (id: string): Promise<Note> => {
    const response = await axios.delete<Note>(`/notes/${id}`)
    return response.data
}

