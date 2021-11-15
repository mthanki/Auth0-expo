import gql from "graphql-tag";

export const GET_TODOS = gql`
{
  todo(order_by: {created_at: desc}) {
    id
    text
    is_completed
  }
}
`