
import { CosmosClient, Database, Container, Resource } from '@azure/cosmos';
export { Resource } from '@azure/cosmos'

export type QueryParameters = Array<{
    name: string,
    value: any,
}>

const OptimizedFeedOption = {
    enableCrossPartitionQuery: true,
    maxDegreeOfParallelism: -1,
    maxItemCount: -1
}

export const getDatabase = async () => {
    const client = new CosmosClient(process.env.CosmosConnectionString)
    const { database } = await client.databases.createIfNotExists({ id: process.env.COSMOS_DATABASE });
    return database
}

export const getContainer = async (containerId, partitionKey='/id', database?: Database) => {
  if (!database) {
    database = await getDatabase()
  }
  const { container } = await database.containers.createIfNotExists({ id: containerId, partitionKey });
  return container
}

const convertParameter = (parameters: Array<unknown>) : QueryParameters => {
  return parameters.map((v, k) => {
    return {
      name: `@param${k}`,
      value: v,
    }
  })
}

export const query = async <T extends Resource>(query: string, queryParameters: unknown[], container: Container): Promise<T[]> => {
  let response
  if (queryParameters.length) {
    const parameters = convertParameter(queryParameters)
    parameters.map((v) => {
      query = query.replace("?", v.name)
    })
    response = await container.items.query({ query, parameters }, OptimizedFeedOption).fetchAll()
  } else {
    response = await container.items.query({ query }, OptimizedFeedOption).fetchAll()
  }
  return response.resources
}

export const findDocument = async <T extends Resource>(id: string, partition: string, container: Container) => {
  const item = container.item(id, partition)
  const { resource: record } = await item.read();
  return record as T
}

export const findAllDocument = async <T extends Resource>(container: Container) => {
  const { resources: records } = await container.items.query("SELECT * FROM c").fetchAll()
  return records as T[]
}

export const createDocument = async <T extends Resource>(data: Partial<T>, container: Container) => {
  const item = await container.items.create(data)
  const { resource: record } = item
  return record as T
}

export const updateDocument = async <T extends Resource>(id: string, partition: string, data: Partial<T>, container: Container) => {
  const oldItem = container.item(id, partition)
  const item = await oldItem.replace(data)
  const { resource: record } = item
  return record as T
}

export const removeDocument = async (id: string, partition: string, container: Container) => {
  const item = container.item(id, partition)
  if (item) {
      await item.delete()
      return true
  }
  return false
}
