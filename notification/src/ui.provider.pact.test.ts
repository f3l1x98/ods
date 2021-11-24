import path from 'path';

import { Verifier } from '@pact-foundation/pact';

import {
  NotificationBase,
  NotificationType,
  WebhookNotification,
} from './notification-config/notificationConfig';

import { port, server } from './index'; // The main method is automatically called due to this import

const notificationConfigs: NotificationBase[] = [];
let nextNotificationConfigId: number;

jest.mock('./notification-config/notificationRepository', () => {
  return {
    NotificationRepository: jest.fn().mockImplementation(() => {
      return {
        getAll: jest.fn().mockResolvedValue(notificationConfigs),

        getById: jest.fn().mockImplementation(async (id: number) => {
          const result = notificationConfigs.find((config) => config.id === id);
          return Promise.resolve(result);
        }),

        getForPipeline: jest
          .fn()
          .mockImplementation(async (pipelineId: number) => {
            const result = notificationConfigs.filter(
              (config) => config.pipelineId === pipelineId,
            );
            return Promise.resolve(result);
          }),

        create: jest.fn(), // TODO

        update: jest.fn((id: number, config: NotificationBase) => {
          const configToUpdate = notificationConfigs.find(
            (config) => config.id === id,
          );
          Object.assign(configToUpdate, config);
        }),

        delete: jest.fn((id: number) => {
          const indexOfConfigToDelete = notificationConfigs.findIndex(
            (config) => config.id === id,
          );
          if (indexOfConfigToDelete !== -1) {
            notificationConfigs.splice(indexOfConfigToDelete, 1);
          }
        }),
      };
    }),
  };
});

// The following mocks are needed for propper execution of the main function
jest.mock('./notification-config/postgresNotificationRepository', () => {
  return {
    init: jest.fn(),
  };
});
jest.mock('@jvalue/node-dry-amqp', () => {
  return {
    AmqpConnection: jest.fn(),
  };
});
jest.mock('./api/amqp/pipelineSuccessConsumer', () => {
  return {
    createPipelineSuccessConsumer: jest.fn(),
  };
});

describe('Pact Provider Verification', () => {
  it('validates the expectations of the UI', async () => {
    const verifier = new Verifier({
      provider: 'Notification',
      providerBaseUrl: `http://localhost:${port}`,
      pactUrls: [
        path.resolve(process.cwd(), '..', 'pacts', 'ui-notification.json'),
      ],
      logDir: path.resolve(process.cwd(), '..', 'pacts', 'logs'),
      stateHandlers: {
        'any state': setupEmptyState,
        'notification configs with pipelineId 2 exists':
          setupSomeNotificationConfigs,
        'no notification configs with pipelineId 2 exists': setupEmptyState,
      },
    });
    await verifier.verifyProvider().finally(() => {
      server?.close();
    });
  });
});

async function setupEmptyState(): Promise<void> {
  clearState();

  return Promise.resolve();
}

async function setupSomeNotificationConfigs(): Promise<void> {
  clearState();
  addSampleNotificationConfig(++nextNotificationConfigId, 2);
  addSampleNotificationConfig(++nextNotificationConfigId, 3);
  addSampleNotificationConfig(++nextNotificationConfigId, 2);

  return Promise.resolve();
}

function clearState(): void {
  nextNotificationConfigId = 0;
  clearNotificationConfigs();
}

function clearNotificationConfigs(): void {
  notificationConfigs.splice(0, notificationConfigs.length);
}

function addSampleNotificationConfig(id: number, pipelineId: number): void {
  const pipelineConfig: WebhookNotification = {
    id: id,
    pipelineId: pipelineId,
    condition: 'true',
    parameter: {
      url: 'https://MOCK_URL/webhook1',
    },
    type: NotificationType.WEBHOOK,
  };
  notificationConfigs.push(pipelineConfig);
}
