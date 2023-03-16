import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, debounceTime, Subject, takeUntil } from 'rxjs';
import { TodoCategory } from '../model/todo-caterory';
import { TodoItem } from '../model/todo-item';
import { TodoService } from './service/todo.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {

  public todos$!: TodoItem[]; // async list of Todo items
  public todoCategories!: any; // todo item categories 
  public filterValue!:string;

  public newTodo: TodoItem = new TodoItem(0, '', '', 1, false); // just an empty todo for add modal
  public openAddEditModal: Subject<TodoItem> = new Subject(); // the caller for add/edit modal
  public onAddEditComplete: Subject<void> = new Subject(); // the ajax complete result callback

  public get todos(): Readonly<TodoItem[]> {
    return this._todoList;
  }
 
  private _todoList: TodoItem[] = [];  // all todo items
 
  private _getTodoListDestroyed$: Subject<TodoItem[]> = new Subject();
  private _deleteTodoItemDestroyed$: Subject<any> = new Subject();
  private _addTodoItemDestroyed$: Subject<TodoItem> = new Subject();
  private _editTodoItemDestroyed$: Subject<TodoItem> = new Subject();

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    this.getTodoList();
  }
  public getTodoList(): void {
    this.todoService.getTodoList()
      .pipe(takeUntil(this._getTodoListDestroyed$))
      .subscribe(todos => {
        this._todoList = todos;
        console.log("list todo",this._todoList)
        this.todoCategories = [... new Set(this._todoList.map(t => t.category))]; // making the taken categories unique
      });  
  }

  public isCategorySelected(todoCategory: any): boolean {
    return todoCategory && todoCategory === this.newTodo.category;
  }

  public openAddModal(): void {
    this.newTodo.label = '';
    this.newTodo.description = ''; // reset the add modal data from the last opening values
    this.newTodo.category = 1;
    this.openAddEditModal.next(this.newTodo);
  }

  public addTodoItem(todoItem: TodoItem): void {
    const todoNewId = Math.max(...this._todoList.map(o => o.id)) + 1; // make sure not have duplicated index for new item
    todoItem.id = todoNewId;

    this.todoService.addTodoItem(todoItem)
      .pipe(takeUntil(this._addTodoItemDestroyed$))
      .subscribe(() => {
        this._todoList.push(new TodoItem(
          todoNewId,
          todoItem.label,
          todoItem.description,
          todoItem.category,
          todoItem.isCompleted));
      });
  }

  public editTodoItem(todoItem: TodoItem): void {
    console.log('idtodo list',todoItem.id)
    this.todoService.editTodoItem(todoItem)
      .pipe(takeUntil(this._editTodoItemDestroyed$))
      .subscribe(() => { // TODO: read the last todo value from service call
        let updatedTodoItem = this._todoList.find(t => t.id === todoItem.id); // find the updated todo item
        console.log(todoItem.id)
        if (updatedTodoItem) {
          updatedTodoItem.category = todoItem.category;
          updatedTodoItem.description = todoItem.description;
          updatedTodoItem.label = todoItem.label;
          updatedTodoItem.isCompleted = todoItem.isCompleted;
        }
      });
  }

  public deleteTodoItem(todoId: number): void {
    this.todoService
      .deleteTodoItem(todoId)
      .pipe(takeUntil(this._deleteTodoItemDestroyed$))
      .subscribe(() => {
        const index = this._todoList.findIndex(t => t.id === todoId);

        if (index !== -1) {;
          this._todoList.splice(index, 1); // hard remove the todo item
        }
      });
  }
  public resetFilter(): void {
    this.filterValue = '';
  }


}
