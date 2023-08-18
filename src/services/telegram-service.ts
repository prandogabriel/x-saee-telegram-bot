import axios, { AxiosInstance } from "axios";

export interface ResultMessage {
  ok: boolean;
  result: Result;
}

export interface Result {
  message_id: number;
  from: From;
  chat: Chat;
  date: number;
  text: string;
}

export interface From {
  id: number;
  is_bot: boolean;
  first_name: string;
  username: string;
}

export interface Chat {
  id: number;
  title: string;
  type: string;
  all_members_are_administrators: boolean;
}

export class TelegramService {
  protected readonly api: AxiosInstance;

  private baseUrl?: string;

  private token?: string;

  constructor() {
    this.token = process.env.BOT_TELEGRAM_TOKEN!;
    this.baseUrl = process.env.TELEGRAM_API_URL!;

    if (!this.token || !this.baseUrl) {
      throw new Error("Credentials not configured");
    }

    this.api = axios.create({ baseURL: `${this.baseUrl}/bot${this.token}` });
  }

  public async sendMessage(
    text: string,
    chatId: string
  ): Promise<ResultMessage> {
    const { data } = await this.api.get<ResultMessage>("/sendMessage", {
      data: {
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        reply_markup: {
          keyboard: [
            ["uno :+1:"],
            ["uno \ud83d\udc4d", "due"],
            ["uno", "due", "tre"],
            ["uno", "due", "tre", "quattro"]
          ]
        }
      }
    });

    return data;
  }
}
