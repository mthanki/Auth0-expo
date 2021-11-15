import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Button, TextField, View } from "react-native-ui-lib";
import { INSERT_TODO } from "../data/mutation";
import { GET_TODOS } from "../data/queries";

interface AddTodoProps {}

const AddTodo: React.FC<AddTodoProps> = () => {
  const [text, setText] = useState<String>("");
  const [insertTodo, { loading, error }] = useMutation(INSERT_TODO);

  return (
    <View bg-red br40 marginB-40 marginH-50>
      <View
        style={{
          justifyContent: "flex-end",
          flexDirection: "column",
        }}
        bottom
        paddingB-0
      >
        <TextField
          onChangeText={(text: String) => setText(text)}
          value={text}
        />
      </View>
      <Button
        onPress={() => {
          insertTodo({
            variables: { text },
            refetchQueries: [{ query: GET_TODOS }],
          });
          setText("");
        }}
        disabled={loading || text === ""}
        label="Add"
      ></Button>
    </View>
  );
};

export default AddTodo;
