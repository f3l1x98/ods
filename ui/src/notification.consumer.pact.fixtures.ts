import { RequestOptions, ResponseOptions } from '@pact-foundation/pact';
import { eachLike } from '@pact-foundation/pact/src/dsl/matchers';

import NotificationConfig, {
  NotificationType,
} from './notification/notificationConfig';
import { NotificationApiReadModel } from './notification/notificationRest';

export const exampleConfig: NotificationConfig = {
  id: 1,
  pipelineId: 2,
  type: NotificationType.WEBHOOK,
  condition: 'true',
  parameters: {
    url: 'https://MOCK_URL/webhook1',
  },
};
const exampleApiModelConfig: NotificationApiReadModel = {
  id: exampleConfig.id,
  pipelineId: exampleConfig.pipelineId,
  type: exampleConfig.type,
  condition: exampleConfig.condition,
  parameter: exampleConfig.parameters,
};

export function getByPipelineIdRequestTitle(pipelineId: number): string {
  return `a request for getting notification configs with pipelineId id ${pipelineId}`;
}

export function getByPipelineIdRequest(pipelineId: number): RequestOptions {
  return {
    method: 'GET',
    path: '/configs',
    query: `pipelineId=${pipelineId}`,
  };
}

export const getByPipelineIdSuccessResponse: ResponseOptions = {
  // TODO any success status code is actually acceptable (i.e. 2xx)
  status: 200,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
  body: eachLike(exampleApiModelConfig),
};

export const getByPipelineIdEmptyResponse: ResponseOptions = {
  // TODO any success status code is actually acceptable (i.e. 2xx)
  status: 200,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
  body: [],
};

export const notFoundResponse: ResponseOptions = {
  // TODO any status code that results in throwing an error is actually acceptable (i.e. 4xx, 5xx)
  status: 404,
};

export const badRequestResponse: ResponseOptions = {
  // TODO any status code that results in throwing an error is actually acceptable (i.e. 4xx, 5xx)
  status: 400,
};
