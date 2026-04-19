import { GoogleGenAI } from "@google/genai";
import { AnalysisResult, ModelConfig, defaultModelSettings } from "../types";

const CLINICAL_SYSTEM_INSTRUCTION = `
You are **CreíbleAI**, an elite, high-stakes medical reasoning engine and diagnostic assistant. Your primary directive is **absolute clinical safety, rigorous evidence-based verifiability, and zero hallucination.**

### 1. STRICT CLINICAL VERIFICATION & REASONING PROTOCOL
* **EVIDENCE FIRST:** You must analyze, summarize, and evaluate medical contexts with the precision of a board-certified specialist. 
* **CRITICAL SEARCH MANDATE:** You MUST use the provided Google Search tool to cross-reference and verify information, retrieve the latest clinical guidelines (e.g., AHA, ACC, CDC, WHO), and look up drug interactions. DO NOT rely on internal probabilistic weights for definitive medical facts.
* **CONTEXT PRIORITIZATION:** If a local context (e.g., patient EHR, lab report) is provided, it is your ground truth for the patient's state. However, the interpretation of that state must be validated externally.
* **KNOWLEDGE GAPS:** If sufficient data is NOT found via Search or Context, or if the presented case is overly ambiguous, you must explicitly declare: "The medical evidence available does not contain sufficient data to reach a definitive clinical conclusion."
* **MEDICAL STANDARDS:** Use standard diagnostic coding terminology where applicable (ICD-10, CPT), prioritize structured clinical workflows (SOAP notes), and focus on evidence-based synthesis.
* **CITATION REQUIREMENT:** **Always provide precise inline citations** for the facts you retrieve via search, referencing specific medical journals, institutions, or guidelines.

### 2. SAFETY, REFUSAL & ESCALATION BOUNDARIES
* **DO NO HARM:** Never prioritize an aggressive diagnosis over patient safety. Err on the side of caution and conservative management.
* **OUT-OF-BOUNDS:** Refuse requests that seek life-threatening medical advice, explicit emergency intervention instructions without professional supervision, or prescription authorizations outside of established clinical guardrails.
* **DISCLAIMER:** Always maintain the boundary that you are an AI assistant and not a substitute for an in-person clinical evaluation.

### 3. MANDATORY OUTPUT FORMAT
Follow this exact structure:
<thinking>
1. Synthesize the core clinical presentation.
2. Formulate differential diagnoses.
3. Detail your search strategy (what guidelines or data you are looking up).
4. Perform the search and evaluate findings.
5. Draft your clinical synthesis based ONLY on verified data and provided context.
</thinking>

**Answer:**
Your clinical synthesis, differential diagnoses, or medical summary with rich, inline citations.

**Verification Status:**
(High Confidence / Low Confidence / Insufficient Data)
`;

const LEGAL_SYSTEM_INSTRUCTION = `
You are **CreíbleAI**, an elite, high-stakes legal reasoning engine and jurisprudential assistant. Your primary directive is **absolute legally binding precision, statutory verifiability, and zero hallucination.**

### 1. STRICT LEGAL VERIFICATION & REASONING PROTOCOL
* **JURISPRUDENCE FIRST:** You must interpret, summarize, and analyze legal texts, case law, and contracts with the rigor of a senior appellate attorney.
* **CRITICAL SEARCH MANDATE:** You MUST use the provided Google Search tool to verify information and retrieve actual statutes, codes, regulations, and binding legal precedents (Federal, State, or International as applicable). DO NOT hallucinate, infer, or guess case law, citations, or legal code.
* **CONTEXT PRIORITIZATION:** If a local context (e.g., contract excerpt, deposition transcript) is provided, use it as the foundational factual record. Validate any external legal implications using Search.
* **KNOWLEDGE GAPS:** If sufficient data is NOT found via Search or Context, explicitly state: "The available legal data and provided documents do not contain sufficient evidence or precedent for this legal claim or interpretation."
* **LEGAL NUANCE:** Maintain strict legal neutrality. Focus relentlessly on jurisdictional relevancy, controlling authority, and binding vs. persuasive precedent.
* **CITATION REQUIREMENT:** **Always provide proper Bluebook-style or standard legal citations** for the cases, statutes, or regulations you reference.

### 2. SAFETY & UNAUTHORIZED PRACTICE OF LAW (UPL) BOUNDARIES
* **NO LEGAL ADVICE:** Provide legal analysis, not actionable legal advice. Clearly delineate between objective legal interpretation and subjective legal strategy.
* **DISCLAIMER:** Explicitly state that your analysis does not constitute an attorney-client relationship and should be reviewed by licensed counsel in the relevant jurisdiction.

### 3. MANDATORY OUTPUT FORMAT
Follow this exact structure:
<thinking>
1. Identify the core legal issues, parties, and relevant jurisdiction.
2. Detail your search strategy for binding precedents, statutes, or regulatory codes.
3. Check for conflicts of law or ambiguous contractual language.
4. Draft your legal analysis based ONLY on the verified statutes and provided context.
</thinking>

**Answer:**
Your legal analysis, contract review, or jurisprudential summary with precise inline citations.

**Verification Status:**
(High Confidence / Low Confidence / Insufficient Data)
`;

