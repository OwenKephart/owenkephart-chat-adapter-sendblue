import type { Logger } from "chat";
import { SendblueAdapter } from "./adapter";
import type {
  SendblueAdapterConfig,
  SendblueCredentials,
  SendblueCredentialsProvider,
} from "./types";

export { SendblueAdapter } from "./adapter";
export { toPlainText } from "./format-converter";
export type {
  SendblueAdapterConfig,
  SendblueCredentials,
  SendblueCredentialsProvider,
  SendblueMessagePayload,
  SendblueReaction,
  SendblueService,
  SendblueThreadId,
  SendblueTypingPayload,
} from "./types";
export { REACTION_ALIASES, VALID_REACTIONS } from "./types";

export type SendblueAdapterOptions = Partial<SendblueAdapterConfig> & {
  credentials?: SendblueCredentialsProvider;
  logger?: Logger;
};

export function createSendblueAdapter(
  options: SendblueAdapterOptions = {},
): SendblueAdapter {
  return new SendblueAdapter({
    credentials:
      options.credentials ??
      (() => ({
        apiKey: options.apiKey ?? process.env.SENDBLUE_API_KEY ?? "",
        apiSecret: options.apiSecret ?? process.env.SENDBLUE_API_SECRET ?? "",
        defaultFromNumber:
          options.defaultFromNumber ?? process.env.SENDBLUE_FROM_NUMBER ?? "",
      })),
    webhookSecret: options.webhookSecret ?? process.env.SENDBLUE_WEBHOOK_SECRET,
    webhookSecretHeader: options.webhookSecretHeader,
    statusCallbackUrl:
      options.statusCallbackUrl ?? process.env.SENDBLUE_STATUS_CALLBACK_URL,
    allowedServices: options.allowedServices,
    logger: options.logger,
  });
}
