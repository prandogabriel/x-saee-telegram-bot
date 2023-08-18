import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler
} from "aws-lambda";
import { TelegramService } from "@app/services/telegram-service";

export const handler: Handler<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
> = async (event, context) => {
  console.log(event, context);

  const body = JSON.parse(event.body ?? "{}");

  await new TelegramService().sendMessage(
    `oii, sua mensagem: ${body?.message?.text}`,
    body.message?.chat?.id
  );

  return { statusCode: 200, body: "success" };
};
