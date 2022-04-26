// テストする本体を読み込む
import httpTrigger from './index'
// function.jsonから設定を読み込み
import { bindings } from './function.json'
// Azure FunctionsのStubを使ってテストします
import {
  runStubFunctionFromBindings,
  createHttpTrigger,
} from 'stub-azure-function-context'

// cosmosDB操作をモック ここにモックデータを記載します
const mock = {
}

// APIのなかで、cosmosDBにアクセスする関数をモックしておきます。今回は、findDocumentです。
jest.mock('../SharedCode/cosmos', () => ({
  findDocument: async (id) => {
      return [{}]
  },
  getContainer: jest.fn(),
}))


describe('azure function handler', () => {
  it('helloテスト: 成功パターン', async () => {

    const context = await mockedRequestFactory(httpTrigger, createHttpTrigger(
      'POST', // method
      '', // url
      {}, // header
      {}, // params
      {}, // body
      {}, // query
    ))
  })
})

// Azure Functionのバインド設定を用いてAzureFunctionのStubを作成して、関数を渡して実行させる
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
