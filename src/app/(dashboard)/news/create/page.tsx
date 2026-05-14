// File: src/app/(dashboard)/news/create/page.tsx
import React from "react";
import NewsForm from "../components/NewsForm";

export default function CreateNewsPage() {
  return <NewsForm isEditing={false} />;
}
