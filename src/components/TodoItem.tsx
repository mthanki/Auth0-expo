import React from "react";
import { Card, LoaderScreen, View } from "react-native-ui-lib";
import { Alert, StyleSheet, Dimensions } from "react-native";
import { useMutation } from "@apollo/client";
import { DELETE_TODO, UPDATE_TODO } from "../data/mutation";
import { Item } from "../types";
import AnimatedItemContainer from "./AnimatedItemContainer";
import { GET_TODOS } from "../data/queries";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPEOUT_DURATION = 250;

interface TodoItemProps {
  item: Item;
}

const TodoItem: React.FC<TodoItemProps> = ({ item }) => {
  const { text, id, is_completed } = item;
  const handleTodoDelete = () => {
    deleteTodo({
      variables: { id },
      refetchQueries: [{ query: GET_TODOS }],
    });
  };

  const [updateTodo, { loading: updateLoading, error: updateError }] =
    useMutation(UPDATE_TODO);

  const [deleteTodo, { loading: deleteLoading, error: deleteError }] =
    useMutation(DELETE_TODO);

  if (updateError) Alert.alert("Error", updateError.message);
  if (deleteError) Alert.alert("Error", deleteError.message);

  return (
    <AnimatedItemContainer onSwipeComplete={handleTodoDelete}>
      <View paddingH-20>
        <Card
          style={updateLoading && styles.loading}
          row
          marginV-5
          padding-15
          flex
          centerV
        >
          {updateLoading ? (
            <LoaderScreen size="small" color="gray" />
          ) : (
            <Card.Section
              contentStyle={is_completed ? styles.done : {}}
              content={[{ text: text, text70: true, grey10: true }]}
            />
          )}
        </Card>
      </View>
    </AnimatedItemContainer>
  );
};

const styles = StyleSheet.create({
  done: {
    opacity: 0.3,
  },
  loading: {
    backgroundColor: "lightgray",
  },
});

export default TodoItem;
