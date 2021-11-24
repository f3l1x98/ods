import path from 'path';

import { JestPactOptions, pactWith } from 'jest-pact';

import {
  badRequestResponse,
  exampleConfig,
  getByPipelineIdEmptyResponse,
  getByPipelineIdRequest,
  getByPipelineIdRequestTitle,
  getByPipelineIdSuccessResponse,
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
        const id = exampleConfig.pipelineId;

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
        const id = exampleConfig.pipelineId;

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
      describe('TODO 2', () => {
        /* BeforeEach(async () => {
          await provider.addInteraction({
            state: 'some pipelines exist',
            uponReceiving: getAllRequestTitle,
            withRequest: getAllRequest,
            willRespondWith: getAllSuccessResponse,
          });
        });

        it('returns a non-empty pipeline array', async () => {
          const pipelines = await restService.getAllPipelines();

          expect(pipelines).toStrictEqual([examplePipeline]);
        });*/
        it('Empty', () => {
          console.log('TODO');
        });
      });
    });

    describe('deleting a notification config', () => {
      describe('TODO 2', () => {
        /* BeforeEach(async () => {
          await provider.addInteraction({
            state: 'some pipelines exist',
            uponReceiving: getAllRequestTitle,
            withRequest: getAllRequest,
            willRespondWith: getAllSuccessResponse,
          });
        });

        it('returns a non-empty pipeline array', async () => {
          const pipelines = await restService.getAllPipelines();

          expect(pipelines).toStrictEqual([examplePipeline]);
        });*/
        it('Empty', () => {
          console.log('TODO');
        });
      });
    });
  });
});
