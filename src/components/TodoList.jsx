import TodoItem from './TodoItem';

export default function TodoList({ todos, onToggleDone, onDelete, onSaveEdit }) {
  return (
    <main className="todo-list-wrapper">
      {todos.length === 0 ? (
        <div className="empty-state">
          <p>이 날의 할 일이 없습니다 ✦</p>
        </div>
      ) : (
        <ul className="todo-list">
          {todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggleDone={onToggleDone}
              onDelete={onDelete}
              onSaveEdit={onSaveEdit}
            />
          ))}
        </ul>
      )}
    </main>
  );
}
