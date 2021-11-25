import { RequestOptions, ResponseOptions } from '@pact-foundation/pact';
import { eachLike, like } from '@pact-foundation/pact/src/dsl/matchers';

import NotificationConfig, {
  NotificationType,
} from './notification/notificationConfig';
import { NotificationApiReadModel } from './notification/notificationRest';

export const exampleNotificationConfigId = 1;
export const examplePipelineId = 2;

export const exampleConfig: NotificationConfig = {
  id: exampleNotificationConfigId,
  pipelineId: examplePipelineId,
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

export function updateNotificationConfigRequestTitle(configId: number): string {
  return `a request for updating a notification config with id ${configId}`;
}

export function updateNotificationConfigRequest(
  notificationConfig: NotificationConfig,
): RequestOptions {
  return {
    method: 'PUT',
    path: `/configs/${notificationConfig.id}`,
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      pipelineId: notificationConfig.pipelineId,
      type: notificationConfig.type,
      condition: notificationConfig.condition,
      parameter: notificationConfig.parameters,
    },
  };
}

export const getByIdSuccessResponse: ResponseOptions = {
  // TODO any success status code is actually acceptable (i.e. 2xx)
  status: 200,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
  body: like(exampleApiModelConfig),
};

export function deleteRequestTitle(id: number): string {
  return `a request for deleting the notification config with id ${id}`;
}

export function deleteRequest(id: number): RequestOptions {
  return {
    method: 'DELETE',
    path: `/configs/${id}`,
  };
}

export const deleteSuccessResponse: ResponseOptions = {
  // TODO any success status code is actually acceptable (i.e. 2xx)
  status: 200,
};

export const updateSuccessResponse: ResponseOptions = {
  // TODO any success status code is actually acceptable (i.e. 2xx)
  status: 200,
};
