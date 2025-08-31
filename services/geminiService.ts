
import { GoogleGenAI, Type } from "@google/genai";

// Initialize AI client with API key
const getAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable not set");
    }
    return new GoogleGenAI({ apiKey });
};

export interface QuestionBank {
  modules: Array<{
    module: number;
    parts: {
      A: string[];
      B: string[];
      C: string[];
    };
  }>;
}

const questionBankSchema = {
  type: Type.OBJECT,
  properties: {
    modules: {
      type: Type.ARRAY,
      description: "An array of 5 modules found in the document.",
      items: {
        type: Type.OBJECT,
        properties: {
          module: { type: Type.INTEGER, description: "The module number (1-5)." },
          parts: {
            type: Type.OBJECT,
            properties: {
              A: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of questions for Part A." },
              B: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of questions for Part B." },
              C: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of questions for Part C." },
            },
            required: ["A", "B", "C"],
          },
        },
        required: ["module", "parts"],
      },
    },
  },
  required: ["modules"],
};

export const parseAndStructureQuestions = async (rawText: string): Promise<QuestionBank> => {
    const model = 'gemini-2.5-flash';
    const prompt = `
        You are an expert text processor. Analyze the following text extracted from a college question bank PDF.
        Your task is to:
        1. Clean the text by removing any headers, footers, page numbers, course codes, subject names, and any other irrelevant metadata.
        2. Identify the questions and structure them into exactly 5 modules.
        3. For each module, categorize the questions into "Part A", "Part B", and "Part C".
        4. If a part (A, B, or C) or a module is missing or cannot be identified, return an empty array for its questions. Ensure the top-level structure always contains 5 modules, each with parts A, B, and C.

        Return ONLY a valid JSON object that adheres to the provided schema. Do not include any explanatory text before or after the JSON.

        Here is the raw text:
        ---
        ${rawText}
        ---
    `;

    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: questionBankSchema,
            },
        });

        if (!response.text) {
            throw new Error("No response text received from AI model");
        }
        const jsonString = response.text.trim();
        const parsedJson = JSON.parse(jsonString);
        
        if (!parsedJson.modules || !Array.isArray(parsedJson.modules)) {
            throw new Error("Invalid JSON structure: 'modules' array not found.");
        }

        return parsedJson as QuestionBank;
    } catch (error) {
        console.error("Error parsing and structuring questions:", error);
        
        // Provide more specific error messages
        if (error instanceof Error) {
            if (error.message.includes('API_KEY') || error.message.includes('GEMINI_API_KEY')) {
                throw new Error("Gemini API key not configured. Please check your environment variables.");
            } else if (error.message.includes('network') || error.message.includes('fetch')) {
                throw new Error("Network error. Please check your internet connection and try again.");
            } else if (error.message.includes('quota') || error.message.includes('limit')) {
                throw new Error("API quota exceeded. Please try again later or check your Gemini API usage.");
            }
        }
        
        throw new Error("Failed to parse the document with AI. The document might be malformed, too long, or contain unsupported content. Please try with a different document.");
    }
};


const detailedAnswerPrompt = `
You are an expert academic assistant creating a study guide from a list of questions.
Your task is to provide concise answers for college semester exam questions, each worth 7 marks.

**Answering Guidelines:**
1. **Structure:** Use 3-5 bullet points for questions not requiring tables. For questions about differences, comparisons, or best suited for tables, provide ONLY a Markdown table (no bullet points).
2. **Detail:** Answers must be concise, clear, and comprehensive, covering key points within the word limit.
3. **Tables:** For applicable questions, use a Markdown table with relevant columns (e.g., Aspect, Description, Impact).
4. **Diagrams:** If a question mentions a diagram, state only the diagram's name and a fictional reference, e.g., "Diagram: [Name], Reference: [Source/Textbook Name]".
5. **Tone:** Maintain an academic and formal tone.
6. **Formatting:** Use Markdown for all formatting. Do not use HTML or other formats.

**Example Answer Format:**
---
### 1.How can NLP be used to enhance educational applications?
- **Automated grading:** Analyzes essays for content and grammar.
- **Personalized learning:** Adapts content to student levels.
- **Chatbots:** Provides 24/7 student query support.
- Diagram: NLP Workflow, Reference: AI Systems, 2nd Ed.

### 2.What are the limitations of NLP in education?

| Aspect      | Description                      | Impact                          |
|-------------|----------------------------------|---------------------------------|
| Accuracy    | Struggles with slang terms.      | Misinterpretations in grading.  |
| Data Needs  | Requires large datasets.         | Ineffective with noisy data.   |
| Cost        | High computational costs.        | Limits institutional adoption. |
---
`;

