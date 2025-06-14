# EatSmart Chatbot

## Overview

EatSmart is an AI-powered assistant that helps users scan packaged foods and receive personalized health alerts. Originally created as a hackathon project, the chatbot now focuses on guiding users toward smarter eating choices.

## Features

*   **Career Guidance:** Provides personalized advice and resources for career development.
*   **Job Search:** Helps users find relevant job listings based on their skills and interests.
*   **Event Discovery:**  Informs users about upcoming community events and workshops.
*   **Mentorship Programs:** Connects users with experienced mentors for guidance and support.
*   **AI-Powered:** Uses Retrieval-Augmented Generation (RAG), semantic search, and NLP for intelligent and relevant responses.
*   **Bias Mitigation:** Implements NLP-based bias detection to ensure fair and inclusive career advice.

## Technologies Used

*   **Frontend:**
    *   [React](https://react.dev/): JavaScript library for building user interfaces.
    *   [Next.js](https://nextjs.org/) v15.3.1: React framework for server-side rendering and API routes.
    *   [Tailwind CSS](https://tailwindcss.com/) v4: CSS framework for styling components.
    *   [Radix UI](https://www.radix-ui.com/): Set of accessible and unstyled React components (using `@radix-ui/*` dependencies).
    *   [Lucide React](https://lucide.dev/) v0.503.0: Icons library.
*   **Backend:**
     *   Next.js API Routes: Serverless functions for handling API requests.
*   **AI/NLP:**
    *   [`@google/generative-ai`](https://www.npmjs.com/package/@google/generative-ai): Google's generative AI models.
    *   [`ai`](https://www.npmjs.com/package/ai): AI library for building AI-powered applications.
    *   [`@tavily/core`](https://www.npmjs.com/package/@tavily/core): Tavily search core.
*   **Data Storage & Utilities:**
    *   `geoip-lite`: Find the location of any IP address.
    *   [`date-fns`](https://date-fns.org/) v3.6.0: Date utility library.
    *   [`zod`](https://zod.dev/) v3.24.3: Schema declaration and validation.
    *   `exa-js`: JavaScript library.
*   **UI and Styling:**
    *   [`class-variance-authority`](https://www.npmjs.com/package/class-variance-authority) v0.7.1: Utility for creating styled component variants.
    *   [`clsx`](https://www.npmjs.com/package/clsx) v2.1.1: Utility for conditionally joining class names.
    *   [`tailwind-merge`](https://www.npmjs.com/package/tailwind-merge) v3.2.0: Utility for merging Tailwind CSS classes.
    *   [`sonner`](https://sonner.emilkowal.ski/) v2.0.3: A toast notification library.
    *   [`react-day-picker`](https://react-day-picker.js.org/) v8.10.1: A date picker component for React.
*   **Markdown Processing:**
    *   [`react-markdown`](https://github.com/remarkjs/react-markdown) v10.1.0: React component to render Markdown.
    *   [`remark-breaks`](https://github.com/remarkjs/remark-breaks) v4.0.0: Remark plugin to support line breaks in Markdown.
    *   [`remark-gfm`](https://github.com/remarkjs/remark-gfm) v4.0.1: Remark plugin to support GitHub Flavored Markdown.
    *   [`@remixicon/react`](https://www.npmjs.com/package/@remixicon/react) v4.6.0: Remix Icon components for React.

## Getting Started

### Prerequisites

*   Node.js (>=18)
*   npm, yarn, or pnpm

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/jhalaktiwarii/EatSmartChatbot
    ```

2.  Navigate to the project directory:

    ```bash
    cd EatSmartChatbot
    ```

3.  Install dependencies:

    ```bash
    npm install --force
    ```

    or

    ```bash
    yarn install
    ```

    or

    ```bash
    pnpm install
    ```

4.  Configure environment variables:

    *   Create a `.env` file in the project root.
    *   Add necessary API keys and database credentials (if applicable).  See `.env.example` (if you have one) for the required variables.

### Running the Chatbot

```bash
npm run dev
```

or

```bash
yarn dev
```

or

```bash
pnpm dev
```

This will start the development server. Open your browser and navigate to `http://localhost:3000` (or the port specified in your environment).

## Architecture

\[Refer to the Architecture Diagram from the previous response]

## API Endpoints

*   `/api/chat`: Receives user messages and returns chatbot responses.
*   `/api/jobs`: Fetches job listings based on user criteria.
*   `/api/events`: Retrieves event information.

## Contributing

(Add information about how others can contribute to the project)
 