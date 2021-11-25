import * as fs from 'fs';
import path from 'path';

import { Matchers, asynchronousBodyHandler } from '@pact-foundation/pact';
import { JestMessageConsumerOptions, messagePactWith } from 'jest-pact';

import { PipelineSuccessEvent } from './api/pipelineEvent';
import { TriggerEventHandler } from './api/triggerEventHandler';
import { NotificationConfigManager } from './notification-config/notificationConfigManager';
import NotificationExecutor from './notification-execution/notificationExecutor';

const pactsDir = path.resolve(process.cwd(), '..', 'pacts');

const options: JestMessageConsumerOptions = {
  consumer: 'Notification',
  provider: 'Pipeline',
  dir: pactsDir,
  logDir: path.resolve(process.cwd(), '..', 'pacts', 'logs'),

  // TODO the pactfileWriteMode cannot be set due to an open issue in pact-js: https://github.com/pact-foundation/pact-js/issues/414
  // PactfileWriteMode: 'overwrite'
};
// TODO remove this workaround as soon as the pactfileWriteMode can be set to 'overwrite' in JestMessageConsumerOptions
const contractPath = path.resolve(pactsDir, 'notification-pipeline.json');
if (fs.existsSync(contractPath)) {
  fs.unlinkSync(contractPath);
}

const examplePipelineSuccessEventWithoutSchema: PipelineSuccessEvent = {
  pipelineId: 1,
  pipelineName: 'some pipeline name',
  data: {},
};

const examplePipelineSuccessEventWithSchema: PipelineSuccessEvent = {
  ...examplePipelineSuccessEventWithoutSchema,
  schema: {},
};

jest.mock('./env', () => ({}));

jest.mock('./notification-config/notificationConfigManager', () => {
  return {
    NotificationConfigManager: jest.fn().mockImplementation(() => {
      return {
        getForPipeline: jest.fn().mockResolvedValue([]),
      };
    }),
  };
});
const mockNotificationConfigManager =
  NotificationConfigManager as jest.Mock<NotificationConfigManager>;

jest.mock('./notification-execution/notificationExecutor');
const mockNotificationExecutor =
  NotificationExecutor as jest.Mock<NotificationExecutor>;

messagePactWith(options, (messagePact) => {
  describe('receiving an amqp message', () => {
    // TODO somehow get mockNotificationConfigManager working (requires constructor param -> jest fails)
    const triggerEventHandler = new TriggerEventHandler(
      mockNotificationConfigManager(),
      mockNotificationExecutor(),
    );

    it('handles a success event without schema', async () => {
      await messagePact
        .given('any state')
        .expectsToReceive('a success event without schema')
        .withContent(Matchers.like(examplePipelineSuccessEventWithoutSchema))
        .verify(
          asynchronousBodyHandler(
            async (body) => await triggerEventHandler.handleEvent(body),
          ),
        );
    });

    it('handles a success event with schema', async () => {
      await messagePact
        .given('any state')
        .expectsToReceive('a success event with schema')
        .withContent(Matchers.like(examplePipelineSuccessEventWithSchema))
        .verify(
          asynchronousBodyHandler(
            async (body) => await triggerEventHandler.handleEvent(body),
          ),
        );
    });
  });
});
