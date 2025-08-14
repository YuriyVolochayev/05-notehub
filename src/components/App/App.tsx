import React, { useState, useEffect } from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import css from "./App.module.css"
import NoteList from '../NoteList/NoteList'
import { fetchNotes } from '../../services/noteService'
import Pagination from '../Pagination/Pagination'
import { Loading } from 'notiflix'
import { useDebounce, useDebouncedCallback } from 'use-debounce'
import Modal from '../Modal/Modal'
import NoteForm from '../NoteForm/NoteForm'
import { Toaster } from 'react-hot-toast'
import SearchBox from '../SearchBox/SearchBox'

export default function App() {
    const [page, setPage] = useState<number>(1)
    const [query, setQuery] = useState<string>("")
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [debouncedQuery] = useDebounce(query, 400)

    const {
        data: notes,
        isSuccess,
        isLoading,
    } = useQuery({
        queryKey: ['notes', debouncedQuery, page],
        queryFn: () => fetchNotes(debouncedQuery, page),
        placeholderData: keepPreviousData,
    })

    const totalPages = notes?.totalPages ?? 1
    const onQueryChange = useDebouncedCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setPage(1)
            setQuery(e.target.value)
        }, 400
    )

    const openModal = () => {
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
    }

    useEffect(() => {
        if (isLoading) {
            Loading.pulse()
        } else {
            Loading.remove()
        }
    }, [isLoading])

        return (
        <div className={css.app}>
            <Toaster/>
            <header className={css.toolbar}>
                <SearchBox onSearch={onQueryChange}/>
                {totalPages > 1 && (<Pagination pageCount={totalPages} currentPage={page} onPageChange={setPage} />)}
                <button className={css.button} onClick={openModal}>Create note +</button>
            </header>
                {isSuccess && notes && (
                    <NoteList notes={notes.notes} />)}
            {isModalOpen && (<Modal onClose={closeModal}>
                <NoteForm
                    query={debouncedQuery}
                    page={page}
                    onSubmit={closeModal}
                    onCancel={closeModal}
                />
                </Modal>
            )}
        </div>
    )
}

