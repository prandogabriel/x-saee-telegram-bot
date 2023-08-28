import IotData from "aws-sdk/clients/iotdata";

export class IoTService {
  private iotData: IotData;

  constructor(private topic?: string) {
    this.iotData = new IotData({
      endpoint: process.env.AWS_IOT_ENDPOINT!,
      region: process.env.AWS_ACCOUNT_REGION || "us-east-1"
    });
  }

  async publishMessage(message: Object, topic?: string): Promise<void> {
    const params = {
      topic: (topic || this.topic) as string,
      payload: JSON.stringify(message),
      qos: 0
    };
    await this.iotData.publish(params).promise();
  }
}

// const ioTService = new IoTService();

// ioTService.publishMessage("test", { test: "Hello World" });
