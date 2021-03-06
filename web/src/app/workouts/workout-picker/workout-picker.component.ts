import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, Validators, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "workout-picker",
  templateUrl: "workout-picker.component.html",
  styles: [
    `
    `
  ]
})
export class WorkoutPickerComponent implements OnInit {
  public form: FormGroup;

  public workoutTypes = [
    { value: "STRENGTH_TRAINING", display: "Strength Training" },
    { value: "RUNNING", display: "Running" },
    { value: "CYCLING", display: "Cycling" }
  ];

  constructor(private formBuilder: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      workoutType: [""],
      guide: [""]
    });
  }

  startWorkout() {
    var routingParameters = {
      workoutType: this.form.value.workoutType
    };
    if (routingParameters.workoutType == "STRENGTH_TRAINING") {
      routingParameters["guide"] = this.form.value.guide;
    }
    this.router.navigate(["/workout-tracker", routingParameters]);
  }
}