const groupingPrompt = `
Analyze the following list of questions and group them into logical categories based on their content and theme. Arrange questions within each group in a sequence that follows a natural flow.

After grouping, generate concise answers for EACH question using the provided guidelines.

Present the final output in the following Markdown format, starting with the highest-level heading '# Grouped Questions and Answers':

# Grouped Questions and Answers
---
### Group 1: [A concise name for Group 1]
1. **[Full Question 1 Text]**
    - [Point 1
    - [Point 2]
    ...

2. **[Full Question 2 Text]**
    - [Point 1]
    - [Point 2]
    ...

---
### Group 2: [A concise name for Group 2]
1. **[Full Question 1 Text]**
    - [Point 1]
    - [Point 2]
    ...
---
(and so on for all groups)

Here are the questions to process:
`;

const noGroupingPrompt = `
Generate concise answers for the following questions, following the provided guidelines for each. Present them one after another, each starting with a '####' heading for the question. Ensure each answer is concise and comprehensive with proper spacing.

**Format each question as follows:**

#### [Question Text]
- [Point 1]
- [Point 2]
- [Point 3]

Here are the questions to process:
`;

export const generateSolution = async (
    questions: string, 
    group: boolean, 
    moduleInfo?: { moduleNumber: number; selectedParts: string[] }
): Promise<string> => {
    const model = 'gemini-2.5-flash';
    
    // Create structured prompt for part-based solutions (non-grouping)
    const structuredPartPrompt = `
You are an expert academic assistant creating a study guide from a list of questions organized by parts.
Your task is to provide concise answers for college semester exam questions, each worth 7 marks.

**Answering Guidelines:**
1. **Structure:** Use 3-5 bullet points for questions not requiring tables. For questions about differences, comparisons, or best suited for tables, provide ONLY a Markdown table (no bullet points).
2. **Detail:** Answers must be concise, clear, and comprehensive, covering key points within the word limit.
3. **Tables:** For applicable questions, use a Markdown table with relevant columns (e.g., Aspect, Description, Impact).
4. **Diagrams:** If a question mentions a diagram, state only the diagram's name and a fictional reference, e.g., "Diagram: [Name], Reference: [Source/Textbook Name]".
5. **Tone:** Maintain an academic and formal tone.
6. **Formatting:** Use Markdown for all formatting. Do not use HTML or other formats.

**IMPORTANT: Structure the output with clear part separations and restart question numbering for each part.**

**Required Output Format:**
# Module ${moduleInfo?.moduleNumber || 'X'} Solutions

${moduleInfo?.selectedParts.map(part => `## Part ${part} Solutions`).join('\n\n')}

**For each part, start question numbering from 1 and format as follows:**

### 1. [Question Text]
- [Point 1]
- [Point 2]
- [Point 3]

### 2. [Question Text]
- [Point 1]
- [Point 2]
- [Point 3]

---

Here are the questions to process, organized by parts:
${questions}

**Remember:** 
- Start each part with "## Part X Solutions"
- Restart question numbering from 1 for each part
- Use "###" for question headings
- Maintain consistent formatting throughout
- The questions are already divided by parts with clear separators (--- PART X ---)
- Use the part divisions exactly as shown in the input
- Each part should have its own section with numbering starting from 1
`;

    // Create the appropriate prompt based on grouping preference
    let fullPrompt: string;
    
    if (group) {
        // Use grouping prompt when grouping is selected (ignore part-based structure)
        fullPrompt = `${detailedAnswerPrompt}\n${groupingPrompt}\n${questions}`;
    } else if (moduleInfo && moduleInfo.selectedParts.length > 1) {
        // Use structured part-based prompt for multiple parts (non-grouping)
        fullPrompt = structuredPartPrompt;
    } else {
        // Use no grouping prompt for single part (non-grouping)
        fullPrompt = `${detailedAnswerPrompt}\n${noGroupingPrompt}\n${questions}`;
    }
    
    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: model,
            contents: fullPrompt,
        });

        if (!response.text) {
            throw new Error("No response text received from AI model");
        }
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        
        // Provide more specific error messages
        if (error instanceof Error) {
            if (error.message.includes('API_KEY') || error.message.includes('GEMINI_API_KEY')) {
                throw new Error("Gemini API key not configured. Please check your environment variables.");
            } else if (error.message.includes('network') || error.message.includes('fetch')) {
                throw new Error("Network error. Please check your internet connection and try again.");
            } else if (error.message.includes('quota') || error.message.includes('limit')) {
                throw new Error("API quota exceeded. Please try again later or check your Gemini API usage.");
            } else if (error.message.includes('content') || error.message.includes('safety')) {
                throw new Error("Content blocked by safety filters. Please try with different content.");
            }
        }
        
        throw new Error("Failed to communicate with the AI model. Please check your API key and try again.");
    }
};
