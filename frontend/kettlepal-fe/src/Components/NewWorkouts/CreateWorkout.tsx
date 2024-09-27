import React from "react";
import CreateExercise from "./CreateExercise";
import { AnimatePresence, motion } from "framer-motion";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Center,
  CloseButton,
  Flex,
  HStack,
  Text,
} from "@chakra-ui/react";
import { FaPlusCircle, FaSave } from "react-icons/fa";
import ConfirmModal from "../ConfirmModal";
import LoadingSpinner from "../LoadingSpinner";
import theme from "../../Constants/theme";
import { formatExerciseString } from "../../utils/Exercises/exercises";
import dayjs from "dayjs";
import WorkoutDate from "./FormComponents.tsx/Workout/WorkoutDate";
import WorkoutComment from "./FormComponents.tsx/Workout/WorkoutComment";
import WorkoutTimer from "./FormComponents.tsx/Workout/WorkoutTimer";
import useCreateWorkoutForm from "../../Hooks/useCreateWorkoutForm";

export default function CreateWorkout() {
  const {
    state,
    loading,
    error,
    showTracking,
    addWorkoutComment,
    showUploadSuccess,
    submitted,
    errors,
    showServerError,
    timerIsActive,
    isOpenSaveWorkout,
    setTime,
    setComment,
    setShowServerError,
    setAddWorkoutComment,
    setShowTracking,
    handleTimerIsActive,
    handleStateChange,
    handleAddExercise,
    handleExercise,
    deleteExercise,
    onOpenSaveWorkout,
    onCloseSaveWorkout,
    onSaveWorkout,
  } = useCreateWorkoutForm();

  if (loading) {
    return (
      <Center>
        <LoadingSpinner />
      </Center>
    );
  }

  return (
    <Box m={["0.5rem 1rem 1rem 1rem", "1rem"]} w={["100%", "100%", "720px"]}>
      <HStack
        justifyContent={"space-between"}
        mb="0.75rem"
        h={["90px", "120px"]}
      >
        {/* WORKOUT DATE */}
        <WorkoutDate
          submitted={submitted}
          createdAt={state.createdAt}
          handleStateChange={handleStateChange}
        />

        {/* TIMER */}
        <WorkoutTimer
          elapsedSeconds={state.elapsedSeconds}
          timerIsActive={timerIsActive}
          handleTimerIsActive={handleTimerIsActive}
          setTime={setTime}
        />
      </HStack>

      {/* ERROR MESSAGES */}
      <Box mt="-0.3rem">
        {errors.map((error) => {
          if (!submitted) {
            return null;
          }
          return (
            <Text key={error} color={theme.colors.error} fontSize="xs">
              {error}
            </Text>
          );
        })}
      </Box>

      {/* ADD COMMENT & TRACK WORKOUT BUTTONS */}
      <HStack w="100%" justifyContent={"space-between"} mt="1rem">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setAddWorkoutComment((prev) => !prev)}
          textAlign="left"
          my="0.5rem"
          sx={{
            _focus: {
              borderColor: theme.colors.green[300],
              boxShadow: `0 0 0 1px ${theme.colors.green[300]}`,
            },
          }}
        >
          {addWorkoutComment ? "Hide Comment" : "Add Comment"}
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setShowTracking((prev) => !prev)}
          textAlign="left"
          my="0.5rem"
          sx={{
            _focus: {
              borderColor: theme.colors.green[300],
              boxShadow: `0 0 0 1px ${theme.colors.green[300]}`,
            },
          }}
        >
          {showTracking ? "Hide Workout Tracking" : "Track Workout"}
        </Button>
      </HStack>

      {/* WORKOUT COMMENT */}
      <WorkoutComment
        addWorkoutComment={addWorkoutComment}
        comment={state.comment}
        setComment={setComment}
      />

      {/* EXERCISES */}
      <Box>
        <AnimatePresence>
          {state.exercises.map((exercise, index) => {
            return (
              <motion.div
                key={`${exercise.key}`}
                initial={{ opacity: 0, x: 200 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -200 }}
                transition={{
                  duration: 0.5,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                <CreateExercise
                  key={index}
                  exercise={exercise}
                  handleExercise={handleExercise}
                  deleteExercise={deleteExercise}
                  exerciseIndex={index}
                  submitted={submitted}
                  setFormHasErrors={setShowTracking}
                  trackWorkout={showTracking}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </Box>

      <Flex w="100%" justifyContent={"space-between"}>
        <Button
          variant="primary"
          onClick={handleAddExercise}
          leftIcon={<FaPlusCircle />}
          sx={{
            _focus: {
              borderColor: theme.colors.green[300],
              boxShadow: `0 0 0 1px ${theme.colors.green[300]}`,
            },
          }}
        >
          Add Exercise
        </Button>
        {state.exercises.length > 0 && (
          <Button
            variant="secondary"
            leftIcon={<FaSave />}
            disabled={true}
            onClick={onOpenSaveWorkout}
            sx={{
              _focus: {
                borderColor: theme.colors.green[300],
                boxShadow: `0 0 0 1px ${theme.colors.green[300]}`,
              },
            }}
          >
            Save Workout
          </Button>
        )}
      </Flex>

      {error && showServerError && (
        <Alert
          status="error"
          mt="2rem"
          borderRadius={"8px"}
          justifyContent={"space-between"}
        >
          <HStack>
            <AlertIcon />
            <AlertDescription>{error?.message}</AlertDescription>
          </HStack>
          <CloseButton
            alignSelf="flex-start"
            onClick={() => setShowServerError(false)}
          />
        </Alert>
      )}

      {showUploadSuccess && (
        <Alert status="success" mt="2rem" borderRadius={"8px"} bg="green.50">
          <AlertIcon />
          Workout Saved Successfully!
        </Alert>
      )}

      <ConfirmModal
        isOpen={isOpenSaveWorkout}
        onClose={onCloseSaveWorkout}
        onConfirmation={onSaveWorkout}
        ModalTitle="Save Workout"
        ModalBodyText={
          <Box mb="1rem">
            Are you sure your workout is complete, and ready to be saved?
            {state.exercises.length > 0 && (
              <>
                <br />
                <br />
                {state.createdAt && (
                  <>
                    {dayjs(state.createdAt).format("dddd, MMMM DD, YYYY")}
                    <br />
                  </>
                )}
                {state.exercises.map((exercise, index) => {
                  return (
                    <React.Fragment key={index}>
                      {formatExerciseString(exercise)} <br />
                    </React.Fragment>
                  );
                })}
              </>
            )}
          </Box>
        }
        CloseText="Cancel"
        ProceedText="Save"
        variant="confirm"
      />
    </Box>
  );
}
