import path from 'path';

import { JestPactOptions, pactWith } from 'jest-pact';

import {
  badRequestResponse,
  deleteRequest,
  deleteRequestTitle,
  deleteSuccessResponse,
  exampleConfig,
  examplePipelineId,
  getByPipelineIdEmptyResponse,
  getByPipelineIdRequest,
  getByPipelineIdRequestTitle,
  getByPipelineIdSuccessResponse,
  notFoundResponse,
  updateNotificationConfigRequest,
  updateNotificationConfigRequestTitle,
  updateSuccessResponse,
} from './notification.consumer.pact.fixtures';
import { NotificationRest } from './notification/notificationRest';

const options: JestPactOptions = {
  consumer: 'UI',
  provider: 'Notification',
  dir: path.resolve(process.cwd(), '..', 'pacts'),
  logDir: path.resolve(process.cwd(), '..', 'pacts', 'logs'),
  pactfileWriteMode: 'overwrite',
};

pactWith(options, provider => {
  let restService: NotificationRest;

  describe('using notification rest', () => {
    beforeAll(() => {
      const notificationServiceUrl = provider.mockService.baseUrl;
      restService = new NotificationRest(notificationServiceUrl);
    });

    describe('getting all notification configs by pipelineId', () => {
      describe('when some notification configs with requested pipelineId exists', () => {
        const id = examplePipelineId;

        beforeEach(async () => {
          await provider.addInteraction({
            state: `notification configs with pipelineId ${id} exists`,
            uponReceiving: getByPipelineIdRequestTitle(id),
            withRequest: getByPipelineIdRequest(id),
            willRespondWith: getByPipelineIdSuccessResponse,
          });
        });

        it('returns a non-empty notification config array', async () => {
          const configs = await restService.getAllByPipelineId(id);

          expect(configs).toStrictEqual([exampleConfig]);
        });
      });

      describe('when no notification configs with requested pipelineId exists', () => {
        const id = examplePipelineId;

        beforeEach(async () => {
          await provider.addInteraction({
            state: `no notification configs with pipelineId ${id} exists`,
            uponReceiving: getByPipelineIdRequestTitle(id),
            withRequest: getByPipelineIdRequest(id),
            willRespondWith: getByPipelineIdEmptyResponse,
          });
        });

        it('returns a non-empty notification config array', async () => {
          const configs = await restService.getAllByPipelineId(id);

          expect(configs).toStrictEqual([]);
        });
      });

      describe('with NaN as requested datasource id', () => {
        beforeEach(async () => {
          await provider.addInteraction({
            state: 'any state',
            uponReceiving: getByPipelineIdRequestTitle(NaN),
            withRequest: getByPipelineIdRequest(NaN),
            willRespondWith: badRequestResponse,
          });
        });

        it('throws an error', async () => {
          await expect(restService.getAllByPipelineId(NaN)).rejects.toThrow(
            Error,
          );
        });
      });
    });

    describe('updateing a notification config', () => {
      describe('when notification config with requested id exist', () => {
        const updatedConfig = exampleConfig;

        beforeEach(async () => {
          await provider.addInteraction({
            state: `notification config with id ${updatedConfig.id} exist`,
            uponReceiving: updateNotificationConfigRequestTitle(
              updatedConfig.id,
            ),
            withRequest: updateNotificationConfigRequest(updatedConfig),
            willRespondWith: updateSuccessResponse,
          });
        });

        it('succeeds', async () => {
          await restService.update(updatedConfig);
        });
      });

      describe('when notification config with requested id does not exist', () => {
        const updatedConfig = exampleConfig;

        beforeEach(async () => {
          await provider.addInteraction({
            state: `notification config with id ${updatedConfig.id} does not exist`,
            uponReceiving: updateNotificationConfigRequestTitle(
              updatedConfig.id,
            ),
            withRequest: updateNotificationConfigRequest(updatedConfig),
            willRespondWith: notFoundResponse,
          });
        });

        it('throws an error', async () => {
          await expect(restService.update(updatedConfig)).rejects.toThrow(
            Error,
          );
        });
      });

      describe('with NaN as notification config id', () => {
        const updatedConfig = {
          ...exampleConfig,
          id: NaN,
        };

        beforeEach(async () => {
          await provider.addInteraction({
            state: 'any state',
            uponReceiving: updateNotificationConfigRequestTitle(
              updatedConfig.id,
            ),
            withRequest: updateNotificationConfigRequest(updatedConfig),
            willRespondWith: badRequestResponse,
          });
        });

        it('throws an error', async () => {
          await expect(restService.update(updatedConfig)).rejects.toThrow(
            Error,
          );
        });
      });
    });

    describe('deleting a notification config', () => {
      describe('when notification config with requested id exist', () => {
        const removeConfig = exampleConfig;

        beforeEach(async () => {
          await provider.addInteraction({
            state: `notification config with id ${removeConfig.id} exist`,
            uponReceiving: deleteRequestTitle(removeConfig.id),
            withRequest: deleteRequest(removeConfig.id),
            willRespondWith: deleteSuccessResponse,
          });
        });

        it('succeeds', async () => {
          await restService.remove(removeConfig);
        });
      });

      describe('when notification config with requested id does not exist', () => {
        const removeConfig = exampleConfig;

        beforeEach(async () => {
          await provider.addInteraction({
            state: `notification config with id ${removeConfig.id} does not exist`,
            uponReceiving: deleteRequestTitle(removeConfig.id),
            withRequest: deleteRequest(removeConfig.id),
            willRespondWith: deleteSuccessResponse,
          });
        });

        it('succeeds', async () => {
          await restService.remove(removeConfig);
        });
      });

      describe('with NaN as notification config id', () => {
        const removeConfig = {
          ...exampleConfig,
          id: NaN,
        };

        beforeEach(async () => {
          await provider.addInteraction({
            state: 'any state',
            uponReceiving: deleteRequestTitle(removeConfig.id),
            withRequest: deleteRequest(removeConfig.id),
            willRespondWith: badRequestResponse,
          });
        });

        it('throws an error', async () => {
          await expect(restService.remove(removeConfig)).rejects.toThrow(Error);
        });
      });
    });
  });
});
