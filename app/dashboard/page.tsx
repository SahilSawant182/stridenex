"use client";

import { useEffect, useState } from "react";
import { fetchDoctype } from "@/services/api.services";
import DynamicForm from "@/components/dynamic/DynamicForm";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const [meta, setMeta] = useState<any>(null);
  const { apiKey, apiSecret } = useAuth();

//   useEffect(() => {
//     if (!apiKey || !apiSecret) return;

//     fetchDoctype("Test", apiKey, apiSecret)
//       .then(setMeta)
//       .catch(console.error);
//   }, [apiKey, apiSecret]);

  if (!apiKey || !apiSecret)
    return <p className="p-6">Not Authenticated</p>;

  if (!meta) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{meta.name}</h2>

      <DynamicForm
        // meta={meta}
        onSubmit={(data) => console.log(data)}
      />
    </div>
  );
}