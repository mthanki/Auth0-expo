import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { RootStackParamList } from "../services/navigation";
import {
  View,
  LoaderScreen,
  Button,
  ActionSheet,
  ColorName,
} from "react-native-ui-lib";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { GRAPHQL_ENDPOINT } from "../consts";
import { User } from "../types";
import { INSERT_USERS } from "../data/mutation";
import TodoList from "../components/TodoList";
import AddTodo from "../components/AddTodo";

interface HomeScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  token: String | null;
  user: User;
  onLogout: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  token,
  user,
  onLogout,
  navigation,
}) => {
  const [client, setClient] = useState<any>(null);
  // unused currently
  const [showOptions, setShowOptions] = useState<boolean>(false);

  useEffect(() => {
    const { id, name, isNewUser } = user;

    const client = new ApolloClient({
      uri: GRAPHQL_ENDPOINT,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (isNewUser) {
      client.mutate({
        mutation: INSERT_USERS,
        variables: { id, name },
      });
    }

    setClient(client);
  }, []);

  // Just some UI elements for later use
  const actionSheet = (
    <ActionSheet
      title={"Options"}
      message={"Message of action sheet"}
      cancelButtonIndex={3}
      destructiveButtonIndex={0}
      useNativeIOS={false}
      options={[
        { label: "Upgrade", onPress: () => navigation.push("Payment") },
        {
          label: "Logout",
          onPress: onLogout,
        },
        { label: "Cancel", onPress: () => setShowOptions(false) },
      ]}
      dialogStyle={{ height: 300 }}
      visible={showOptions}
      onDismiss={() => setShowOptions(false)}
    />
  );

  if (!client) {
    return (
      <View flex>
        <LoaderScreen />
      </View>
    );
  }

  return (
    <ApolloProvider client={client}>
      <Button
        margin-25
        label="Get Premium"
        backgroundColor="green"
        onPress={() => navigation.push("Payment")}
      />
      <View flex center>
        <TodoList />
      </View>
      <AddTodo />
    </ApolloProvider>
  );
};

export default HomeScreen;
