import {
  IoTDataPlaneClient,
  PublishCommand,
  UpdateThingShadowCommand
} from "@aws-sdk/client-iot-data-plane";

export class IoTService {
  private iotData: IoTDataPlaneClient;

  constructor(private topic?: string) {
    this.iotData = new IoTDataPlaneClient({
      endpoint: process.env.AWS_IOT_ENDPOINT!,
      region: process.env.AWS_ACCOUNT_REGION || "us-east-1"
    });
  }

  async publishMessage(message: Object, topic?: string): Promise<void> {
    const command = new PublishCommand({
      topic: (topic || this.topic) as string,
      payload: JSON.stringify(message),
      qos: 0
    });

    await this.iotData.send(command);
  }

  async updateThingShadow(shadow: string, powerOn: string) {
    const command = new UpdateThingShadowCommand({
      thingName: "saee",
      shadowName: shadow,
      payload: JSON.stringify({
        state: {
          desired: {
            welcome: "aws-iot",
            powerOn
          },
          reported: {
            welcome: "aws-iot",
            powerOn
          }
        }
      })
    });

    const result = await this.iotData.send(command);

    console.log(result);
  }
}
