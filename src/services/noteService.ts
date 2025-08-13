import axios from "axios";
import type { Note } from '../types/note'

axios.defaults.baseURL = 'https://notehub-public.goit.study/api/';
axios.defaults.headers["Authorization"] = `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`

interface FetchNotesResponse {
    notes: Note[]
    totalPages: number
}

export const fetchNotes = async (search: string, page = 1, perPage = 10): Promise<FetchNotesResponse> => {

    const params: Record<string, string> = {
        page: String(page),
        perPage: String(perPage),
    };

    if (search.trim() !== '') {
        params.search = search;
    }
    
    const responsse = await axios<FetchNotesResponse>("notes", {
        params: {
            search,
            page,
            perPage,
        },
    })
    return responsse.data
}

export const createNote = async (title: string, content: string, tag: string): Promise<Note> => {

    const responsse = await axios.post<Note>("notes", {
        title,
        content,
        tag,
    })
    return responsse.data
    
}


export const deleteNote = async (id: string): Promise<Note> => {
    const responsse = await axios.delete<Note>(`notes/${id}`)
    return responsse.data
}

