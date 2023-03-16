import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { TodoItem } from 'src/app/model/todo-item';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private todoBaseUrl = `http://localhost:3004/tasks`;  // URL to todo api   



  constructor(private http: HttpClient) { }

    
  public getTodoList(): Observable<TodoItem[]> {
    return this.http.get<TodoItem[]>(this.todoBaseUrl)
    
  }

  public addTodoItem(todoItem: TodoItem): Observable<TodoItem> {
    return this.http
      .post<TodoItem>(`${this.todoBaseUrl}`, {
        id: todoItem.id,
        label: todoItem.label,
        description: todoItem.description,
        category: todoItem.category,
        isCompleted: todoItem.isCompleted
      })
   
  }

  public editTodoItem(todoItem: TodoItem): Observable<TodoItem> {
    return this.http
      .patch<TodoItem>(`${this.todoBaseUrl}/${todoItem.id}`
      , {
        id: todoItem.id,
        label: todoItem.label,
        description: todoItem.description,
        category: todoItem.category,
        isCompleted: todoItem.isCompleted
      })
  }


  public deleteTodoItem(todoId: number): any {
    return this.http
      .delete<TodoItem>(`${this.todoBaseUrl}/${todoId}`)
  }

}
