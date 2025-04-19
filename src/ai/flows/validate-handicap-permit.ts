'use server';

/**
 * @fileOverview Validates if a car parked in a handicap spot has a valid handicap parking permit according to Texas DMV rules.
 *
 * - validateHandicapPermit - A function that validates if a car has a valid handicap parking permit.
 * - ValidateHandicapPermitInput - The input type for the validateHandicapPermit function.
 * - ValidateHandicapPermitOutput - The return type for the validateHandicapPermit function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const ValidateHandicapPermitInputSchema = z.object({
  base64Image: z.string().describe('The base64 encoded image data of the parked car photo.'),
});
export type ValidateHandicapPermitInput = z.infer<typeof ValidateHandicapPermitInputSchema>;

const ValidateHandicapPermitOutputSchema = z.object({
  isValidPermit: z.boolean().describe('Whether the car has a valid handicap parking permit or not.'),
  reason: z.string().optional().describe('The reason why the permit is invalid, if applicable.'),
});
export type ValidateHandicapPermitOutput = z.infer<typeof ValidateHandicapPermitOutputSchema>;

export async function validateHandicapPermit(input: {base64Image: string}): Promise<ValidateHandicapPermitOutput> {
  return validateHandicapPermitFlow(input);
}

const prompt = ai.definePrompt({
  name: 'validateHandicapPermitPrompt',
  input: {
    schema: z.object({
      base64Image: z.string().describe('The base64 encoded image data of the parked car photo.'),
    }),
  },
  output: {
    schema: z.object({
      isValidPermit: z.boolean().describe('Whether the car has a valid handicap parking permit or not.'),
      reason: z.string().optional().describe('The reason why the permit is invalid, if applicable.'),
    }),
  },
  prompt: `You are an expert in Texas DMV handicap parking permit rules.

You will be provided with a photo of a car parked in a handicap spot.

Analyze the image and determine if the car has a valid handicap parking permit according to Texas DMV rules.

If the car does not have a valid permit, explain the reason why.

Photo: {{media url=base64Image contentType="image/jpeg"}}
`,
});

const validateHandicapPermitFlow = ai.defineFlow<
  typeof ValidateHandicapPermitInputSchema,
  typeof ValidateHandicapPermitOutputSchema
>({
  name: 'validateHandicapPermitFlow',
  inputSchema: ValidateHandicapPermitInputSchema,
  outputSchema: ValidateHandicapPermitOutputSchema,
},
async input => {
  const {output} = await prompt(input);
  return output!;
});
