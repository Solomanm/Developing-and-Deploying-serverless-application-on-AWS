import 'source-map-support/register'
import { cors } from 'middy/middlewares'
import {APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler} from 'aws-lambda';
import {getAllToDo} from "../../businessLogic/ToDo";
//import * as middy from 'middy'


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Get all TODO items for a current user
    console.log("Getting todos event ", event);
    const aut = event.headers.Authorization;
    const split = aut.split(' ');
    const token = split[1];

    const toDos = await getAllToDo(token);

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
            "items": toDos,
        }),
    }
}
handler.use(
    cors({
      credentials: true
    })
  )
