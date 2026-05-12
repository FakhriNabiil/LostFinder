import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, ScanCommand, TransactWriteCommand, DeleteCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoClient } from "../aws/services/DynamoDB.js";

const docClient = DynamoDBDocumentClient.from(dynamoClient);

// Insert User
async function insertUser({ id, email, password }) {
  await docClient.send(
    new PutCommand({
      TableName: "users",
      Item: {
        id,
        email,
        password,
        createdAt: new Date().toISOString(),
      }
    })
  );

  console.log(`✅ User "${email}" (${id}) berhasil ditambahkan.`);
}

// Insert Poster
const insertPoster = async ({ id, title, description, contact, owner, imgUrl, status }) => {
  await docClient.send(
    new PutCommand({
      TableName: "posters",
      Item: {
        id,
        title,
        description,
        contact,
        owner,
        imgUrl,
        status,
        createdAt: new Date().toISOString(),
      }
    })
  );
};

// Get Poster By ID
const getPosterById = async (id) => {
  const command = new GetCommand({
    TableName: "posters",
    Key: { id }
  });
  const result = await docClient.send(command);
  return result.Item;
};

// Get All Posters
const getAllPosters = async () => {
  const command = new ScanCommand({
    TableName: "posters"
  });
  const result = await docClient.send(command);
  return result.Items;
};

// Get User By Email
const getUserByEmail = async (email) => {
  const command = new ScanCommand({
    TableName: "users",
    FilterExpression: "email = :e",
    ExpressionAttributeValues: {
      ":e": email
    }
  });
  const result = await docClient.send(command);
  return result.Items[0];
};

// Delete Poster
const deletePoster = async (id) => {
  const command = new DeleteCommand({
    TableName: "posters",
    Key: { id }
  });
  await docClient.send(command);
};

// Update Poster Status
const updatePosterStatus = async (id, status) => {
  const command = new UpdateCommand({
    TableName: "posters",
    Key: { id },
    UpdateExpression: "set #s = :status",
    ExpressionAttributeNames: {
      "#s": "status"
    },
    ExpressionAttributeValues: {
      ":status": status
    }
  });
  await docClient.send(command);
};

export {
  insertUser,
  getUserByEmail,
  getAllPosters,
  insertPoster,
  getPosterById,
  deletePoster,
  updatePosterStatus
}

