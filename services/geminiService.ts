

import { GoogleGenAI } from "@google/genai";
import type { Ticket } from '../types';
import { translations } from "../translations";

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini API features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey:"" });


export const summarizeTicket = async (ticket: Ticket, language: 'en' | 'ar'): Promise<string> => {
  if (!process.env.API_KEY) {
    return translations[language].ticketsPage.aiSummaryDisabled;
  }
  
  const conversation = ticket.comments.map(c => `${c.author}: ${c.text}`).join('\n');
  const initialDescription = ticket.descriptionParts.find(p => p.type === 'text')?.content || '';


  const prompt = language === 'ar' ? `
    أنت مساعد ذكي في مكتب دعم فني. قم بتلخيص محادثة تذكرة الدعم التالية في فقرة واحدة موجزة باللغة العربية. 
    ركز على المشكلة الرئيسية والخطوات المتخذة والحالة الحالية.

    عنوان التذكرة: ${ticket.title}
    الوصف الأولي: ${initialDescription}
    
    المحادثة:
    ${conversation}

    ملخص:
  ` : `
    You are an intelligent help desk assistant. Summarize the following support ticket conversation into one concise paragraph in English.
    Focus on the main problem, the steps taken, and the current status.

    Ticket Title: ${ticket.title}
    Initial Description: ${initialDescription}
    
    Conversation:
    ${conversation}

    Summary:
  `;


  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.5,
      }
    });
    return response.text ?? translations[language].ticketsPage.aiSummaryError;
  } catch (error) {
    console.error("Error summarizing ticket with Gemini API:", error);
    return translations[language].ticketsPage.aiSummaryError;
  }
};