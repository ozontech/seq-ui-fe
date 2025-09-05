import type { SeqapiV1FieldDto } from "@/api/generated/seq-ui-server";

const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const messageTexts = [
  'Image loading error',
  'handler ended with error',
  'error occurred while updating token',
  'Call failed with gRPC error status.',
  'rpc error: code = NotFound desc = warehouse not found. id: 0000000000000000, system type: errorID'
]

const sourceNames = [
  'prod-k8s',
  'test-k8s',
  'dev-k8s',
  'stg-k8s',
  'localhost'
]

const serviceNames = [
  'auth-service',
  'product-service',
  'controller-service',
  'metric-service',
  'feature-service'
]

export const generateTableData = (length: number) => {
  return Array.from({ length }, (_, index) => ({
    id: index.toString(),
    timestamp: new Date(Date.now() - index * 10_000).toISOString(),
    level: getRandomInt(0, 7),
    message: messageTexts[getRandomInt(0, 4)],
    source: sourceNames[getRandomInt(0, 4)],
    service: serviceNames[getRandomInt(0, 4)],
  }))
}

export const getKeywords = (): SeqapiV1FieldDto[] => {
  return [
    'channel',
    'source',
    'service',
    'level',
    'id'
  ].map(name => ({ name, type: 'keyword' }))
}
