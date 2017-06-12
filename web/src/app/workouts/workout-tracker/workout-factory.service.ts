import { Injectable } from '@angular/core';

import { IWorkout, Workout, IRunningWorkout, RunningWorkout, IStrengthTrainingWorkout, StrengthTrainingWorkout, IWorkoutExercise, WorkoutExercise, ISet, Set, IRepetitionSet, RepetitionSet, IWeightsSet, WeightsSet } from '../workout-updated';
import { IGuide, IGuideExercise } from '../../guides/guide';

import { GuideService } from '../../guides/guide.service';

//rxjs
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map'; 
import 'rxjs/add/operator/catch';

@Injectable()
export class WorkoutFactoryService {

    constructor(
        private guideService: GuideService
    ) { }

    public createWorkout(workoutType, guideId: IGuide): Observable<IWorkout> {
        if(workoutType == "STRENGTH_TRAINING"){
            return this.createStrengthTrainingWorkout(guideId);
        }
        else if(workoutType == "RUNNING"){
            return this.createRunningWorkout();
        }
    }

    public createStrengthTrainingWorkout(guideId): Observable<IStrengthTrainingWorkout> {
        let workout: IStrengthTrainingWorkout;

       return this.guideService.getGuide(guideId).map((guide) => {
           return new StrengthTrainingWorkout({
               _id: null,
               guide: guide._id,
               name: guide.name,
               exercises: this.createExercisesFromGuide(guide)
           });
       });
        
    }

    public createRunningWorkout(): Observable<IRunningWorkout> {
        return Observable.create(observer => {
            observer.onNext(new RunningWorkout({
                _id: null
            }));
        });
    }

    private createExercisesFromGuide(guide: IGuide){
        let workoutExercises: IWorkoutExercise[] = [];
        guide.exercises.forEach(function(exercise: IGuideExercise){
            let workoutExercise = new WorkoutExercise({
                name: exercise.name,
                guideExercise: exercise._id,
                sets: [],
                type: exercise.type
            });

            //'REPS', 'WEIGHTS'
            if(exercise.type == 'REPS' || exercise.type == 'WEIGHTS'){
                if(exercise.sided){
                    workoutExercise.sets.push(this.createSet(exercise.type, 'RIGHT'));
                    workoutExercise.sets.push(this.createSet(exercise.type, 'LEFT'));
                }
                else{
                    workoutExercise.sets.push(this.createSet(exercise.type));
                }
            }

            workoutExercises.push(workoutExercise);
        }, this);

        return workoutExercises;
    }

    private createSet(type: string, side: string = 'NONE'){
        let set: ISet = null;
        if(type == 'REPS') {
            set = new RepetitionSet({
                //repetitions: 0,
                side: side
            });
        }
        else if (type = 'WEIGHTS') {
            set = new WeightsSet({
                //repetitions: 0,
                //weight: 0,
                side: side,
                adjustWeight: 'NONE'
            });
        }

        return set;
    }
}