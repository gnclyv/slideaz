"use client";

import { Clapperboard, Image, Wand2 } from "lucide-react";
import { useSession } from "next-auth/react";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DEFAULT_IMAGE_MODEL,
  getAvailableImageModels,
  type ImageModelList,
} from "@/constants/image-models";

interface ImageSourceSelectorProps {
  imageSource: "automatic" | "ai" | "stock" | "gif";
  imageModel: ImageModelList;
  onImageSourceChange: (source: "automatic" | "ai" | "stock" | "gif") => void;
  onImageModelChange: (model: ImageModelList) => void;
  className?: string;
  showLabel?: boolean;
}

export function ImageSourceSelector({
  imageSource,
  imageModel,
  onImageSourceChange,
  onImageModelChange,
  className,
  showLabel = true,
}: ImageSourceSelectorProps) {
  const { data: session } = useSession();

  // Session yalnız client-də istifadə edirik
  const isAdmin = session?.user?.isAdmin === true;
  const imageModels = getAvailableImageModels(isAdmin);

  const getSelectValue = () => {
    if (imageSource === "ai") {
      return imageModel || DEFAULT_IMAGE_MODEL;
    }
    if (imageSource === "stock") {
      return "stock-unsplash";
    }
    if (imageSource === "gif") {
      return "gif";
    }
    return "automatic";
  };

  return (
    <div className={className}>
      {showLabel && (
        <Label className="mb-2 block text-sm font-medium">Image Source</Label>
      )}

      <Select
        value={getSelectValue()}
        onValueChange={(value) => {
          if (value === "automatic") {
            onImageSourceChange("automatic");
          } else if (value === "gif") {
            onImageSourceChange("gif");
          } else if (value === "stock-unsplash") {
            onImageSourceChange("stock");
          } else {
            onImageSourceChange("ai");
            onImageModelChange(value as ImageModelList);
          }
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select image source" />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectItem value="automatic">Automatic</SelectItem>
          </SelectGroup>

          <SelectGroup>
            <SelectLabel className="flex items-center gap-1 text-primary/80">
              <Wand2 size={10} /> AI Generation
            </SelectLabel>
            {imageModels.map((model) => (
              <SelectItem key={model.value} value={model.value}>
                {model.label}
              </SelectItem>
            ))}
          </SelectGroup>

          <SelectGroup>
            <SelectLabel className="flex items-center gap-1 text-primary/80">
              <Image size={10} /> Stock Images
            </SelectLabel>
            <SelectItem value="stock-unsplash">Unsplash</SelectItem>
          </SelectGroup>

          <SelectGroup>
            <SelectLabel className="flex items-center gap-1 text-primary/80">
              <Clapperboard size={10} /> Animated
            </SelectLabel>
            <SelectItem value="gif">GIFs from Giphy</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}