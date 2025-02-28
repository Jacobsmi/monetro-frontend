import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="p-4">
      <nav className="flex items-center justify-between">
        <div className="text-xl font-bold">Monetro</div>
        <div className="flex items-center gap-4">
          <Link
            href={"/login"}
            className={buttonVariants({ variant: "ghost" })}
          >
            Login
          </Link>
          <Link href={"/signup"} className={buttonVariants()}>
            Sign Up
          </Link>
        </div>
      </nav>
    </div>
  );
}
