import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler
} from "aws-lambda";
import { TelegramService } from "@app/services/telegram-service";

const telegram = new TelegramService();

export const handler: Handler<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
> = async (event, context) => {
  console.log(event, context);

  const body = JSON.parse(event.body ?? "{}");

  if (isChangeCommand(body)) {
    await sendChangeQuestion(body);
  } else if (body.callback_query.message.data) {
    console.log("publicar no tópico mqtt");
  } else {
    await telegram.sendMessage(
      `Comando ou mensagem inválida`,
      body.message?.chat?.id
    );
  }

  return { statusCode: 200, body: "success" };
};

async function sendChangeQuestion(body: any) {
  const person = body?.message?.text.split(" ")[1];

  console.log("mudando estado do cara X");

  await telegram.sendMessageWithMarkup(
    `Você deseja ligar ou desligar?`,
    {
      inline_keyboard: [
        [
          {
            text: "Ligar",
            callback_data: `/ligar/${person}`
          },
          {
            text: "Desligar",
            callback_data: `/desligar/${person}`
          }
        ]
      ]
    },
    body.message?.chat?.id
  );
}

function isChangeCommand(body: any) {
  const value = body?.message?.text ?? "";

  return (
    value &&
    /\/mudarestado/.test(value) &&
    /^\/mudarestado [a-zA-Z]+$/.test(value)
  );
}
