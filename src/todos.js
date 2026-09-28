const STATUS_FILTERS = new Map([
  ['all', () => true],
  ['open', (item) => !item.done],
  ['done', (item) => item.done],
]);

export function createTodoList() {
  const items = [];
  let nextId = 1;

  return {
    add(title) {
      const text = String(title ?? '').trim();
      if (!text) throw new Error('Title is required');
      const todo = { id: nextId++, title: text, done: false };
      items.push(todo);
      return { ...todo };
    },

    complete(id) {
      const todo = items.find((item) => item.id === id);
      if (!todo) throw new Error(`Todo ${id} not found`);
      todo.done = true;
      return { ...todo };
    },

    remove(id) {
      const index = items.findIndex((item) => item.id === id);
      if (index === -1) throw new Error(`Todo ${id} not found`);
      const [removed] = items.splice(index, 1);
      return { ...removed };
    },

    list({ status = 'all' } = {}) {
      const filter = STATUS_FILTERS.get(status);
      if (!filter) throw new Error(`Unknown status: ${String(status)}`);
      return items.filter(filter).map((item) => ({ ...item }));
    },

    summary() {
      const done = items.filter((item) => item.done).length;
      return { total: items.length, open: items.length - done, done };
    },
  };
}
