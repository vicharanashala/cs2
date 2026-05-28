import { Request, Response } from "express";
import { BaseController } from "../../core/base/BaseController";
import { RagService } from "./rag.service";
import { ChatbotService } from "./chatbot.service";
import { FaqRepository } from "../faq/faq.repository";
import { EmbeddingService } from "../faq/embedding.service";
import { asyncHandler } from "../../core/utils/asyncHandler";
import { validate } from "../../core/middleware/validate.middleware";
import { sendSuccess } from "../../core/utils/response";
import { Messages } from "../../core/constants/messages";
import { AskQuestionDto, ChatbotDto, ClearSessionDto } from "./chat.interface";

export class ChatController extends BaseController {
  private readonly ragService: RagService;
  private readonly chatbotService: ChatbotService;

  constructor() {
    super();
    const faqRepo = new FaqRepository();
    const embeddingService = new EmbeddingService();
    this.ragService = new RagService(faqRepo, embeddingService);
    this.chatbotService = new ChatbotService(this.ragService);
    this.registerRoutes();
  }

  protected registerRoutes(): void {
    // Direct RAG query (stateless)
    this.router.post(
      "/ask",
      validate(AskQuestionDto),
      asyncHandler(this.ask.bind(this)),
    );

    // Multi-turn chatbot (stateful sessions)
    this.router.post(
      "/chatbot",
      validate(ChatbotDto),
      asyncHandler(this.chatbot.bind(this)),
    );

    this.router.post(
      "/chatbot/clear",
      validate(ClearSessionDto),
      asyncHandler(this.clearSession.bind(this)),
    );
  }

  private async ask(req: Request, res: Response): Promise<void> {
    const result = await this.ragService.ask(req.body.question);
    sendSuccess(res, result, Messages.SUCCESS);
  }

  private async chatbot(req: Request, res: Response): Promise<void> {
    const { question, sessionId } = req.body;
    const result = await this.chatbotService.chat(question, sessionId);
    sendSuccess(res, result, Messages.SUCCESS);
  }

  private async clearSession(req: Request, res: Response): Promise<void> {
    this.chatbotService.clearSession(req.body.sessionId);
    sendSuccess(res, null, Messages.SESSION_CLEARED);
  }
}
