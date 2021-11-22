import gql from "graphql-tag";

export const INSERT_USERS = gql`
  mutation($id: String, $name: String){
		insert_user(objects: [{id: $id, name: $name}]) {
			affected_rows
		}
	}
`;

export const INSERT_TODO = gql`
	mutation($text: String){
		insert_todo(objects: [{text: $text}]){
			returning {
				id
				text
				is_completed
			}
		}
	}
`;

export const UPDATE_TODO = gql`
	mutation($id: Int, $isCompleted: Boolean) {
		update_todo(
			where: {id: {_eq: $id}}
			_set: {is_completed: $isCompleted}
		) {
			returning {
				is_completed
				id
			}
		}
	}
`;

export const DELETE_TODO = gql`
mutation($id: Int) {
  delete_todo(where: {id: {_eq: $id}}) {
    affected_rows
  }
}
`;