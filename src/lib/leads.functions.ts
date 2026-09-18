import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

// Independent Supabase project (not Lovable Cloud). The anon key is
// publishable by design; inserts are allowed by an RLS INSERT policy on
// public.leads (see the SQL snippet in the project docs).
const SUPABASE_URL = "https://rbamwvttxjmbiflfszfz.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJiYW13dnR0eGptYmlmbGZzemZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk3MzU3MzcsImV4cCI6MjEwNTMxMTczN30.W_WlRSYBSC1hrOa5Cg39bVX2rWJ9rDzW_PmRkWy_S8s";

function supabaseLeads() {
  return createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

const leadSchema = z.object({
  name: z.string().trim().min(1).max(200),
  contact: z.string().trim().min(1).max(200),
  comment: z.string().trim().max(2000).optional().default(""),
});

const DEFAULT_CHAT_ID = "8916545442";

async function sendTelegram(text: string): Promise<string | null> {
  const botToken = process.env["TELEGRAM_BOT_TOKEN"];
  const chatId = process.env["TELEGRAM_CHAT_ID"] || DEFAULT_CHAT_ID;
  if (!botToken) return "TELEGRAM_BOT_TOKEN is not configured";

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    });
    if (!response.ok) {
      const body = await response.text();
      console.error(`Telegram request failed [${response.status}]: ${body}`);
      return `[${response.status}] ${body}`.slice(0, 500);
    }
    const payload = (await response.json()) as { ok?: boolean; description?: string };
    if (payload.ok === false) {
      console.error(`Telegram returned an error: ${payload.description}`);
      return (payload.description ?? "Unknown Telegram error").slice(0, 500);
    }
    return null;
  } catch (error) {
    console.error(error);
    return String(error).slice(0, 500);
  }
}

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => leadSchema.parse(data))
  .handler(async ({ data }) => {
    const db = supabaseLeads();

    const { data: inserted, error } = await db
      .from("leads")
      .insert({ name: data.name, contact: data.contact, comment: data.comment || null })
      .select("id")
      .single();

    if (error) {
      console.error(error);
      throw new Error("Не удалось сохранить заявку");
    }

    const text = [
      "<b>Новая заявка DeepOF</b>",
      `Имя: ${escapeHtml(data.name)}`,
      `Контакт: ${escapeHtml(data.contact)}`,
      data.comment ? `Комментарий: ${escapeHtml(data.comment)}` : "Комментарий: —",
    ].join("\n");

    const telegramError = await sendTelegram(text);

    await db
      .from("leads")
      .update({ telegram_sent: telegramError === null, telegram_error: telegramError })
      .eq("id", inserted.id);

    return { ok: true };
  });
