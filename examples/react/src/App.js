import React, { Component } from 'react';

import TodoFooter from './Footer';
import TodoItem from './TodoItem';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from './utils';

const ENTER_KEY = 13;

class App extends Component {
	constructor(props) {
		super(props);
		this.state = { nowShowing: ALL_TODOS, editing: null, newTodo: '' };
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
					onToggle={this.toggle.bind(this, todo)}
					onDestroy={this.destroy.bind(this, todo)}
					onEdit={this.edit.bind(this, todo)}
					editing={this.state.editing === todo.id}
					onSave={this.save.bind(this, todo)}
					onCancel={this.cancel.bind(this)}
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
					onClearCompleted={this.clearCompleted.bind(this)}
				/>
			);
		}

		if (todos.length) {
			main = (
				<section className="main">
					<input
						className="toggle-all"
						type="checkbox"
						onChange={this.toggleAll.bind(this)}
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
						onKeyDown={this.handleNewTodoKeyDown.bind(this)}
						onChange={this.handleChange.bind(this)}
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
