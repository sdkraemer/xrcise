var WorkoutModels = require("../models/workout"),
  Workout = WorkoutModels.Workout,
  StrengthTrainingWorkout = WorkoutModels.StrengthTrainingWorkout,
  Guide = require("../models/guide"),
  RunningWorkout = WorkoutModels.RunningWorkout,
  mongoose = require("mongoose"),
  ObjectId = mongoose.Types.ObjectId;

module.exports = function(app) {
  app.get("/api/workouts", function(req, res) {
    var conditions = {
      createdBy: ObjectId(req.userId)
    };
    //Simple date searching to start
    if (req.params.start && req.params.end) {
      conditions["completedAt"] = {
        $gte: new Date(req.params.start),
        $lte: new Date(req.params.end)
      };
    }

    var workoutPromise = Workout.find(conditions)
      .limit(60) //change this for later. Maybe different endpoints for calendar workouts vs workouts tab
      .sort({ createdAt: "desc" })
      .exec();
    workoutPromise
      .then(function(workouts) {
        res.json(workouts);
      })
      .catch(function(error) {
        console.log("Could not find workouts. Error: %s", error);
      });
  });

  app.get("/api/workouts/:id", function(req, res) {
    var queryParameters = {
      _id: req.params.id,
      createdBy: ObjectId(req.userId)
    };
    var workoutPromise = Workout.findOne(queryParameters).exec();
    workoutPromise
      .then(function(workout) {
        if (!workout.isCompleted && workout.guide) {
          StrengthTrainingWorkout.find({
            createdBy: ObjectId(req.userId),
            isCompleted: true
          })
            .where("guide")
            .equals(ObjectId(workout.guide))
            .limit(2)
            .sort({ completedAt: "desc" })
            .exec(function(err, previousWorkouts) {
              if (err) {
                console.log("Could not find previous workouts: %s", err);
                res.sendStatus(404);
              }
              console.log("previous workouts length" + previousWorkouts.length);
              workout.previousWorkouts = previousWorkouts;
              res.json(workout);
            });
        } else {
          res.json(workout);
        }
      })
      .catch(function(err) {
        console.log(
          "Error finding workout. Workout ID: %s, User ID: %s",
          req.params.id,
          req.userId
        );
        res.json({});
      });
  });

  app.get("/api/workouts/previous/:guideid", function(req, res) {
    var guideId = req.params.guideid;
    StrengthTrainingWorkout.find({
      createdBy: ObjectId(req.userId),
      isCompleted: true
    })
      .where("guide")
      .equals(ObjectId(guideId))
      .limit(2)
      .sort({ completedAt: "desc" })
      .exec(function(err, workouts) {
        if (err) {
          console.log("Could not find previous workouts: %s", err);
          res.sendStatus(404);
        }
        res.json(workouts);
      });
  });

  app.post("/api/workouts", function(req, res) {
    var json = req.body;

    if (json.type == "RUNNING") {
      console.log("Running workout");
      var workout = new RunningWorkout({
        type: "RUNNING",
        name: "Running Workout",
        notes: json.notes,
        createdBy: ObjectId(req.userId),
        isCompleted: json.isCompleted,
        completedAt: json.completedAt,
        distance: json.distance,
        elapsed_time: json.elapsed_time,
        heartrate: json.heartrate,
        calories: json.calories,
        createdAt: new Date()
      });

      if (!json.createdAt) {
        workout.createdAt = new Date();
      } else {
        //handle date string here
      }

      if (json.isCompleted) {
        workout.completedAt = new Date();
      }

      workout.save(function(err, workout) {
        if (err) {
          console.log("Error inserting new workout: " + err);
        }
        res.json(req.body);
      });
    } else if (json.type == "STRENGTH_TRAINING") {
      console.log("Strength Training workout");
      Guide.findOne({ _id: ObjectId(json.guide) }, function(err, guide) {
        var workout = new StrengthTrainingWorkout({
          type: "STRENGTH_TRAINING",
          name: guide.name,
          notes: json.notes,
          createdBy: ObjectId(req.userId),
          isCompleted: json.isCompleted,
          guide: ObjectId(json.guide),
          exercises: json.exercises,
          calories: json.calories,
          createdAt: new Date()
        });

        if (!json.createdAt) {
          workout.createdAt = new Date();
        } else {
          //handle date string here
        }

        if (json.isCompleted) {
          workout.completedAt = new Date();
        }

        workout.save(function(err, workout) {
          if (err) {
            console.log("Error inserting new workout: " + err);
          }
          res.json(req.body);
        });
      });
    }
  });

  app.put("/api/workouts/:id", function(req, res) {
    Workout.findOne(
      { _id: req.params.id, createdBy: ObjectId(req.userId) },
      {},
      function(err, workout) {
        if (err) {
          console.error("Error finding workout" + err);
          res.json({ status: false });
          return;
        }
        var json = req.body;

        workout.name = json.name;
        workout.notes = json.notes;
        workout.createdBy = workout.createdBy;
        workout.calories = json.calories;
        var isWorkoutNewlyCompleted = json.isCompleted && !workout.isCompleted;
        var isCompletedAtBeingUpdated = json.completedAt;
        if (isWorkoutNewlyCompleted || isCompletedAtBeingUpdated) {
          workout.completedAt = json.completedAt
            ? json.completedAt
            : new Date();
        }
        workout.isCompleted = json.isCompleted;
        if (json.createdAt) {
          workout.createdAt = json.createdAt;
        }

        if (json.type == "RUNNING") {
          workout.distance = json.distance;
          workout.elapsed_time = json.elapsed_time;
          workout.heartrate = json.heartrate;
        } else if (json.type == "STRENGTH_TRAINING") {
          workout.guide = json.guide;
          workout.exercises = json.exercises; //just replace the whole thing.
        }

        workout.save(function(error, workout) {
          if (error) {
            console.log("Error updating workout. " + error);
            res.json({ status: false });
            return;
          }
        });
      }
    );
    res.json({ status: true });
  });

  app.patch("/api/workout/:id", function(req, res) {
    Workout.findOne(
      { _id: req.params.id, createdBy: ObjectId(req.userId) },
      {},
      function(err, workout) {
        if (err) {
          console.error("Error finding workout" + err);
          res.json({ status: false });
          return;
        }
        var json = req.body;
        if (json.createdAt) {
          workout.createdAt = json.createdAt;
        }
        if (json.completedAt) {
          workout.completedAt = json.completedAt;
        }
        workout.save(function(error, workout) {
          if (error) {
            console.log("Error updating workout. " + error);
            res.json({ status: false });
            return;
          }
        });
      }
    );
    res.json({ status: true });
  });

  app.delete("/api/workouts/:id", function(req, res) {
    Workout.remove(
      { _id: req.params.id, createdBy: ObjectId(req.userId) },
      function(err) {
        if (err) {
          console.log("Error occurred removing workout: %s", err);
          res.sendStatus(404);
        }
        res.sendStatus(200);
      }
    );
  });
};
