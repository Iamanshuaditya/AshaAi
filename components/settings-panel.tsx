"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { RiSettingsLine } from "@remixicon/react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SliderControl from "@/components/slider-control";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

type SettingsPanelContext = {
  open: boolean;
  setOpen: (open: boolean) => void;
  togglePanel: () => void;
};

const SettingsPanelContext = React.createContext<SettingsPanelContext | null>(
  null,
);

function useSettingsPanel() {
  const context = React.useContext(SettingsPanelContext);
  if (!context) {
    throw new Error(
      "useSettingsPanel must be used within a SettingsPanelProvider.",
    );
  }
  return context;
}

const SettingsPanelProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false);

  // Helper to toggle the panel.
  const togglePanel = React.useCallback(() => {
    setOpen((open) => !open);
  }, [setOpen]);

  const contextValue = React.useMemo<SettingsPanelContext>(
    () => ({
      open,
      setOpen,
      togglePanel,
    }),
    [open, setOpen, togglePanel],
  );

  return (
    <SettingsPanelContext.Provider value={contextValue}>
      {children}
    </SettingsPanelContext.Provider>
  );
};
SettingsPanelProvider.displayName = "SettingsPanelProvider";

const SettingsPanelContent = () => {
  const id = React.useId();

  return (
    <>
      {/* Panel header */}
      <div className="py-5">
        <div className="flex items-center gap-2">
          <RiSettingsLine
            className="text-muted-foreground/70"
            size={20}
            aria-hidden="true"
          />
          <h2 className="text-sm font-medium">Settings</h2>
        </div>
      </div>

      {/* Panel content */}
      <div className="-mt-px">
        {/* Content group */}
        <div className="py-5 relative before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-black/[0.06] before:via-black/10 before:to-black/[0.06]">
          <h3 className="text-xs font-medium uppercase text-muted-foreground/80 mb-4">
            Chat presets
          </h3>
          <div className="space-y-3">
            {/* Model */}
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor={`${id}-model`} className="font-normal">
                Model
              </Label>
              <Select defaultValue="1">
                <SelectTrigger
                  id={`${id}-model`}
                  className="bg-background w-auto max-w-full h-7 py-1 px-2 gap-1 [&_svg]:-me-1 border-none"
                >
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent
                  className="[&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2"
                  align="end"
                >
                  <SelectItem value="1">Chat 4.0</SelectItem>
                  <SelectItem value="2">Chat 3.5</SelectItem>
                  <SelectItem value="3">Chat 3.0</SelectItem>
                  <SelectItem value="4">Chat 2.5</SelectItem>
                  <SelectItem value="5">Chat 2.0</SelectItem>
                  <SelectItem value="6">Chat 1.5</SelectItem>
                  <SelectItem value="7">Chat 1.0</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Response format */}
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor={`${id}-response-format`} className="font-normal">
                Response format
              </Label>
              <Select defaultValue="1">
                <SelectTrigger
                  id={`${id}-response-format`}
                  className="bg-background w-auto max-w-full h-7 py-1 px-2 gap-1 [&_svg]:-me-1 border-none"
                >
                  <SelectValue placeholder="Select response format" />
                </SelectTrigger>
                <SelectContent
                  className="[&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2"
                  align="end"
                >
                  <SelectItem value="1">text</SelectItem>
                  <SelectItem value="2">json_object</SelectItem>
                  <SelectItem value="3">json_schema</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Writing style */}
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor={`${id}-writing-style`} className="font-normal">
                Writing style
              </Label>
              <Select defaultValue="1">
                <SelectTrigger
                  id={`${id}-writing-style`}
                  className="bg-background w-auto max-w-full h-7 py-1 px-2 gap-1 [&_svg]:-me-1 border-none"
                >
                  <SelectValue placeholder="Select writing style" />
                </SelectTrigger>
                <SelectContent
                  className="[&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2"
                  align="end"
                >
                  <SelectItem value="1">Concise</SelectItem>
                  <SelectItem value="2">Formal</SelectItem>
                  <SelectItem value="3">Technical</SelectItem>
                  <SelectItem value="4">Creative</SelectItem>
                  <SelectItem value="5">Scientific</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Mode */}
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor={`${id}-mode`} className="font-normal">
                Mode
              </Label>
              <Select defaultValue="1">
                <SelectTrigger
                  id={`${id}-mode`}
                  className="bg-background w-auto max-w-full h-7 py-1 px-2 gap-1 [&_svg]:-me-1 border-none"
                >
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent
                  className="[&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2"
                  align="end"
                >
                  <SelectItem value="1">Chatbot</SelectItem>
                  <SelectItem value="2">Code</SelectItem>
                  <SelectItem value="3">Translate</SelectItem>
                  <SelectItem value="4">Summarize</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Content group */}
        <div className="py-5 relative before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-black/[0.06] before:via-black/10 before:to-black/[0.06]">
          <h3 className="text-xs font-medium uppercase text-muted-foreground/80 mb-4">
            Configurations
          </h3>
          <div className="space-y-3">
            {/* Temperature */}
            <SliderControl
              minValue={0}
              maxValue={2}
              initialValue={[0.5]}
              defaultValue={[0.5]}
              step={0.1}
              label="Temperature"
            />

            {/* Max length */}
            <SliderControl
              minValue={1}
              maxValue={32000}
              initialValue={[3072]}
              defaultValue={[3072]}
              step={1}
              label="Max length"
            />

            {/* Top P */}
            <SliderControl
              minValue={0}
              maxValue={1}
              initialValue={[0.9]}
              defaultValue={[0.9]}
              step={0.1}
              label="Top P"
            />

            {/* Top K */}
            <SliderControl
              minValue={1}
              maxValue={100}
              initialValue={[30]}
              defaultValue={[30]}
              step={1}
              label="Top K"
            />

            {/* Frequency penalty */}
            <SliderControl
              minValue={0}
              maxValue={2}
              initialValue={[0]}
              defaultValue={[0]}
              step={0.1}
              label="Frequency penalty"
            />

            {/* Presence penalty */}
            <SliderControl
              minValue={0}
              maxValue={2}
              initialValue={[0]}
              defaultValue={[0]}
              step={0.1}
              label="Presence penalty"
            />
          </div>
        </div>
      </div>
    </>
  );
};

const SettingsPanel = () => {
  const { open, setOpen } = useSettingsPanel();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Settings</DialogTitle>
        <ScrollArea className="max-h-[80vh]">
          <div className="px-6">
            <SettingsPanelContent />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

const SettingsPanelTrigger = ({
  onClick,
}: {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
  const { togglePanel } = useSettingsPanel();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    togglePanel();
    onClick?.(event);
  };

  return (
    <Button
      variant="ghost"
      className="px-2 hover:bg-background/80 hover:text-foreground hover:shadow-sm transition-all"
      onClick={handleClick}
      aria-label="Settings"
    >
      <RiSettingsLine
        className="text-muted-foreground sm:text-muted-foreground/70 size-5"
        size={20}
        aria-hidden="true"
      />
      <span className="max-sm:sr-only">Settings</span>
    </Button>
  );
};

export { SettingsPanelProvider, SettingsPanel, SettingsPanelTrigger };
