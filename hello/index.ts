import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { validate } from '../SharedCode/Validate'
import { findDocument, createDocument, getContainer, updateDocument, Resource } from "../SharedCode/cosmos";
import schema from './schema.json'
import { Hello } from "../SharedCode/interfaces"

type ParametersSchema = Record<keyof typeof schema.properties, any>

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const valided = validate<ParametersSchema>(schema, req.body);
    if (!valided.isValid) {
        context.log(valided.message)
        context.res = {
          status: 400,
          body: 'invalid parameters'
        }
        return
    }
    const id = valided.values.id

    const container = await getContainer('hello')
    const record = await findDocument<Hello>(id, id, container)
    if (!record) {
        context.log('id notFound', { id })
        context.res = {
          status: 404,
          body: 'id notFound'
        }
        return
    }

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: {
            record: record
        }
    };

};

export default httpTrigger;
