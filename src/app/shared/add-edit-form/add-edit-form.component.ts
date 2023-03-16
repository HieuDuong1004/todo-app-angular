import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {  NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Subscription } from 'rxjs';
import { TodoCategory } from 'src/app/model/todo-caterory';
import { TodoItem } from 'src/app/model/todo-item';

@Component({
  selector: 'app-add-edit-form',
  templateUrl: './add-edit-form.component.html',
  styleUrls: ['./add-edit-form.component.css']
})
export class AddEditFormComponent implements OnInit {

  @Input() todoCategories!: any;
  @Input() openModal: Subject<TodoItem> = new Subject();
  @Output() onCompleteAction: EventEmitter<TodoItem> = new EventEmitter();
  @Output() isCategorySelected: EventEmitter<TodoCategory> = new EventEmitter();
  @ViewChild('editTodo') public editTodo!: TemplateRef<any>;
  
  public addEditForm: UntypedFormGroup;  
  private subscriptions: Subscription = new Subscription();

  constructor(private _modalService: NgbModal, fb: UntypedFormBuilder ) { 
    this.addEditForm = fb.group({
      label: ['', Validators.required ],
      description: ['', Validators.required ],
      category: ['', Validators.required]
   });
  }


  public ngOnInit(): void {        
    this.subscriptions.add(
      this.openModal // on modal open call
        .subscribe(v => {
          // opening the Add/Edit modal
          this._modalService.open(this.editTodo, { ariaLabelledBy: 'modal-basic-title' }).result.then( 
            (result) => { // on Submit action
              this.onCompleteAction.next(this.addEditForm.value);
            }
          );
        }));
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe(); // removing the add/edit modal on component unload
  }
}
