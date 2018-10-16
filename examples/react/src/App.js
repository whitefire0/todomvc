import React, { Component } from 'react';

import TodoFooter from './Footer';
import TodoItem from './TodoItem';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from './utils';

const ENTER_KEY = 13;

class App extends Component {
	constructor(props) {
		super(props);
		this.state = { nowShowing: ALL_TODOS, editing: null, newTodo: '' };

		this.toggle = this.toggle.bind(this);
		this.destroy = this.destroy.bind(this);
		this.edit = this.edit.bind(this);
		this.save = this.save.bind(this);
		this.cancel = this.cancel.bind(this);
		this.clearCompleted = this.clearCompleted.bind(this);
		this.toggleAll = this.toggleAll.bind(this);
		this.handleNewTodoKeyDown = this.handleNewTodoKeyDown.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
		this.setState({ newTodo: event.target.value });
	}

	handleNewTodoKeyDown(event) {
		if (event.keyCode !== ENTER_KEY) {
			return;
		}

		event.preventDefault();

		const val = this.state.newTodo.trim();

		if (val) {
			this.props.model.addTodo(val);
			this.setState({ newTodo: '' });
		}
	}

	toggleAll(event) {
		const checked = event.target.checked;
		this.props.model.toggleAll(checked);
	}

	toggle(todoToToggle) {
		this.props.model.toggle(todoToToggle);
	}

	destroy(todo) {
		this.props.model.destroy(todo);
	}

	edit(todo) {
		this.setState({ editing: todo.id });
	}

	save(todoToSave, text) {
		this.props.model.save(todoToSave, text);
		this.setState({ editing: null });
	}

	cancel() {
		this.setState({ editing: null });
	}

	clearCompleted() {
		this.props.model.clearCompleted();
	}

	render() {
		let footer;
		let main;
		let todos = this.props.model.todos;

		let shownTodos = todos.filter((todo) => {
			switch (this.state.nowShowing) {
				case ACTIVE_TODOS:
					return !todo.completed;
				case COMPLETED_TODOS:
					return todo.completed;
				default:
					return true;
			}
		}, this);

		const todoItems = shownTodos.map((todo) => {
			return (
				<TodoItem
					key={todo.id}
					todo={todo}
					onToggle={(...args) => this.toggle(todo, ...args)}
					onDestroy={(...args) => this.destroy(todo, ...args)}
					onEdit={(...args) => this.edit(todo, ...args)}
					editing={this.state.editing === todo.id}
					onSave={(...args) => this.save(todo, ...args)}
					onCancel={this.cancel}
				/>
			);
		}, this);

		const activeTodoCount = todos.reduce((accum, todo) => {
			return todo.completed ? accum : accum + 1;
		}, 0);

		const completedCount = todos.length - activeTodoCount;

		if (activeTodoCount || completedCount) {
			footer = (
				<TodoFooter
					count={activeTodoCount}
					completedCount={completedCount}
					nowShowing={this.state.nowShowing}
					onClearCompleted={this.clearCompleted}
				/>
			);
		}

		if (todos.length) {
			main = (
				<section className="main">
					<input
						className="toggle-all"
						type="checkbox"
						onChange={this.toggleAll}
						checked={activeTodoCount === 0}
					/>
					<ul className="todo-list">{todoItems}</ul>
				</section>
			);
		}

		return (
			<div>
				<header className="header">
					<h1>todos</h1>
					<input
						className="new-todo"
						placeholder="What needs to be done?"
						value={this.state.newTodo}
						onKeyDown={this.handleNewTodoKeyDown}
						onChange={this.handleChange}
						autoFocus={true}
					/>
				</header>
				{main}
				{footer}
			</div>
		);
	}
}

export default App;
