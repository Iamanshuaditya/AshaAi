import React from 'react';
import { cn } from "@/lib/utils";
import Image from "next/image";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import type { Components } from 'react-markdown';
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  RiCheckLine,
  RiFlag2Line,
  RiCloseLine,
} from "@remixicon/react";

type ChatMessageProps = {
  isUser?: boolean;
  children: React.ReactNode;
};

export function ChatMessage({ isUser, children }: ChatMessageProps) {
  // Function to process the message content
  const renderContent = (content: React.ReactNode) => {
    if (typeof content === 'string') {
      const components: Partial<Components> = {
        // Override default link rendering to open in new tab
        a: ({ children, href }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/90 underline underline-offset-4">
            {children}
          </a>
        ),
        // Ensure code blocks maintain whitespace
        code: ({ children, className }) => (
          className ?
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-4">
              <code className="text-sm block">{children}</code>
            </pre> :
            <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
        ),
        // Add proper list handling
        ul: ({ children }) => (
          <ul className="list-disc pl-6 my-2">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal pl-6 my-2">{children}</ol>
        ),
        // Add strong (bold) text handling
        strong: ({ children }) => (
          <strong className="font-semibold text-foreground">{children}</strong>
        ),
        // Add emphasis (italic) text handling
        em: ({ children }) => (
          <em className="italic">{children}</em>
        ),
        // Add paragraph handling
        p: ({ children }) => (
          <p className="mb-4 last:mb-0">{children}</p>
        ),
        // Add heading handling
        h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 mt-6 first:mt-0">{children}</h1>,
        h2: ({ children }) => <h2 className="text-xl font-bold mb-3 mt-5 first:mt-0">{children}</h2>,
        h3: ({ children }) => <h3 className="text-lg font-bold mb-3 mt-4 first:mt-0">{children}</h3>,
        h4: ({ children }) => <h4 className="text-base font-bold mb-2 mt-4 first:mt-0">{children}</h4>,
        // Add list item handling
        li: ({ children }) => (
          <li className="mb-1">{children}</li>
        ),
      };

      return (
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkBreaks]}
            components={components}
          >
            {content}
          </ReactMarkdown>
        </div>
      );
    }
    return content;
  };

  return (
    <article
      className={cn(
        "flex items-start gap-4 text-[15px] leading-relaxed",
        isUser && "justify-end",
      )}
    >
      <Image
        className={cn(
          "rounded-full",
          isUser ? "order-1" : "border border-black/[0.08] shadow-sm",
        )}
        src={
          isUser
            ? "https://res.cloudinary.com/dlzlfasou/image/upload/v1741345634/user-02_mlqqqt.png"
            : "https://res.cloudinary.com/dlzlfasou/image/upload/v1741345634/user-01_i5l7tp.png"
        }
        alt={isUser ? "User profile" : "EatSmart logo"}
        width={40}
        height={40}
      />
      <div
        className={cn(
          "chat-message",
          isUser
            ? "bg-[#BFDBFE] text-white px-4 py-3 rounded-xl"
            : "bg-[#3F4E73] border border-[#4B5EAA] px-4 py-3 rounded-xl space-y-4"
        )}
      >
        <div className="flex flex-col gap-3">
          <p className="sr-only">{isUser ? "You" : "EatSmart"} said:</p>
          {React.Children.map(children, child => renderContent(child))}
        </div>
        {!isUser && (
          <>
            <MessageActions />
            <div className="mt-2">
              <button className="text-xs text-destructive hover:underline">Report Bias</button>
            </div>
          </>
        )}
      </div>
    </article>
  );
}

type ActionButtonProps = {
  icon: React.ReactNode;
  label: string;
};

function ActionButton({ icon, label }: ActionButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button className="relative text-muted-foreground/80 hover:text-foreground transition-colors size-8 flex items-center justify-center before:absolute before:inset-y-1.5 before:left-0 before:w-px before:bg-border first:before:hidden first-of-type:rounded-s-lg last-of-type:rounded-e-lg focus-visible:z-10 outline-offset-2 focus-visible:outline-2 focus-visible:outline-ring/70">
          {icon}
          <span className="sr-only">{label}</span>
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="dark px-2 py-1 text-xs">
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}

function MessageActions() {
  return (
    <div className="relative inline-flex bg-white rounded-md border border-black/[0.08] shadow-sm -space-x-px">
      <TooltipProvider delayDuration={0}>
        <ActionButton icon={<RiCheckLine size={16} />} label="Approve" />
        <ActionButton icon={<RiCloseLine size={16} />} label="Disapprove" />
        <ActionButton icon={<RiFlag2Line size={16} />} label="Report Bias" />
      </TooltipProvider>
    </div>
  );
}
