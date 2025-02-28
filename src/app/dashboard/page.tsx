"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  return (
    <div>
      <Button
        onClick={async () => {
          const supabase = createClient();
          await supabase.auth.signOut();
          router.push("/");
        }}
      >
        Sign Out
      </Button>
    </div>
  );
}
