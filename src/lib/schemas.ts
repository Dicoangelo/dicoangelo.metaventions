import { z } from 'zod';

/**
 * Schema for chat messages
 */
export const chatMessageSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string()
        .min(1, 'Message content cannot be empty')
        .max(4000, 'Message content too long (max 4000 characters)'),
    })
  ).min(1, 'At least one message is required'),
  isVoice: z.boolean().optional().default(false),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;

/**
 * Schema for job description analyzer
 */
export const jdAnalyzerSchema = z.object({
  jd_text: z.string()
    .min(50, 'Job description must be at least 50 characters')
    .max(20000, 'Job description too long (max 20,000 characters)'),
  session_id: z.string().optional(),
});

export type JDAnalyzer = z.infer<typeof jdAnalyzerSchema>;

/**
 * Schema for TTS requests
 */
export const ttsSchema = z.object({
  text: z.string()
    .min(1, 'Text cannot be empty')
    .max(5000, 'Text too long (max 5000 characters for TTS)'),
});

export type TTS = z.infer<typeof ttsSchema>;

/**
 * Helper function to format Zod validation errors into readable messages
 */
export function formatZodError(error: z.ZodError<any>): string {
  const firstError = error.issues[0];
  if (firstError) {
    return firstError.message;
  }
  return 'Invalid input';
}

/**
 * Helper function to validate and return parsed data or error response
 */
export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      error: formatZodError(result.error),
    };
  }

  return {
    success: true,
    data: result.data,
  };
}
