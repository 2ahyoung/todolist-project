import json
import boto3
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('ToDoListTable')

def lambda_handler(event, context):
    http_method = event['httpMethod']
    if http_method == 'GET':
        return get_tasks(event)
    elif http_method == 'POST':
        return create_task(event)
    elif http_method == 'PUT':
        return update_task(event)
    elif http_method == 'DELETE':
        return delete_task(event)
    else:
        return {
            'statusCode': 405,
            'body': json.dumps('Method Not Allowed')
        }

def get_tasks(event):
    response = table.scan()
    return {
        'statusCode': 200,
        'body': json.dumps(response['Items'])
    }

def create_task(event):
    body = json.loads(event['body'])
    table.put_item(Item=body)
    return {
        'statusCode': 201,
        'body': json.dumps('Task created')
    }

def update_task(event):
    body = json.loads(event['body'])
    table.update_item(
        Key={'id': body['id']},
        UpdateExpression='SET #status = :status',
        ExpressionAttributeNames={'#status': 'status'},
        ExpressionAttributeValues={':status': body['status']}
    )
    return {
        'statusCode': 200,
        'body': json.dumps('Task updated')
    }

def delete_task(event):
    body = json.loads(event['body'])
    table.delete_item(Key={'id': body['id']})
    return {
        'statusCode': 200,
        'body': json.dumps('Task deleted')
    }
