import { DynamoDBClient, ListTablesCommand, CreateTableCommand, DescribeTableCommand, waitUntilTableExists } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, TransactWriteCommand } from "@aws-sdk/lib-dynamodb";

// Konfigurasi Client

export const dynamoClient = new DynamoDBClient({
  endpoint: process.env.AWS_ENDPOINT,
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// Definisi Skema Tabel

/**
 * TABEL: users
 * PK: id (String)
 * Atribut: email, password
 */
const usersTable = {
  TableName: "users",
  BillingMode: "PAY_PER_REQUEST",
  AttributeDefinitions: [
    { AttributeName: "id", AttributeType: "S" },
    { AttributeName: "email", AttributeType: "S" },
  ],
  KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
  GlobalSecondaryIndexes: [
    {
      IndexName: "email-index",
      KeySchema: [{ AttributeName: "email", KeyType: "HASH" }],
      Projection: { ProjectionType: "ALL" },
    },
  ],
};

const postersTable = {
  TableName: "posters",
  BillingMode: "PAY_PER_REQUEST",
  AttributeDefinitions: [
    { AttributeName: "id", AttributeType: "S" }
  ],
  KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
};

// Daftar semua tabel
const TABLE_DEFINITIONS = [
  usersTable,
  postersTable
];

// Cek apakah tabel sudah ada
async function tableExists(tableName) {
  try {
    await dynamoClient.send(new DescribeTableCommand({ TableName: tableName }));
    return true;
  } catch (err) {
    if (err.name === "ResourceNotFoundException") return false;
    throw err;
  }
}

// Helper: Buat satu tabel dan tunggu aktif
async function createTable(tableDefinition) {
  const { TableName } = tableDefinition;
  console.log(`  ⏳ Membuat tabel "${TableName}"...`);

  await dynamoClient.send(new CreateTableCommand(tableDefinition));

  // Tunggu sampai tabel status ACTIVE
  await waitUntilTableExists(
    { client: dynamoClient, maxWaitTime: 60 },
    { TableName }
  );

  console.log(`  ✅ Tabel "${TableName}" berhasil dibuat dan aktif.`);
}

// initDb
export async function initDb() {
  console.log("\n🔍 Memeriksa koneksi dan tabel DynamoDB...\n");

  // Cek koneksi dengan list tables
  const { TableNames: existingTables } = await dynamoClient.send(
    new ListTablesCommand({})
  );

  console.log(
    `📋 Tabel yang sudah ada: ${existingTables.length > 0 ? existingTables.join(", ") : "(kosong)"}\n`
  );

  let created = 0;
  let skipped = 0;

  for (const tableDef of TABLE_DEFINITIONS) {
    const exists = existingTables.includes(tableDef.TableName);

    if (exists) {
      console.log(`  ✔️  Tabel "${tableDef.TableName}" sudah ada, dilewati.`);
      skipped++;
    } else {
      await createTable(tableDef);
      created++;
    }
  }

  console.log(`\n🚀 Inisialisasi DB selesai.`);
  console.log(`   • Dibuat  : ${created} tabel`);
  console.log(`   • Dilewati: ${skipped} tabel\n`);
}

