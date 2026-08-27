# NAQL | نَقْل

NAQL is a Saudi digital platform designed to help users organize and manage the process of moving between homes.

The platform combines relocation planning, service discovery, budgeting, educational guidance, and AI-powered assistance in one user-friendly experience.

## Features

- Relocation planning and organization
- Moving checklist and guidance
- Service provider browsing
- Budget planning
- AI-powered service comparison
- AI relocation assistant
- Arabic RTL interface
- Responsive modern UI
- Secure server-side AI integration

## AI Features

### AI Relocation Assistant

Users can ask practical questions related to moving, including planning, packing, budgeting, moving-day preparation, and settling into a new home.

### Smart Service Comparison

The AI analyzes predefined service-provider data and user preferences such as:

- Priority
- City
- Maximum budget
- Price
- Rating
- Service quality

The AI is instructed to use only provider data supplied by the platform and not invent companies, prices, ratings, or features.

## Technologies Used

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- Next.js API Routes
- Node.js runtime

### AI Integration

- OpenRouter API
- OpenAI-compatible Chat Completions API
- GPT-4o-mini as the default configured model

### Security and Validation

- Environment variables
- Server-side API calls
- Input validation
- AI output validation and sanitization
- Rate limiting
- API error handling
- Request timeout handling

## AI-Assisted Development Tools

AI tools were used during development to support planning, implementation, debugging, code review, and UI refinement.

Tools used:

- ChatGPT
- Claude

AI-generated suggestions were reviewed and adapted to match the project requirements and architecture.

## Environment Variables

Create a `.env.local` file in the project root:

```env
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=openai/gpt-4o-mini
```

Never commit `.env.local` or expose API keys in frontend code.

## Running the Project

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Then open the local URL displayed in the terminal.

## AI Architecture

The browser does not communicate directly with OpenRouter.

```text
User Interface
      ↓
Next.js API Route
      ↓
Input Validation
      ↓
Server-side OpenRouter Client
      ↓
OpenRouter API
      ↓
Response Validation / Sanitization
      ↓
User Interface
```

This architecture keeps the API key on the server and prevents sensitive credentials from being exposed to the browser.

## Project Documentation

Additional engineering and security documentation:

- `AGENTS.md`
- `SECURITY_RULES.md`

## SDAIA Academy

This project was developed as part of training activities associated with SDAIA Academy.

SDAIA Academy GitHub repository:

https://github.com/SDAIAAcademy

## Disclaimer

NAQL is an educational project and may use demonstration data for service providers and platform content.
