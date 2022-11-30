import 'source-map-support/register'
//import { getUserId } from '../utils'
//import * as middy from 'middy'
//import { cors} from 'middy/middlewares'
import {APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler} from 'aws-lambda';
import {deleteToDo} from "../../businessLogic/ToDo";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Remove a TODO item by id
    console.log("Processing removing event ", event);
    const aut = event.headers.Authorization;
    const split = aut.split(' ');
    const token = split[1];

    const todoId = event.pathParameters.todoId;

    const deleteTodos = await deleteToDo(todoId, token);

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        body: deleteTodos,
    }
}

