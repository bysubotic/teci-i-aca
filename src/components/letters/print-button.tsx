"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintButton() {
  return (
    <Button size="cta" className="no-print w-full sm:w-auto" onClick={() => window.print()}>
      <Printer className="size-5" />
      Sačuvaj kao PDF / Štampaj
    </Button>
  );
}
