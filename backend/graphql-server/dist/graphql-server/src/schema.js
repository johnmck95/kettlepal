/** GQL Primitive Types: id, int, float, string, boolean */
const typeDefs = `#graphql
    type User {
        uid: ID!
        first_name: String!
        last_name: String!
        email: String!
        password: String!
        is_authorized: Boolean!
        workouts: [Workout!]
        created_at: Int! 
    }

    type Workout {
        uid: ID!
        start_time: String!
        end_time: String!
        comment: String
        user_uid: ID!
        exercises: [Exercise!]
    }

    type Exercise {
        uid: ID!
        workout_uid: ID!
        title: String!
        weight: Float
        weight_unit: String
        sets: Int
        reps: Int
        reps_display: String
        comment: String
        start_time: String
        end_time: String
    }

    # Required: Defines the entry points to the graph
    type Query {
        users: [User]
        user(uid: ID!): User
        workouts: [Workout]
        workout(uid: ID!): Workout
        exercises: [Exercise]
        exercise(uid: ID!): Exercise
    }


    type Mutation {
        deleteUser(uid: ID!): [User]!
        deleteWorkout(uid: ID!): [Workout]!
        deleteExercise(uid: ID!): [Exercise]!

        addUser(user: AddUserInput!): User 
        addExercise(workout_uid: ID!, exercise: AddExerciseInput!): Exercise
        addWorkout(user_uid: ID!, workout: AddOrEditWorkoutInput!): Workout

        updateUser(uid: ID!, edits: EditUserInput!): User
        updateWorkout(uid: ID!, edits: AddOrEditWorkoutInput!): Workout
        updateExercise(uid: ID!, edits: EditExerciseInput!): Exercise

    }   
    
    # Input types omit data fields we want the system to generate (like uids)
    # Edits often vary from inputs, because we don't want to require all fields
    input AddUserInput {
        first_name: String!
        last_name: String!
        email: String!
        password: String!
    }
    input EditUserInput {
        first_name: String
        last_name: String
        email: String
        password: String
    }

    input AddOrEditWorkoutInput {
        start_time: String
        end_time: String
        comment: String
    }

    input AddExerciseInput {
        title: String!
        weight: Float
        weight_unit: String
        sets: Int
        reps: Int
        reps_display: String
        comment: String
        start_time: String
        end_time: String
    }
    input EditExerciseInput {
        title: String
        weight: Float
        weight_unit: String
        sets: Int
        reps: Int
        reps_display: String
        comment: String
        start_time: String
        end_time: String
    }


`;
export default typeDefs;
