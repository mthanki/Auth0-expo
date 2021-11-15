import React from "react";
import { Card, LoaderScreen, View } from "react-native-ui-lib";
import { Alert, StyleSheet } from "react-native";
import { useMutation } from "@apollo/client";
import { UPDATE_TODO } from "../data/mutation";
import { Item } from "../types";

interface TodoItemProps {
  item: Item;
}

const TodoItem: React.FC<TodoItemProps> = ({ item }) => {
  const { text, id, is_completed } = item;
  const [updateTodo, { loading: updateLoading, error: updateError }] =
    useMutation(UPDATE_TODO);

  if (updateError) Alert.alert("Error", updateError.message);

  return (
    <View>
      <Card
        onPress={() => {
          if (!updateLoading) {
            updateTodo({
              variables: { id, isCompleted: !is_completed },
            });
          }
        }}
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
  );
};

const styles = StyleSheet.create({
  done: {
    opacity: 0.3,
  },
});

export default TodoItem;
