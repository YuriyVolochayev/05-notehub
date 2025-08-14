import css from './NoteList.module.css'
import type { Note } from '../../types/note'
import { deleteNote } from '../../services/noteService'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loading } from "notiflix"
import toast from 'react-hot-toast'

interface NoteListProps {
    notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: deleteNote,

        onSuccess: () => {
            Loading.remove()
            toast.success("Note created successfully")
            queryClient.invalidateQueries({ queryKey: ['notes'] });
        },

        onError: () => {
            Loading.remove()
            toast.error("Error creating note")
        },

    })

    const onDelete = (id: string) => {
            Loading.pulse()
            mutation.mutate(id)
        }

    if (notes.length === 0) return null;

    return (
        <ul className={css.list}>
            {notes.map((note) => (
                <li className={css.listItem} key={note.id}>
                    <h2 className={css.title}>{note.title}</h2>
                    <p className={css.content}>{note.content}</p>
                    <div className={css.footer}>
                        <span className={css.tag}>{note.tag}</span>
                        <button className={css.button} onClick={() => onDelete(note.id)}>Delete</button>
                    </div>
                </li>
            ))}
        </ul>
    )
}