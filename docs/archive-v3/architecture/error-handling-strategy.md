# **Error Handling Strategy**

## **Error Flow**

Catch errors at source (FE, BE, Bridge, Phaser), log centrally (Sentry), provide user-friendly feedback. Diagram illustrates flow.

## **Error Response Format (Edge Functions)**

Standard ApiErrorResponse JSON object with error: { code, message, details?, timestamp, requestId? }.

## **Frontend Error Handling (React Native Shell)**

Error Boundaries, try/catch in services/hooks, map ApiErrorResponse, handle Bridge errors, global handler (report to Sentry), user-friendly messages.

## **Backend Error Handling (Supabase Edge & PG Functions)**

* **Edge:** Validate inputs (Zod), catch client/external API errors, throw custom business logic errors, top-level catch, log details, return standard ApiErrorResponse.  
* **PG Functions:** Use PL/pgSQL exception handling, log errors within DB or raise exceptions for Edge Function to catch.
