import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler
} from "aws-lambda";
import { TelegramService } from "@app/services/telegram-service";
import { IoTService } from "@app/services/iot-service";

const telegram = new TelegramService();
const iotService = new IoTService();

export const handler: Handler<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
> = async (event, context) => {
  console.log(event, context);

  const body = JSON.parse(event.body ?? "{}");

  if (isChangeCommand(body)) {
    await sendChangeQuestion(body);
  } else if (body?.callback_query?.data) {
    const params = body?.callback_query?.data?.split(" ");

    console.log({ params });

    await iotService.publishMessage(params[1] || 0, params[0]);

    console.log("publicado");
    await telegram.sendMessage(
      `<b>Comando enviado.</b>`,
      body?.message?.chat?.id || body?.callback_query?.message?.chat?.id
    );
  } else {
    await telegram.sendMessage(
      `<b>Comando ou mensagem inválida.</b>`,
      body?.message?.chat?.id || body?.callback_query?.message?.chat?.id
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
            callback_data: `/luz/${person} 1`
          },
          {
            text: "Desligar",
            callback_data: `/luz/${person} 0`
          }
        ]
      ]
    },
    body?.message?.chat?.id
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
