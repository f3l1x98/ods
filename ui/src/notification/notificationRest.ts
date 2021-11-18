import axios, { AxiosInstance, AxiosResponse } from 'axios';

import { NOTIFICATION_SERVICE_URL } from '@/env';
import NotificationConfig, {
  NotificationParameters,
  NotificationType,
} from '@/notification/notificationConfig';

interface NotificationApiReadModel extends NotificationApiWriteModel {
  id: number;
}

interface NotificationApiWriteModel {
  pipelineId: number;
  condition: string;
  type: ApiNotificationType;
  parameter: NotificationParameters | Record<string, unknown>;
}

type ApiNotificationType = 'WEBHOOK' | 'SLACK' | 'FCM';

// Instance such that the class will not be initiated multiple times for normal use
let instance: NotificationRest;

/**
 * Returns instance of NotificationRest connected to the backend as configured by NOTIFICATION_SERVICE_URL
 *
 * @returns NotificationRest connected to ${NOTIFICATION_SERVICE_URL}
 */
export function getRealInstance(): NotificationRest {
  if (!instance) {
    instance = new NotificationRest(`${NOTIFICATION_SERVICE_URL}`);
  }

  return instance;
}

export class NotificationRest {
  private readonly httpNotifications: AxiosInstance;

  constructor(notificationServiceUrl: string) {
    /**
     * Axios instance with default headers and base url.
     * The option transformResponse is set to an empty array
     * because of explicit JSON.parser call with custom reviver.
     */
    this.httpNotifications = axios.create({
      baseURL: `${notificationServiceUrl}`,
      headers: { 'Content-Type': 'application/json' },
      transformResponse: [],
    });
  }

  async getAllByPipelineId(pipelineId: number): Promise<NotificationConfig[]> {
    const response = await this.httpNotifications.get(
      `/configs?pipelineId=${pipelineId}`,
    );
    const notifications = JSON.parse(
      response.data,
    ) as NotificationApiReadModel[];
    return this.fromApiReadModels(notifications);
  }

  async getById(id: number): Promise<NotificationConfig> {
    const response = await this.httpNotifications.get(`/configs/${id}`);
    const notificationApiModel = JSON.parse(
      response.data,
    ) as NotificationApiReadModel;
    return this.fromApiReadModel(notificationApiModel);
  }

  async create(
    notificationConfig: NotificationConfig,
  ): Promise<NotificationConfig> {
    const apiModel = this.toApiWriteModel(notificationConfig);

    const response = await this.httpNotifications.post(
      '/configs',
      JSON.stringify(apiModel),
    );
    const notificationApiModel = JSON.parse(
      response.data,
    ) as NotificationApiReadModel;
    return this.fromApiReadModel(notificationApiModel);
  }

  async update(notificationConfig: NotificationConfig): Promise<void> {
    const id = notificationConfig.id;
    const apiModel = this.toApiWriteModel(notificationConfig);

    return await this.httpNotifications.put(
      `/configs/${id}`,
      JSON.stringify(apiModel),
    );
  }

  async remove(notificationConfig: NotificationConfig): Promise<void> {
    const id = notificationConfig.id;

    return await this.httpNotifications.delete(`/configs/${id}`);
  }

  private toApiWriteModel(
    notification: NotificationConfig,
  ): NotificationApiWriteModel {
    return {
      pipelineId: notification.pipelineId,
      condition: notification.condition,
      type: notification.type,
      parameter: notification.parameters,
    };
  }

  private fromApiReadModel(
    notificationApiModel: NotificationApiReadModel,
  ): NotificationConfig {
    return {
      id: notificationApiModel.id,
      pipelineId: notificationApiModel.pipelineId,
      condition: notificationApiModel.condition,
      type: NotificationType[notificationApiModel.type],
      parameters: notificationApiModel.parameter,
    };
  }

  private fromApiReadModels(
    notificationApiModels: NotificationApiReadModel[],
  ): NotificationConfig[] {
    return notificationApiModels.map(x => this.fromApiReadModel(x));
  }
}
