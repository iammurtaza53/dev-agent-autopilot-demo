import test from 'node:test';
import assert from 'node:assert/strict';
import { createTodoList } from '../src/todos.js';

test('add trims the title and starts open', () => {
  const todos = createTodoList();
  assert.deepEqual(todos.add('  Buy milk '), { id: 1, title: 'Buy milk', done: false });
});

test('add rejects an empty title', () => {
  assert.throws(() => createTodoList().add('   '), /Title is required/);
});

test('complete marks a todo as done', () => {
  const todos = createTodoList();
  const { id } = todos.add('Write tests');
  assert.equal(todos.complete(id).done, true);
  assert.equal(todos.list()[0].done, true);
});

test('complete rejects an unknown id', () => {
  assert.throws(() => createTodoList().complete(42), /Todo 42 not found/);
});

test('list returns copies, not the internal items', () => {
  const todos = createTodoList();
  todos.add('Read docs');
  todos.list()[0].title = 'changed';
  assert.equal(todos.list()[0].title, 'Read docs');
});

function seededList() {
  const todos = createTodoList();
  todos.add('Buy milk');
  todos.add('Write tests');
  todos.add('Read docs');
  todos.complete(2);
  return todos;
}

const ALL = [
  { id: 1, title: 'Buy milk', done: false },
  { id: 2, title: 'Write tests', done: true },
  { id: 3, title: 'Read docs', done: false },
];

test('list with no argument returns every todo', () => {
  assert.deepEqual(seededList().list(), ALL);
});

test('list filters by status all, open and done', () => {
  const todos = seededList();
  assert.deepEqual(todos.list({ status: 'all' }), ALL);
  assert.deepEqual(todos.list({ status: 'open' }), [ALL[0], ALL[2]]);
  assert.deepEqual(todos.list({ status: 'done' }), [ALL[1]]);
});

test('list defaults to all when status is omitted', () => {
  assert.deepEqual(seededList().list({}), ALL);
});

test('list rejects an unknown status', () => {
  const todos = seededList();
  assert.throws(() => todos.list({ status: 'archived' }), { message: 'Unknown status: archived' });
  assert.throws(() => todos.list({ status: 'toString' }), { message: 'Unknown status: toString' });
});

test('filtered list returns copies, not the internal items', () => {
  const todos = seededList();
  todos.list({ status: 'done' })[0].title = 'changed';
  assert.equal(todos.list({ status: 'done' })[0].title, 'Write tests');
});

test('remove deletes a todo and returns the removed item', () => {
  const todos = seededList();
  assert.deepEqual(todos.remove(2), ALL[1]);
  assert.deepEqual(todos.list(), [ALL[0], ALL[2]]);
});

test('remove rejects an unknown id', () => {
  assert.throws(() => createTodoList().remove(42), /Todo 42 not found/);
});

test('remove matches ids strictly', () => {
  const todos = seededList();
  assert.throws(() => todos.remove('1'), /Todo 1 not found/);
  assert.equal(todos.list().length, 3);
});

test('remove rejects an id that was already removed', () => {
  const todos = seededList();
  todos.remove(1);
  assert.throws(() => todos.remove(1), /Todo 1 not found/);
});

test('ids are not reused after remove', () => {
  const todos = seededList();
  todos.remove(3);
  assert.equal(todos.add('New task').id, 4);
});

test('summary counts an empty list', () => {
  assert.deepEqual(createTodoList().summary(), { total: 0, open: 0, done: 0 });
});

test('summary counts open and done todos', () => {
  assert.deepEqual(seededList().summary(), { total: 3, open: 2, done: 1 });
});

test('summary reflects completions and removals', () => {
  const todos = seededList();
  todos.complete(1);
  assert.deepEqual(todos.summary(), { total: 3, open: 1, done: 2 });
  todos.remove(2);
  assert.deepEqual(todos.summary(), { total: 2, open: 1, done: 1 });
});
