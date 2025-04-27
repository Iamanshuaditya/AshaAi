# Asha AI Project Documentation

## Overview

This project is a Next.js application designed as an AI-powered virtual assistant named Asha AI. It is being developed for the ASHA AI HACKATHON 2025 by the JobsForHer Foundation in collaboration with Hack2skill. The goal is to build a chatbot that enhances user engagement on the JobsForHer Foundation platform by offering seamless access to publicly available information, focusing on women's career growth, job discovery, and professional networking.

Asha AI aims to transform how users interact with the platform through intelligent, contextual, and personalized user experiences. It will understand users, retain past interactions, and seamlessly integrate with the JobsForHer Foundation platform. The chatbot will function as an AI-powered virtual assistant, guiding users in exploring women careers, job listings, community events, mentorship programs, and session details efficiently.

The project emphasizes ethical AI principles, including gender bias mitigation, responsible AI-driven responses, and privacy-conscious design, ensuring a secure and informative experience. It leverages retrieval-augmented generation (RAG), semantic search, and dynamic knowledge retrieval to provide accurate, real-time responses aligned with women career engagement and empowerment initiatives.

## Key Requirements

The Asha AI Bot must fulfill the following essential requirements:

1.  **Contextual Awareness:**
    *   Handle multi-turn conversations, ensuring logical, coherent, and relevant responses.
    *   Utilize non-personalized session data to maintain a smooth conversational flow.
2.  **System Integration:**
    *   Seamlessly integrate with public APIs to fetch real-time job listings, event details, and mentorship opportunities.
    *   Leverage structured datasets (e.g., `session_details.json`, `job_listing_data.csv`) for accurate, up-to-date information.
3.  **Ethical AI & Bias Prevention:**
    *   Implement NLP-based bias detection to identify and redirect gender-biased queries.
    *   Promote inclusivity by ensuring responses provide factual, positive insights on women empowerment.
4.  **Security & Privacy Compliance:**
    *   Employ robust encryption to safeguard data security.
    *   Adhere to global AI ethics frameworks for responsible and privacy-conscious interactions.
5.  **Real-Time Knowledge Base Updates:**
    *   Implement dynamic content retrieval mechanisms to fetch and update information in real-time.
    *   Aggregate insights from verified sources, including women career engagement and empowerment initiatives, job databases, and event platforms.
6.  **Performance & Monitoring:**
    *   Enable analytics tracking to measure user engagement, response accuracy, and bias mitigation effectiveness.
    *   Implement a continuous learning framework to refine AI-driven responses based on real-world interactions.
7.  **Error Handling & Fallback Mechanisms:**
    *   Ensure graceful degradation, providing alternative suggestions or redirecting users to human support when necessary.
    *   Establish a feedback loop, allowing users to report inaccurate, biased, or irrelevant responses, facilitating continuous improvement.

## Directory Structure

### `/app`

The `/app` directory is the heart of the Next.js application. It handles routing and defines the main layout of the application.

*   **`layout.tsx`:** This file defines the root layout for the entire application. It includes the basic HTML structure, metadata (title, description, keywords), and imports global CSS. It also sets the font using `next/font/google`. The metadata is configured to reflect the purpose of the app for the hackathon.
*   **`page.tsx`:** This file serves as the entry point for the application's main page. It imports and renders the `Dashboard` component.
*   **`dashboard/page.tsx`:** This file defines the dashboard route. It includes the `AppSidebar`, `SidebarInset`, `UserDropdown`, `SettingsPanel`, and `Chat` components. It also wraps the content with `SidebarProvider` and `SettingsPanelProvider` to manage the sidebar and settings panel state.
*   **`globals.css`:** This file contains global CSS styles, including Tailwind CSS imports and custom theme definitions using CSS variables and the `oklch` color format.
*   **`favicon.ico`:** This is the favicon file for the application.

### `/components`

The `/components` directory contains reusable UI elements used throughout the application.

*   **`app-sidebar.tsx`:** This component defines the application's sidebar. It includes a `TeamSwitcher` and navigation links. It uses the `Sidebar`, `SidebarContent`, `SidebarMenu`, and other `Sidebar` sub-components to structure the sidebar.
*   **`chat.tsx`:** This component implements the chat interface. It includes a header with breadcrumbs and action buttons, a chat message area, and a footer with a text input and send button. It uses the `ChatMessage` component to display individual messages.
*   **`chat-message.tsx`:** This component renders a single chat message, including the user's avatar and message content. It supports both user and bot messages and includes action buttons for bot messages.
*   **`settings-panel.tsx`:** This component defines the settings panel, which allows users to customize the chat interface. It includes options for selecting the model, response format, writing style, and other configurations. It uses the `Select`, `SliderControl`, and other UI components to create the settings form.
*   **`slider-control.tsx`:** This component implements a slider control with an input field for precise value adjustment. It uses the `useSliderWithInput` hook to manage the slider and input state.
*   **`team-switcher.tsx`:** This component allows users to switch between different teams or organizations. It uses a `DropdownMenu` to display the available teams.
*   **`ui/*`:** This directory contains primitive UI components like `Button`, `Select`, `Tooltip`, etc.

### `/hooks`

The `/hooks` directory contains custom React hooks used in the application.

*   **`use-mobile.ts`:** This hook detects whether the application is running on a mobile device based on a specified breakpoint.
*   **`use-slider-with-input.ts`:** This hook manages the state and logic for a slider control with an input field. It handles value validation, input changes, and slider updates.

