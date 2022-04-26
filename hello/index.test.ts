import httpTrigger from './index'
import { bindings } from './function.json'
import {
  runStubFunctionFromBindings,
  createHttpTrigger,
} from 'stub-azure-function-context'

// cosmosDB操作をモック
const mock = {
}

jest.mock('../SharedCode/cosmos', () => ({
  findDocument: async (id) => {
      return [{}]
  },
  getContainer: jest.fn(),
}))


describe('azure function handler', () => {
  it('helloテスト: 成功パターン', async () => {

    const context = await mockedRequestFactory(httpTrigger, createHttpTrigger(
      'GET', // method
      '', // url
      {}, // header
      {}, // params
      {}, // body
      {}, // query
    ))
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
