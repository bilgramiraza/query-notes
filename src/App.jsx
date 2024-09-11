import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createNote, getNotes, updateNote } from "./requests"

const App = () => {
  const queryClient = useQueryClient();

  const newNoteMutuation = useMutation({
    mutationFn: createNote,
    onSuccess: newNote => {
      const notes = queryClient.getQueryData(['notes']);
      queryClient.setQueryData(['notes'], notes.concat(newNote));
    },
  });

  const addNote = async event => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    console.log(content)
    newNoteMutuation.mutate({ content, important: true });
  }

  const updateNoteMutation = useMutation({
    mutationFn: updateNote,
    onSuccess: updatedNote => {
      const notes = queryClient.getQueryData(['notes']);
      queryClient.setQueryData(['notes'], notes.map(note => note.id === updatedNote.id ? updatedNote : note));
    },
  });

  const toggleImportance = note => {
    console.log('toggle importance of', note.id)
    updateNoteMutation.mutate({ ...note, important: !note.important });
  }

  const result = useQuery({
    queryKey: ['notes'],
    queryFn: getNotes,
    refetchOnWindowFocus: false,
  });
  console.log(JSON.parse(JSON.stringify(result)));

  if (result.isLoading) return <div>Loading Data</div>;

  const notes = result.data;

  return (
    <div>
      <h2>Notes app</h2>
      <form onSubmit={addNote}>
        <input name="note" />
        <button type="submit">add</button>
      </form>
      {notes.map(note =>
        <li key={note.id} onClick={() => toggleImportance(note)}>
          {note.content}
          <strong> {note.important ? 'important' : ''}</strong>
        </li>
      )}
    </div>
  )
}

export default App
