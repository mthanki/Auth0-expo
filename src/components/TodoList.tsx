import React from "react";
import { Text, LoaderScreen, View } from "react-native-ui-lib";
import { useQuery } from "@apollo/client";
import { GET_TODOS } from "../data/queries";
import { FlatList } from "react-native";
import TodoItem from "./TodoItem";

interface TodoListProps {}

const TodoList: React.FC<TodoListProps> = () => {
  const { loading, error, data } = useQuery(GET_TODOS);

  if (loading)
    return (
      <View flex center>
        <LoaderScreen />
      </View>
    );

  if (error)
    return (
      <View center>
        <Text>Something went wrong...</Text>
      </View>
    );

  if (!data.todo.length) {
    return (
      <View flex center>
        <Text color="black">Todos you add will appear here</Text>
      </View>
    );
  }

  return (
    <View width={400} br40 padding-20 centerV spread>
      <FlatList
        data={data.todo}
        renderItem={({ item }) => <TodoItem item={item} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default TodoList;
