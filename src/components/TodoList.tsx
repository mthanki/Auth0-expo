import React, { useEffect } from "react";
import { Text, LoaderScreen, View } from "react-native-ui-lib";
import { useQuery } from "@apollo/client";
import { GET_TODOS } from "../data/queries";
import TodoItem from "./TodoItem";
import { Item } from "../types";
import { Dimensions, FlatList, LayoutAnimation } from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;

interface TodoListProps {}

const TodoList: React.FC<TodoListProps> = () => {
  const { loading, error, data } = useQuery(GET_TODOS);

  useEffect(() => {
    LayoutAnimation.easeInEaseOut();
  }, [data]);

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
    // Making the container full-width because items needs space to move left and right
    <View width={SCREEN_WIDTH} br40 centerV spread>
      <FlatList
        data={data.todo}
        renderItem={({ item }) => <TodoItem item={item} />}
        keyExtractor={(item: Item) => item.id.toString()}
      />
    </View>
  );
};

export default TodoList;
