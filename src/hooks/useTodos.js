import {useState, useEffect} from 'react';
import {formatDateKey} from '../utils/dateUtils';
import  {loadFromStorage, saveToStorage} from '../utils/storageUtils';

export default function useTodos(selectedDate){
    const [todos, setTodos] = useState(() => loadFromStorage());
    const [filter, setFilter] = useState('all');
    useEffect(()=>{
        saveToStorage(todos);
    },[todos]);
    const dateKey = formatDateKey(selectedDate);
    const todayTodos = todos.filter(t => t.date === dateKey);
    const filteredTodos = todayTodos.filter(t => { 
        if (filter === 'active') return !t.done;
        if (filter === 'done') return t.done;
        return true;
    });
    const remaining = todayTodos.filter(t => !t.done).length;
    const counts = {
        all: todayTodos.length,
        active: remaining,
    };
    function addTodo(text) {
    setTodos(prev => {
      const id = prev.length === 0 ? 1 : Math.max(...prev.map(t => t.id)) + 1;
      return [...prev, { id, text, done: false, date: dateKey }];
        });
    }

    function toggleDone(id) {
        setTodos(prev =>
        prev.map(t => t.id === id ? { ...t, done: !t.done } : t)
        );
    }

    function deleteTodo(id) {
        setTodos(prev => prev.filter(t => t.id !== id));
    }

    function saveEdit(id, newText) {
        setTodos(prev =>
        prev.map(t => t.id === id ? { ...t, text: newText } : t)
        );
    }
    return {
        filteredTodos,
        filter,
        setFilter,
        counts,
        remaining,
        addTodo,
        toggleDone,
        deleteTodo,
        saveEdit,
    }; 

}