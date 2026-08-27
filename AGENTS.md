# AGENTS.md

## Purpose

This file defines the instructions and engineering rules followed by AI assistants during the development of the NAQL project.

AI tools were used to assist with planning, implementation, debugging, code review, and interface refinement. Generated suggestions and code should be reviewed before being accepted.

## General Engineering Rules

- Preserve the existing project architecture unless a change is necessary.
- Do not rewrite unrelated parts of the project.
- Keep implementations simple, maintainable, and readable.
- Use TypeScript consistently.
- Reuse existing components, utilities, and types when possible.
- Avoid unnecessary dependencies.
- Do not duplicate existing functionality.
- Keep frontend and backend responsibilities clearly separated.
- Handle errors explicitly instead of silently failing.

## AI Integration Rules

- All OpenRouter requests must execute server-side.
- Never call OpenRouter directly from client components.
- Never expose the OpenRouter API key to the browser.
- Read API credentials from environment variables.
- Validate requests before sending data to the AI provider.
- Treat AI responses as untrusted data.
- Validate and sanitize AI-generated responses before returning them to the UI.
- Use structured JSON responses when structured data is required.
- Apply request timeouts and appropriate error handling.
- Apply rate limiting to AI endpoints.
- Do not allow the AI to invent service-provider information.

## Service Comparison Rules

When comparing service providers:

- Use only providers supplied by the NAQL platform.
- Never invent provider names.
- Never invent prices.
- Never invent ratings.
- Never invent features.
- Provider IDs returned by the AI must exist in the supplied provider list.
- Invalid AI-generated provider IDs must not be trusted.
- Use deterministic calculations as fallbacks where appropriate.

## UI/UX Rules

- Maintain Arabic RTL support.
- Keep the interface clear and easy to navigate.
- Use consistent spacing, typography, buttons, cards, and states.
- Provide clear loading, success, empty, and error states.
- Maintain responsive behavior.
- Avoid unnecessary visual complexity.
- Integrate AI functionality naturally into the product experience.

## Code Quality

Before considering a change complete:

- Check TypeScript errors.
- Check runtime errors.
- Check browser console warnings.
- Verify affected routes.
- Verify API error states.
- Avoid leaving debug code in production.
- Keep comments useful and concise.

## AI Assistant Responsibility

AI-generated code must not be accepted blindly.

Generated changes should be reviewed, tested, and adjusted to ensure they match:

- Project requirements
- Existing architecture
- Security rules
- User experience requirements
- Course requirements
