"use client";

import { createLogger } from "@/lib/observability/logger";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import {
  getSelectedModel,
  setSelectedModel,
} from "@/hooks/presentation/useLocalModels";
import { usePresentationState } from "@/states/presentation-state";
import { Bot } from "lucide-react";
import { useEffect, useRef } from "react";

const modelPickerLogger = createLogger("client:model-picker");

const GEMINI_MODELS = [
  {
    id: "gemini-2.0-flash",
    label: "Gemini 2.0 Flash",
    description: "Ən yaxşı balans — sürətli və keyfiyyətli",
  },
] as const;

function getGeminiModel(modelId: string) {
  return GEMINI_MODELS.find((model) => model.id === modelId) ?? GEMINI_MODELS[0];
}

export function ModelPicker({
  shouldShowLabel = true,
}: {
  shouldShowLabel?: boolean;
}) {
  const { modelProvider, setModelProvider, modelId, setModelId } =
    usePresentationState();

  const hasRestoredFromStorage = useRef(false);

  // Avtomatik olaraq Gemini 2.0 Flash seç
  useEffect(() => {
    if (!hasRestoredFromStorage.current) {
      const savedModel = getSelectedModel();

      if (savedModel && savedModel.modelProvider === "gemini") {
        setModelProvider("gemini");
        setModelId(savedModel.modelId || "gemini-2.0-flash");
      } else {
        setModelProvider("gemini");
        setModelId("gemini-2.0-flash");
        setSelectedModel("gemini", "gemini-2.0-flash");
      }
      hasRestoredFromStorage.current = true;
    }
  }, [setModelId, setModelProvider]);

  const currentModel = getGeminiModel(modelId || "gemini-2.0-flash");

  const handleModelChange = (value: string) => {
    if (value.startsWith("gemini-")) {
      const selectedModelId = value.replace("gemini-", "");
      const selected = getGeminiModel(selectedModelId);

      modelPickerLogger.info("Selected Gemini model", {
        modelProvider: "gemini",
        modelId: selected.id,
      });

      setModelProvider("gemini");
      setModelId(selected.id);
      setSelectedModel("gemini", selected.id);
    }
  };

  return (
    <div className="min-w-0">
      {shouldShowLabel && (
        <label className="block text-xs font-medium text-muted-foreground">
          Model
        </label>
      )}
      <Select
        value={`gemini-${currentModel.id}`}
        onValueChange={handleModelChange}
      >
        <SelectTrigger className="h-8 w-auto max-w-full gap-2 overflow-hidden rounded-full border-border bg-background px-3 text-[13px] font-medium text-foreground transition-colors hover:bg-accent sm:h-9 sm:px-3.5 sm:text-sm">
          <div className="flex min-w-0 items-center gap-2">
            <Bot className="h-4 w-4 flex-shrink-0" />
            <span className="truncate text-sm">{currentModel.label}</span>
          </div>
        </SelectTrigger>

        <SelectContent className="w-80 max-w-[calc(100vw-1rem)]">
          <SelectGroup>
            <SelectLabel>Gemini Modelləri</SelectLabel>
            {GEMINI_MODELS.map((model) => (
              <SelectItem
                key={model.id}
                value={`gemini-${model.id}`}
                className="overflow-hidden"
              >
                <div className="flex min-w-0 max-w-full items-center gap-3">
                  <Bot className="h-4 w-4 flex-shrink-0" />
                  <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                    <span className="truncate text-sm">{model.label}</span>
                    <span className="line-clamp-2 whitespace-normal break-words text-xs leading-snug text-muted-foreground">
                      {model.description}
                    </span>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
