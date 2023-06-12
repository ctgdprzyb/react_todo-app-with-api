import cn from 'classnames';
import { useContext } from 'react';
import { Todo } from '../types/Todo';
import { deleteTodo } from '../api/todos';
import { SetErrorContext } from '../utils/setErrorContext';
import { ErrorMessage } from '../utils/ErrorMessage';

interface Props {
  setFilteringMode: (arg0: string) => void,
  filteringMode: string;
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setTodosToBeEdited: React.Dispatch<React.SetStateAction<number[] | null>>,
}

export const TodoFooter: React.FC<Props>
  = ({
    setFilteringMode, filteringMode, todos, setTodosToBeEdited, setTodos,
  }) => {
    const setError = useContext(SetErrorContext);

    const handleMassDeletion = () => {
      const completedTodos = todos.filter(todo => todo.completed);

      setTodosToBeEdited(completedTodos.map(todo => todo.id));

      Promise.all(completedTodos.map((todo) => {
        return new Promise((resolve) => deleteTodo(todo.id)
          .then(resolve))
          .catch(() => {
            setTodosToBeEdited([]);
            setError?.(ErrorMessage.CantDelete);
          });
      }))
        .then(() => {
          setTodosToBeEdited([]);
          setTodos(todos.filter(todo => !todo.completed));
        });
    };

    return (
      <footer className="todoapp__footer">
        <span className="todo-count">
          {todos.filter(todo => !todo.completed).length}
          {' '}
          items left
        </span>

        {/* Active filter should have a 'selected' class */}
        <nav className="filter">
          <a
            href="#/"
            className={cn({
              filter__link: true,
              selected: filteringMode === 'all',
            })}
            onClick={() => setFilteringMode('all')}
          >
            All
          </a>

          <a
            href="#/active"
            className={cn({
              filter__link: true,
              selected: filteringMode === 'active',
            })}
            onClick={() => setFilteringMode('active')}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={cn({
              filter__link: true,
              selected: filteringMode === 'completed',
            })}
            onClick={() => setFilteringMode('completed')}
          >
            Completed
          </a>
        </nav>

        {/* don't show this button if there are no completed todos */}
        <button
          type="button"
          className={cn({
            'todoapp__clear-completed': true,
            'todoapp__clear-completed__hidden':
              !todos.find(todo => todo.completed),
          })}
          onClick={handleMassDeletion}
        >
          Clear completed
        </button>
      </footer>
    );
  };
