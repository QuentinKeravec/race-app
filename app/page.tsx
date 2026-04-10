import LoginModal from "@/components/ui/LoginModal";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "ログイン - Course",
    description: "ログイン",
};

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <LoginModal />
    </section>
  );
}