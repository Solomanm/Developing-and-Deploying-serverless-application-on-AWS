import * as AWS from "aws-sdk";
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { TodoItem } from "../models/TodoItem";
import { TodoUpdate } from "../models/TodoUpdate";

const XAWS = AWSXRay.captureAWS(AWS)

export class ToDoAccess {
    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly todoTable = process.env.TODOS_TABLE,
        private readonly s3BucketName = process.env.S3_BUCKET_NAME) {
    }

    async getAllToDo(userId: string): Promise<TodoItem[]> {
        console.log("Getting all todo");
        const result = await this.docClient.query({
            TableName: this.todoTable,
            keyConditionAttributeValues:{
                ':userId': userId
            }
        })
        .promise()
        const items = result.items
        return items as TodoItem[]
    }

    async createToDo(todoItem: TodoItem): Promise<TodoItem> {
        console.log("Creating new todo");

        const result = await this.docClient.put({
            TableName: this.todoTable,
            Item: todoItem
        })
        .promise()
        console.log('todo item created', result)
        return todoItem as TodoItem

    }

    async updateToDo(todoUpdate: TodoUpdate, todoId: string, userId: string): Promise<TodoUpdate> {

        console.log('Upadte todo item ')
        await this.docClient.update({
        TableName: this.todoTable,
        key: {
            todoId,
            userId
        },
        UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
        ExpressionAttributeValues: {
            ':name': todoUpdate.name,
            ':dueDate': todoUpdate.dueDate,
            ':done': todoUpdate.done
        },
        ExpressionAttributeName: {
            '#name': 'name'
        }

    })
    .promise()
    return todoUpdate

    }

    async deleteToDo(todoId: string, userId: string): Promise<string> {
        console.log("Deleting todo");

        const params = {
            TableName: this.todoTable,
            Key: {
                "userId": userId,
                "todoId": todoId
            },
        };

        const result = await this.docClient.delete(params).promise();
        console.log(result);

        return "" as string;
    }

    async generateUploadUrl(todoId: string): Promise<string> {
        console.log("Generating URL");

        const url = this.s3Client.getSignedUrl('putObject', {
            Bucket: this.s3BucketName,
            Key: todoId,
            Expires: 1000,
        });
        console.log(url);

        return url as string;
    }
}