import { Formik, Form, Field, ErrorMessage, type FormikHelpers} from "formik"
import css from './NoteForm.module.css'
import * as Yup from 'yup'
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createNote } from "../services/noteService"
import { Loading } from "notiflix"
import toast from "react-hot-toast"

interface NoteFormProps {
    query: string
    page: number
    onSubmit: () => void
    onCancel: () => void
}

const formTags = ['Work', 'Personal', 'Meeting', 'Shopping', 'Todo'] as const

export interface InitialValues {
    title: string
    content: string
    tag: (typeof formTags) [number]
}

const initialValues: InitialValues = {
    title: '',
    content: '',
    tag: 'Todo',
};

const NoteFormSchema = Yup.object().shape({
    title: Yup.string()
        .min(3, 'Title must be at least 5 characters')
        .max(50, 'Title is to long')
        .required('Title is required'),
    content: Yup.string()
        .max(500, 'Text is to long'),
    tag: Yup.string().oneOf(formTags),
    
})

export default function NoteForm({ query, page, onSubmit, onCancel }: NoteFormProps) {
    
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async ({ title, content, tag }: InitialValues) => {
            const data = await createNote(title, content, tag)
            return data
        },

        onSuccess: () => {
            onSubmit()
            Loading.remove()
            toast.success('Note created successfully ✅')
            queryClient.invalidateQueries({queryKey: ['notes', query, page]})
        },

        onError: () => {
            Loading.remove()
            toast.error('Error creating note ❌')
        },
    })

    const handleSubmit = (values: InitialValues, actions: FormikHelpers<InitialValues>
    ) => {
        Loading.pulse()
        mutation.mutate(values)
        actions.resetForm()
    }
    
    return (
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={NoteFormSchema}>
            <Form className={css.form}>
                <div className={css.formGroup}>
                    <label htmlFor="title">Title</label>
                    <Field id="title" type="text" name="title" className={css.input} />
                    <ErrorMessage name="title" component="span" className={css.error} />
                </div>
                <div className={css.formGroup}>
                    <label htmlFor="content">Content</label>
                    <Field
                        as="textarea"
                        id="content"
                        name="content"
                        rows={8}
                        className={css.textarea}
                    />
                    <ErrorMessage name="content" component="span" className={css.error} />
                </div>
                <div className={css.formGroup}>
                    <label htmlFor="tag">Tag</label>
                    <Field as="select" id="tag" name="tag" className={css.select}>
                        <option value="Todo">Todo</option>
                        <option value="Work">Work</option>
                        <option value="Personal">Personal</option>
                        <option value="Meeting">Meeting</option>
                        <option value="Shopping">Shopping</option>
                    </Field>
                    <ErrorMessage name="tag" component="span" className={css.error} />
                </div>
                <div className={css.actions}>
                    <button type="button" className={css.cancelButton} onChangeCapture={onCancel}>Cancel</button>
                    <button type="submit" className={css.submitButton}>Create note</button>
                </div>
            </Form>
        </Formik>
        

    )
}