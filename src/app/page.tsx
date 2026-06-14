import { AppShell } from "@/components/app-shell";
import { MotionProvider } from "@/components/motion-provider";

export default function Home() {
  return (
    <MotionProvider>
      <AppShell />
    </MotionProvider>
  );
}
