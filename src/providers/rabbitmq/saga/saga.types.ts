export const SAGA_STEP_SEND_TO_PRODUCTION = "send_to_production";

export interface SagaCompensatePayload {
  sagaId: string;
  workOrderId: number;
  step: string;
  timestamp?: string;
  reason?: string;
  failedStep?: string;
}
