import 'source-map-support/register'
import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'
import {UpdateTodoRequest} from '../../requests/UpdateTodoRequest'
import {updateToDo} from "../../businessLogic/ToDo";
//import * as middy from 'middy'
//import { cors, httpErrorHandler } from 'middy/middlewares'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
    console.log("Processing event get updatetodo ", event);
    const aut = event.headers.Authorization;
    const split = aut.split(' ');
    const token = split[1];

    const todoId = event.pathParameters.todoId;
    const updatedTodoItem: UpdateTodoRequest = JSON.parse(event.body);
    const toDoItem = await updateToDo(updatedTodoItem, todoId, token);

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
            "item": toDoItem
        }),
    }
}

