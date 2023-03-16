import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { TodoCategory } from 'src/app/model/todo-caterory';
import { TodoItem } from 'src/app/model/todo-item';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css']
})
export class TodoItemComponent implements OnInit {


  @Input() todoItem!: TodoItem;
  @Input() todoCategories!: TodoItem;
  // @Input() todoCategories!: any;
  @Output() deleteTodoItem: EventEmitter<number> = new EventEmitter();
  @Output() editTodoItem: EventEmitter<TodoItem> = new EventEmitter();

  public editSelectedTodo!: TodoItem;
  public openAddEditModal: Subject<TodoItem> = new Subject();

  constructor(private _modalService: NgbModal) { }

  ngOnInit(): void {
  }

  public isCategorySelected(todoCategory : TodoCategory): any {
    return todoCategory && todoCategory === this.editSelectedTodo.category; // checks if the current category is selected
  }

  public openEditTodoModal(todoItem: TodoItem): void {
    this.editSelectedTodo = JSON.parse(JSON.stringify(todoItem)); // sending the deep copy to edit modal to not see dynamic updates on UI
    this.openAddEditModal.next(this.todoItem); // open edit modal and fill the values
    console.log('item editsselec',this.todoItem)
    console.log('item todp', todoItem)
  }

  public openDeleteTodoModal(content: any, todoId: number): void {
    this._modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then( // open confirmation for "delete" todo
        () => this.deleteTodoItem.next(todoId)// calling the callback which actually should perform the removal
      )
      console.log(todoId) ;
  }

  public openResetCompleteTodoModal(content: any, todoItem: TodoItem): void {
    this._modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result
      .then(
        () => {
          let updatedTodoItem = JSON.parse(JSON.stringify(todoItem)); // creating the deep copy for the todo item to not harm the existing one
          updatedTodoItem.isCompleted = false;
          this.editTodoItem.next(updatedTodoItem); // call the edit todo performer callback 
        }
      );

  }

  public openCompleteTodoModal(content: any, todoItem: TodoItem): void {
    this._modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result
      .then(
        () => {
          let updatedTodoItem = JSON.parse(JSON.stringify(todoItem)); // creating the deep copy for the todo item to not harm the existing one
          updatedTodoItem.isCompleted = true;
          this.editTodoItem.next(updatedTodoItem); // call the edit todo performer callback 
        }
      );
  }
}
