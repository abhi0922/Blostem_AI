let groq = null;

try {
  const Groq = require('groq');
  groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || '',
  });
} catch (e) {
  console.log('Groq SDK initialization issue, using mock mode');
}

const generateCompletion = async (prompt, systemPrompt = 'You are a helpful assistant.') => {
  if (!groq || !process.env.GROQ_API_KEY) {
    console.log('Using mock response (no Groq API key configured)');
    return getMockResponse(prompt);
  }

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1024,
    });
    
    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Groq API error:', error.message);
    return getMockResponse(prompt);
  }
};

const getMockResponse = (prompt) => {
  if (prompt.toLowerCase().includes('lead')) {
    return `Based on the company signals, this is a high-intent lead with strong engagement probability.

**Lead Score: 85/100**
**Engagement Probability: 78%**
**Best Contact Time: Tuesday 10AM**
**Recommended Action: Call Now**

**Why this lead:**
- Recent funding round indicates growth capital available
- High hiring trend suggests scaling phase with technology needs
- Fintech industry alignment with your product
- Multiple signals indicating active vendor evaluation`;
  }
  if (prompt.toLowerCase().includes('email')) {
    return `Subject: Quick question about {{company}}'s growth

Hi {{name}},

I noticed {{company}}'s recent funding and impressive trajectory. We're helping fintech companies like yours streamline operations and accelerate growth.

With your role as {{role}}, I imagine you're focused on scaling infrastructure while maintaining quality.

Would you be open to a quick 15-minute call to explore if we could help?

Best,
Blostem Team`;
  }
  if (prompt.toLowerCase().includes('persona')) {
    return `**Persona Profile:**

- **Background**: Technical leader with 10+ years experience, likely from a fast-growing startup or enterprise
- **Priorities**: Scalability, developer experience, ROI on technology investments
- **Pain Points**: Technical debt, legacy systems, scaling challenges
- **Communication Style**: Direct, data-driven, prefers specifics over vague promises
- **Decision Factors**: Proven ROI, customer references, technical fit`;
  }
  return 'AI-generated response based on the input provided. Configure GROQ_API_KEY for real AI responses.';
};

const generateLeadAnalysis = async (companyData) => {
  const prompt = `Analyze this company and provide AI-driven insights:
Company: ${companyData.company}
Industry: ${companyData.industry}
Funding: ${companyData.funding}
Hiring Trend: ${companyData.hiringTrend}
Signals: ${companyData.signals.join(', ')}

Provide:
1. A lead score (0-100)
2. Engagement probability
3. Best time to contact
4. Recommended action (Call Now, Email, or Nurture)
5. Why this lead explanation`;

  return generateCompletion(prompt, 'You are a sales intelligence AI that analyzes B2B leads and provides actionable insights.');
};

const generateOutreachEmail = async (leadData, contactData, templateType) => {
  const prompt = `Generate a personalized ${templateType} email for outreach.

Company: ${leadData.company}
Industry: ${leadData.industry}
Funding: ${leadData.funding}
Contact Name: ${contactData.name}
Contact Role: ${contactData.role}
Contact Persona: ${contactData.persona}

Write a professional, personalized email with:
- Compelling subject line
- Personalized body based on their role
- Clear value proposition
- Call to action

Use {{name}} and {{company}} as placeholders for personalization.`;

  return generateCompletion(prompt, 'You are a B2B sales email expert that writes high-converting outreach emails.');
};

const generatePersona = async (company, role) => {
  const prompt = `Generate a detailed persona profile for a ${role} at ${company}.

Include:
- Background assumptions (education, previous companies)
- Key priorities and pain points
- How they make buying decisions
- Best way to communicate with them
- Their communication style preferences`;

  return generateCompletion(prompt, 'You are a sales enablement expert that creates buyer personas.');
};

module.exports = {
  generateCompletion,
  generateLeadAnalysis,
  generateOutreachEmail,
  generatePersona
};