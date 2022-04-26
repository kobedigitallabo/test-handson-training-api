import httpTrigger from './index'
import { bindings } from './function.json'
import {
  runStubFunctionFromBindings,
  createHttpTrigger,
} from 'stub-azure-function-context'

jest.mock('../SharedCode/cosmos', () => ({
  findAllDocument: async () => {
      return [{}]
  },
  getContainer: jest.fn(),
}))


describe('azure function handler', () => {
  it('helloworldではcosmosの中身を何かしら返している', async () => {

    const context = await mockedRequestFactory(httpTrigger, createHttpTrigger(
      'GET', // method
      '', // url
      {}, // header
      {}, // params
      {}, // body
      {}, // query
    ))
    expect(context.res.body.records).toBeTruthy()
  })
})

async function mockedRequestFactory(httpTrigger, data) {
  const [ reqBindings, resBindings ] = bindings;
  return runStubFunctionFromBindings(
    httpTrigger,
    [
      {
        ...reqBindings,
        data,
      },
      resBindings,
    ],
    () => {},
    new Date(),
  )
}
