import { ChatOllama } from '@langchain/ollama';
import { HumanMessage } from '@langchain/core/messages';
import { v4 as uuidv4 } from 'uuid';
import { BaseService } from '../../core/base/BaseService';
import { RagService } from './rag.service';
import { ChatSession, ChatbotResult } from './chat.interface';

const MAX_HISTORY = 10;

const CHATBOT_PROMPT = (ragAnswer: string, history: string, question: string): string => `\
You are a helpful FAQ assistant.
Use the FAQ answer and conversation history below to answer the user's question naturally.
Use conversation history to understand follow-up questions and references like "they", "it", "that".
Only say "I could not find relevant information" if the answer has absolutely nothing related.

FAQ Answer from knowledge base:
${ragAnswer}

Conversation History:
${history}

User Question: ${question}

Answer:`;

export class ChatbotService extends BaseService {
  private readonly sessions = new Map<string, ChatSession>();
  private readonly llm: ChatOllama;

  constructor(private readonly ragService: RagService) {
    super();
    this.llm = new ChatOllama({ model: 'llama3.2', temperature: 0.3 });
  }

  async chat(question: string, sessionId?: string): Promise<ChatbotResult> {
    const sid = sessionId ?? uuidv4();

    if (!this.sessions.has(sid)) {
      this.sessions.set(sid, { history: [] });
    }

    const session = this.sessions.get(sid)!;
    const { answer: ragAnswer, sources } = await this.ragService.ask(question);

    let finalAnswer: string;

    // No sources OR no history — return RAG answer directly
    if (sources.length === 0 || session.history.length === 0) {
      finalAnswer = ragAnswer;
    } else {
      // Re-invoke LLM with history for context-aware multi-turn response
      const historyText = session.history
        .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
        .join('\n');

      const response = await this.llm.invoke([
        new HumanMessage(CHATBOT_PROMPT(ragAnswer, historyText, question)),
      ]);

      finalAnswer =
        typeof response.content === 'string'
          ? response.content
          : JSON.stringify(response.content);
    }

    // Update session history
    session.history.push(
      { role: 'user', content: question },
      { role: 'assistant', content: finalAnswer },
    );

    // Trim to keep last N messages
    if (session.history.length > MAX_HISTORY) {
      session.history = session.history.slice(-MAX_HISTORY);
    }

    return { answer: finalAnswer, sources, sessionId: sid };
  }

  clearSession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }
}
