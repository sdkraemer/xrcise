import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Workout, IWorkout, WorkoutType, StrengthTrainingWorkoutType, RunningWorkoutType } from './workout';
import { WorkoutService } from './workout.service';



//rxjs
import 'rxjs/add/operator/do'; 

@Component({
    selector: 'workout',
    templateUrl: 'workout.component.html'
})
export class WorkoutComponent implements OnInit {
    public form: FormGroup;

    public workout: IWorkout;
    
    //public workoutTypes =  WorkoutType;
    //public workoutType: WorkoutType;

    public workoutTypes = [
        { value: 'STRENGTH_TRAINING', display: 'Strength Training'},
        { value: 'RUNNING', display: 'Running'},
        { value: 'CYCLING', display: 'Cycling'}
    ];

    constructor(
        private formBuilder: FormBuilder,
        private workoutService: WorkoutService,
        private route: ActivatedRoute,
        private router: Router) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            _id: [''],
            name: ['', Validators.required],
            notes: [''],
            type: [''],
            createdAt: [''],
            completedAt: ['']
        });

        this.route
            .params
            .map(params => params['id'])
            //.do(id => this._id = id)
            .subscribe(id => this.getWorkout(id));
    }

    private getWorkout(_id) {
        if(_id == 'New'){
            this.form.patchValue({
                 _id: null,
                name: null,
                notes: null,
                type: [''],
                createdAt: [''],
                completedAt: ['']
            });
        }
        else{
            this.workoutService.getWorkout(_id)
                .subscribe((workout) => {
                    this.workout = workout;

                    this.form.patchValue({
                        _id: workout._id,
                        name: workout.name,
                        notes: workout.notes,
                        createdAt: workout.createdAt,
                        completedAt: workout.completedAt,
                        type: workout.workoutType.workoutType
                    });
                    //to test
                    //this.workout.workoutType = new RunningWorkoutType();
                    //this.setWorkoutType();
                });
        }
    }

    onDelete(form){
        console.log("deleting workout");
        this.workoutService.remove(form.value._id)
            .subscribe((isSuccessful: boolean) => {
                this.goToWorkouts();
            });
    }

    onComplete(form){
        console.log("onSubmit");
        form.value.completedAt = new Date();
        //this.onSubmit(form); TODO fix this
    }

    onSubmit(){
        console.log("onSubmit");
        var formData = this.form.value;
        let workout = new Workout({
            _id: formData._id,
            name: formData.name,
            notes: formData.notes,
            createdAt: formData.createdAt,
            completedAt: formData.completedAt
        });
        
        if(this.form.value.type == 'RUNNING'){
            workout.workoutType = new RunningWorkoutType({
                distance: formData.workoutType.distance
            });
        }
        else if(this.form.value.type == 'STRENGTH_TRAINING'){
            workout.workoutType = new StrengthTrainingWorkoutType({
                guide: formData.workoutType.guide
            });
        }

        if(workout._id){
            console.log("Saving an existing workout");
            this.workoutService.update(workout)
                .subscribe((isSuccessful: boolean) => {
                    this.goToWorkouts();
                });
        }
        else{
            console.log("Saving a new workout");
            this.workoutService.add(workout)
                .subscribe((isSuccessful: boolean) => {
                    this.goToWorkouts();
                });
        }
        this.goToWorkouts();
    }

    goToWorkouts() {
        this.router.navigate(['/workouts']);
    }
}