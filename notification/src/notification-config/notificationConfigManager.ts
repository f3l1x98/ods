import { NotificationConfig } from './notificationConfig';
import { NotificationRepository } from './notificationRepository';

export class NotificationConfigManager {
  constructor(private readonly repository: NotificationRepository) {}

  async getForPipeline(pipelineId: number): Promise<NotificationConfig[]> {
    return this.repository.getForPipeline(pipelineId);
  }

  async getById(id: number): Promise<NotificationConfig | undefined> {
    return this.repository.getById(id);
  }

  async getAll(): Promise<NotificationConfig[]> {
    return this.repository.getAll();
  }

  async create(config: NotificationConfig): Promise<NotificationConfig> {
    return this.repository.create(config);
  }

  async update(
    id: number,
    config: NotificationConfig,
  ): Promise<NotificationConfig> {
    return this.repository.update(id, config);
  }

  async delete(id: number): Promise<void> {
    return this.repository.delete(id);
  }
}
