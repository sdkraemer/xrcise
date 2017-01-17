export interface IWorkout {
    _id: string;
    type?: string;
    name?: string;
    notes?: string;
    createdAt?: Date;
    isCompleted?: boolean;
    completedAt?: Date;
}

export interface IRunningWorkout extends IWorkout{
    distance?: number;
}

export interface IStrengthTrainingWorkout extends IWorkout {
    guide?: string;
    exercises?: IWorkoutExercise[];
}

export class Workout implements IWorkout{
  _id: string;
  type: string;
  name: string;
  notes: string;
  createdAt: Date;
  isCompleted: boolean;
  completedAt: Date;

  constructor(options: IWorkout){
    this._id = options._id;
    this.name = options.name;
    this.notes = options.notes;
    this.createdAt = options.createdAt;
    this.isCompleted = options.isCompleted;
    this.completedAt = options.completedAt;
  }
}

export class StrengthTrainingWorkout extends Workout implements IStrengthTrainingWorkout {
    guide: string;
    exercises: IWorkoutExercise[];

    constructor(options: IStrengthTrainingWorkout){
        super(options);
        this.type = "STRENGTH_TRAINING";
        this.guide = options.guide;
        this.exercises = options.exercises;
    }
}

export class RunningWorkout extends Workout implements IRunningWorkout {
    distance?: number;
    constructor(options: IRunningWorkout) {
        super(options);
        this.type = "RUNNING";
        this.distance = options.distance;
    }
}

// export enum WorkoutType {
//   STRENGTH_TRAINING,
//   RUNNING,
//   CYCLING
// }





export interface ISet {
  repetitions: number;
  side: string;
}

export interface IRepetitionSet extends ISet {

}

export interface IWeightsSet extends ISet {
  weight: number;
}

export class Set implements ISet {
  repetitions: number;
  side: string;
  
  constructor(options: ISet) {
    this.repetitions = options.repetitions;
    this.side = options.side;
  }
}

export class RepetitionSet extends Set implements IRepetitionSet {
  constructor(options: IRepetitionSet) {
    super(options);
  }
}

export class WeightsSet extends Set implements IWeightsSet {
  weight: number;
  constructor(options: IWeightsSet) {
    super(options);
    this.weight = options.weight;
  }
}

export interface IWorkoutExercise {
  name: string;
  guideExercise: string;
  sets: ISet[];
  type: string;
}

export class WorkoutExercise implements IWorkoutExercise {
  name: string;
  guideExercise: string;
  sets: ISet[];
  type: string;

  constructor(options: IWorkoutExercise){
    this.name = options.name;
    this.guideExercise = options.guideExercise;
    this.sets = options.sets;
    this.type = options.type;
  }
}