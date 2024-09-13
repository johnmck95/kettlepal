import React from "react";
import { useQuery, gql } from "@apollo/client";
import LoadingSpinner from "../Components/LoadingSpinner";
import { VStack, Flex, Text, Center } from "@chakra-ui/react";
import { UserWithWorkouts, WorkoutWithExercises } from "../Constants/types";
import ViewWorkout from "../Components/ViewWorkouts/ViewWorkout";
import { useUser } from "../Contexts/UserContext";

const WORKOUTS_WITH_EXERCISES_QUERY = gql`
  query UserWithWorkouts($uid: ID!) {
    user(uid: $uid) {
      firstName
      lastName
      workouts {
        uid
        comment
        elapsedSeconds
        createdAt
        exercises {
          uid
          title
          weight
          weightUnit
          sets
          reps
          repsDisplay
          comment
          elapsedSeconds
          createdAt
        }
      }
    }
  }
`;

export default function PastWorkouts() {
  const { user } = useUser();
  const { loading, error, data, refetch } = useQuery<UserWithWorkouts>(
    WORKOUTS_WITH_EXERCISES_QUERY,
    {
      variables: { uid: user?.uid },
      fetchPolicy: "cache-first",
    }
  );

  const noWorkouts = !data?.user?.workouts || data?.user?.workouts.length === 0;

  if (loading) {
    return (
      <Center w="100%" h="100%">
        <LoadingSpinner size={24} />;
      </Center>
    );
  }

  return (
    <Flex w="100%">
      {error && <Text>An Unexpected Error has occurred: {error?.message}</Text>}
      {!loading && !error && data && (
        <VStack w="100%" my="0.5rem">
          {data === null ? (
            <Text>No User Found</Text>
          ) : (
            <>
              {noWorkouts && <Text> Record your first workout!</Text>}
              {data?.user?.workouts?.map(
                (workoutWithExercises: WorkoutWithExercises) => (
                  <ViewWorkout
                    key={workoutWithExercises.uid}
                    workoutWithExercises={workoutWithExercises}
                    refetchPastWorkouts={refetch}
                  />
                )
              )}
            </>
          )}
        </VStack>
      )}
    </Flex>
  );
}
