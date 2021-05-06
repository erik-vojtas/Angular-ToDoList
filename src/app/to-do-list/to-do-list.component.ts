import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subject, Subscription} from 'rxjs';

@Component({
  selector: 'app-to-do-list',
  templateUrl: './to-do-list.component.html',
  styleUrls: ['./to-do-list.component.css']
})
export class ToDoListComponent implements OnInit, OnDestroy {
  tasks: string[] = [];
  taskForm: FormGroup;
  editMode = false;
  editTaskIndex: number;
  editTask: string;
  startedEditing = new Subject<number>();
  subscription: Subscription;
  tasksObject = [];

  constructor() {}


  ngOnInit(): void {
    this.taskForm = new FormGroup({
      task : new FormControl('', Validators.required)
    });
    this.subscription = this.startedEditing.subscribe(
      (index: number) => {
        this.editTaskIndex = index;
        this.editTask = this.getTask(index);
        this.editMode = true;
        this.taskForm.setValue({
          task: this.editTask,
        });
      }
    );
  }

  onSubmit() {
    console.log(this.taskForm);
    if (this.editMode) {
      this.updateTask(this.editTaskIndex);
    } else {
      this.tasksObject.push({
        task: this.taskForm.get('task').value,
        done: false,
        deleted: false
      });
    }
    this.editMode = false;
    this.taskForm.reset();
  }

  addTask() {
    // this.tasks.push();
    this.tasksObject.push({
      task: this.taskForm.get('task').value,
      done: false,
      deleted: false
    });
  }

  updateTask(index: number) {
    console.log('update', this.tasksObject[index]['index']);
    this.tasksObject[index]['task'] = this.taskForm.get('task').value;
  }

  onEditTask(index: number) {
    this.startedEditing.next(index);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getTask(index: number) {
    console.log('getTask', this.tasksObject[index]);
    return this.tasksObject[index]['task'];
  }

  onDeleteTask() {
    this.taskForm.patchValue({
      task: '',
      deleted: true
    });
    delete this.tasksObject[this.editTaskIndex];
    this.editMode = false;
  }

  onDone(index: number) {
    this.tasksObject[index]['done'] = !this.tasksObject[index]['done'];
  }


}