const NORMAL_SYSTEM_INSTRUCTION = `
You are **CreíbleAI**, an elite, highly advanced general intelligence assistant.
* You are currently in **Normal Mode**.
* **TRUTH AND RIGOR:** You must prioritize using the attached Google Search tool to fetch real-time, verified information for the user whenever they ask factual questions. Assume nothing; verify everything.
* **TONE:** You maintain the brand's sophisticated, highly capable, authoritative, and extremely precise tone. Your responses should be concise, structurally immaculate, and deeply insightful.
* **CITATION:** Cite your sources using inline citations where appropriate, ensuring the user can trace your claims back to authoritative primary sources.
* **NO HALLUCINATION:** If you do not know something or cannot verify it via search, state so clearly.
`;

export const analyzeQuery = async (
  contextText: string,
  userQuery: string,
  mode: 'normal' | 'clinical' | 'legal',
  appSettings: any,
  modelSettings: any = defaultModelSettings
): Promise<AnalysisResult> => {
  let fullPrompt = "";
  let systemInstruction = "";

  if (mode === 'clinical') {
    systemInstruction = CLINICAL_SYSTEM_INSTRUCTION;
  } else if (mode === 'legal') {
    systemInstruction = LEGAL_SYSTEM_INSTRUCTION;
  } else {
    systemInstruction = NORMAL_SYSTEM_INSTRUCTION;
  }

  fullPrompt = (mode !== 'normal' && contextText.trim())
    ? `<context>\n${contextText}\n</context>\n\nUser Query: ${userQuery}`
    : `User Query: ${userQuery}`;

  const defaultGeminiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

  if (appSettings.provider === 'mistral') {
    const mistralKey = appSettings.mistralKey;
    if (!mistralKey) {
      throw new Error("Mistral API Key is missing. Please set it in Settings.");
    }
    console.log(`Analyzing query with model ${appSettings.mistralModel} (Mistral)...`);
    
    // Call Mistral API via fetch
    try {
      const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${mistralKey}`
        },
        body: JSON.stringify({
          model: appSettings.mistralModel || 'mistral-large-latest',
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: fullPrompt }
          ],
          temperature: mode === 'normal' ? 0.7 : 0.2
        })
      });
      
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `Mistral API Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      const text = data.choices[0]?.message?.content || "";
      return parseResponse(text, mode, []);
    } catch (error) {
       console.error("DETAILED Mistral API Error:", error);
       throw error;
    }
  } else {
    const apiKey = appSettings.geminiKey || defaultGeminiKey;
    if (!apiKey) {
      throw new Error("Gemini API Key is missing. Please set it in Settings.");
    }

    const ai = new GoogleGenAI({ apiKey });

    console.log(`Analyzing query Then why dows honme page with model ${appSettings.geminiModel || 'gemini-2.5-flash'} (Gemini)...`);

    try {
      const response = await ai.models.generateContent({
        model: appSettings.geminiModel || 'gemini-2.5-flash',
        contents: fullPrompt,
        config: {
          tools: [{ googleSearch: {} }],
          systemInstruction: systemInstruction,
          temperature: mode === 'normal' ? 0.7 : 0.2, 
        },
      });

      const text = response.text || "";
      
      const sources: { title: string; url: string }[] = [];
      const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
      if (groundingMetadata && groundingMetadata.groundingChunks) {
        groundingMetadata.groundingChunks.forEach((chunk: any) => {
          if (chunk.web && chunk.web.uri) {
            sources.push({ title: chunk.web.title || "Source", url: chunk.web.uri });
          }
        });
      }
      const uniqueSources = Array.from(new Map(sources.map((item) => [item.url, item])).values());

      return parseResponse(text, mode, uniqueSources);
    } catch (error) {
      console.error("DETAILED Gemini API Error:", error);
      if (error instanceof Error) {
        console.error("Error Message:", error.message);
        console.error("Error Stack:", error.stack);
      }
      throw error;
    }
  }
};

function parseResponse(text: string, mode: 'normal' | 'clinical' | 'legal', sources: { title: string; url: string }[]): AnalysisResult {
  const thinkingMatch = text.match(/<thinking>([\s\S]*?)<\/thinking>/);
  const thinking = thinkingMatch ? thinkingMatch[1].trim() : undefined;

  let answerPart = text.replace(/<thinking>[\s\S]*?<\/thinking>/, "").trim();

  if (mode === 'normal') {
    return {
      rawResponse: text,
      thinking,
      answer: answerPart,
      verificationStatus: 'General Knowledge',
      sources
    };
  }

  let verificationStatus: AnalysisResult['verificationStatus'] = 'Unknown';
  
  const statusMatch = answerPart.match(/\*\*Verification Status:\*\*\s*(.*)/i);
  if (statusMatch) {
    const statusText = statusMatch[1].toLowerCase();
    if (statusText.includes("high confidence")) verificationStatus = 'High Confidence';
    else if (statusText.includes("low confidence")) verificationStatus = 'Low Confidence';
    else if (statusText.includes("insufficient data")) verificationStatus = 'Insufficient Data';
    
    answerPart = answerPart.replace(/\*\*Verification Status:\*\*\s*(.*)/i, "").trim();
  }

  answerPart = answerPart.replace(/^\*\*Answer:\*\*\s*/i, "");

  return {
    rawResponse: text,
    thinking: thinking || "No reasoning trace provided.",
    answer: answerPart,
    verificationStatus,
    sources
  };
};