### `/lib`

The `/lib` directory contains utility functions used throughout the application.

*   **`utils.ts`:** This file contains utility functions, such as `cn` for merging class names with `tailwind-merge` and `clsx`.

## UI Redesign Implementation

The UI has been redesigned to align with the JobsForHer brand identity and to create a more focused, user-friendly experience for women seeking career guidance. The following changes have been implemented:

### General Layout and Branding Changes

1. **Color Scheme**:
   - JobsForHer brand colors (green and purple accents) have been implemented throughout the interface
   - Primary color changed to green: `oklch(0.55 0.15 145)`
   - Accent color changed to purple: `oklch(0.6 0.18 300)`
   - Updated chart colors to match the brand palette

2. **Background Pattern**:
   - Added a subtle geometric pattern background to reinforce brand identity
   - Implemented as an SVG background in CSS

### Left Sidebar Enhancements

1. **Header Rebranding**:
   - Changed sidebar header from "PLAYGROUND" to "ASHA AI" in the brand font
   - Updated sidebar styling to use the new brand colors

2. **Navigation Structure**:
   - Restructured sidebar menu items to include:
     * "Prev Chats" (replacing "Chat")
     * "Job & Event Feed"
     * "Assistants"
     * "Ethics & Feedback" (replacing "Audio")
 
   - Removed "Metrics" item from the navigation

### Chat Interface Improvements

1. **Header and Welcome Message**:
   - Updated header to display "Asha AI by JobsForHer"
   - Changed welcome message to: "Welcome to Asha AI by JobsForHer! I'm your guide for job discovery, signup, FAQs, and career growth for women. Powered by ethical AI, how can I assist you today?"

2. **New Action Buttons**:
   - Added "View Feed", "Signup Help", and "FAQs" buttons below chat input
   - Replaced previous generic buttons (Attach, Audio, Action)
   - Each button includes descriptive text and an appropriate icon

3. **Ethical AI Features**:
   - Added "Report Bias" link under each AI response
   - Added a Report Bias icon to the message actions toolbar
   - This ensures compliance with ethical AI principles

### Settings Panel Reconfiguration

1. **Display Mode Change**:
   - Transformed the right panel into a modal dialog that opens from a settings icon
   - The settings panel now opens as a centered dialog instead of a sidebar
   - This creates more space for the chat interface

2. **Content Updates**:
   - Changed header text from "My preferences" to "Settings"
   - Updated the settings organization and contents

### Accessibility Enhancements

1. **Improved Button Labels**:
   - Added proper labels to all buttons for screen readers
   - Ensured all interactive elements have accessible names

2. **Color Contrast**:
   - Selected colors that meet WCAG standards for contrast
   - Used lighter/brighter variants of brand colors in dark mode for better visibility

These changes collectively transform the interface to better reflect the JobsForHer brand identity and to provide a more focused experience for women seeking career assistance through the Asha AI chatbot.

## UI Implementation Updates

The following additional user interface enhancements have been implemented to further improve the user experience:

### Left Sidebar Enhancements

1. **New Chat Button**:
   - Added a prominent "New Chat" button at the top of the sidebar
   - Styled with primary green color to draw attention
   - Includes a plus icon for clear visual indication of its purpose

2. **Collapsible Chat History**:
   - Implemented a collapsible "Prev Chats" section that expands on click
   - Shows dropdown indicator (▼/▶) to indicate expandable content
   - Displays hardcoded chat history items with dates:
     * "Job Query - 04/26/2025"
     * "Signup Help - 04/25/2025"
     * "Career Advice - 04/23/2025"
     * "Mentorship Question - 04/20/2025"
   - Each history item includes a calendar icon for visual identification

### Welcome Screen Implementation

1. **Initial View**:
   - Created a clean welcome screen that shows when no chat is active
   - Displays "How can I help with your career journey?" as the main headline
   - Includes a supportive subtitle to explain the purpose of Asha AI

2. **Suggestion Buttons**:
   - Added 5 suggestion buttons for common queries:
     * "Find jobs in my field" with job chart icon
     * "Upcoming career events" with calendar icon
     * "Resume improvement tips" with document icon
     * "Mentorship opportunities" with user star icon
     * "Women in tech resources" with women icon
   - Each button is clickable and initiates a chat with the selected query
   - Responsive grid layout (2 columns on desktop, 1 column on mobile)

### Chat Functionality Implementation

1. **Message Input and Sending**:
   - Connected the chat input textarea to state management
   - Added functionality to send messages on button click or Enter key press
   - Improved the design of the "Ask AshaAI" button with send icon
   - Implemented disabled state when the input is empty

2. **Chat Simulation**:
   - Implemented a complete chat flow simulation:
     * User message appears immediately in the chat area
     * Shows typing indicator (three animated dots) for 1-2 seconds
     * Displays AI response after the typing animation
   - Stores chat history in state for persistence during the session
   - Conditionally displays elements based on chat state

3. **Typing Indicator**:
   - Created an animated typing indicator with three bouncing dots
   - Implemented staggered animation using CSS animation delays
   - Styled to match the primary brand color
   - Appears and disappears at appropriate times in the conversation flow

4. **Visual Feedback**:
   - Added smooth scrolling to ensure new messages are visible
   - "Today" date indicator appears only when a chat is active
   - Welcome message shows only after the first user message

These enhancements create a more interactive and engaging user experience that guides users through their interaction with Asha AI, making it more intuitive and helpful for women seeking career assistance.
