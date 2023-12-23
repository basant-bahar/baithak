"use client";

import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";

interface TagInputProps {
  existingTags?: string[];
  placeholder?: string;
  onChange: (tags: string[]) => void;
}

export default function TagInput({
  existingTags = [],
  placeholder = "Press enter to add new",
  onChange,
}: TagInputProps) {
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>(existingTags);

  function handleTagChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTag(e.target.value);
  }

  function handleEnter(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      const newTags = [tag, ...tags];
      setTags(newTags);
      setTag("");
      onChange(newTags);
    }
  }

  function deleteTag(tag: string) {
    const newTags = tags.filter((t) => t !== tag);
    setTags(newTags);
    onChange(newTags);
  }

  const tagElements = tags.map((tag, i) => {
    return (
      <div className="flex" key={tag}>
        <span>{tag}</span>
        <XMarkIcon className="w-4 text-red-600" onClick={() => deleteTag(tag)} />
      </div>
    );
  });

  return (
    <div className="col-span-2">
      <div className="flex gap-2">{tagElements}</div>
      <input
        className="simple-input mt-1 min-w-[300px]"
        value={tag}
        onChange={handleTagChange}
        onKeyDown={handleEnter}
        placeholder={placeholder}
      />
    </div>
  );
}
