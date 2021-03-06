import { Component, OnInit, Input } from "@angular/core";
import {
  ISet,
  IStrengthTrainingWorkout,
  IWorkoutExercise,
  IPreviousSet
} from "app/core";
import { FormGroup } from "@angular/forms";
import { controlNameBinding } from "@angular/forms/src/directives/reactive_directives/form_control_name";

@Component({
  selector: "app-reps-weights-set",
  templateUrl: "./reps-weights-set.component.html",
  styleUrls: ["./reps-weights-set.component.scss"],
  styles: [
    `
      ::ng-deep .mat-form-field .mat-form-field-infix {
        width: auto;
      }

      ::ng-deep .mat-form-field .mat-form-field-prefix button {
        min-width: 0px !important;
      }

      ::ng-deep .mat-form-field .mat-form-field-suffix button {
        min-width: 0px !important;
      }

      .previous-set-adjust-weight > .fa-arrow-down {
        color: #a83232;
      }

      .previous-set-adjust-weight > .fa-arrow-up {
        color: #1d831d;
      }
    `
  ]
})
export class RepsWeightsSetComponent implements OnInit {
  @Input("set") public set: ISet;

  @Input("formGroup") public formGroup: FormGroup;

  @Input("workout") public workout: IStrengthTrainingWorkout;

  @Input("exercise") public exercise: IWorkoutExercise;

  @Input("previousSets") public previousSets: IPreviousSet[] = [];

  constructor() {}

  ngOnInit() {}

  copyRepititions(pastRepititions) {
    this.formGroup.controls["repetitions"].setValue(pastRepititions);
  }

  copyWeight(pastWeight) {
    this.formGroup.controls["weight"].setValue(pastWeight);
  }

  adjustWeightChange(event) {
    this.formGroup.controls.adjustWeight.patchValue(event);
  }

  showPreviousWorkouts() {
    return !this.workout.isCompleted && this.previousSets.length > 0;
  }
}
