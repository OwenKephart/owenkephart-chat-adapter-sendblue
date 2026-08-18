import type { Logger } from "chat";
import SendblueAPI from "sendblue";
import { SendblueAdapter } from "./adapter";
import type {
  SendblueAdapterConfig,
  SendblueAccessTokenCredentials,
  SendblueCredentials,
  SendblueCredentialsProvider,
  SendblueKeyPairCredentials,
  SendblueWebhookVerifier,
} from "./types";

export { SendblueAdapter } from "./adapter";
export { toPlainText } from "./format-converter";
export type {
  SendblueAdapterConfig,
  SendblueAccessTokenCredentials,
  SendblueCredentials,
  SendblueCredentialsProvider,
  SendblueKeyPairCredentials,
  SendblueMessagePayload,
  SendblueWebhookVerifier,
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
  const defaultFromNumber =
    options.defaultFromNumber ?? process.env.SENDBLUE_FROM_NUMBER;
  if (!defaultFromNumber) {
    throw new Error(
      "Sendblue from_number is required. Pass it in config or set SENDBLUE_FROM_NUMBER.",
    );
  }
  const allowedFromNumbers =
    options.allowedFromNumbers ??
    (typeof defaultFromNumber === "string"
      ? [defaultFromNumber]
      : defaultFromNumber);

  const apiKey = options.apiKey ?? process.env.SENDBLUE_API_KEY;
  const apiSecret = options.apiSecret ?? process.env.SENDBLUE_API_SECRET;
  if (!options.credentials && !apiKey) {
    throw new Error(
      "Sendblue API key is required. Pass it in config or set SENDBLUE_API_KEY.",
    );
  }
  if (!options.credentials && !apiSecret) {
    throw new Error(
      "Sendblue API secret is required. Pass it in config or set SENDBLUE_API_SECRET.",
    );
  }

  return new SendblueAdapter({
    defaultFromNumber,
    ...(options.credentials
      ? { credentials: options.credentials }
      : { sdk: new SendblueAPI({ apiKey, apiSecret }) }),
    webhookSecret: options.webhookSecret ?? process.env.SENDBLUE_WEBHOOK_SECRET,
    webhookSecretHeader: options.webhookSecretHeader,
    webhookVerifier: options.webhookVerifier,
    statusCallbackUrl:
      options.statusCallbackUrl ?? process.env.SENDBLUE_STATUS_CALLBACK_URL,
    allowedServices: options.allowedServices,
    allowedFromNumbers,
    logger: options.logger,
  });
}
