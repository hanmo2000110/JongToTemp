import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="container py-16">
      <div className="mx-auto max-w-2xl space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Next.js(App Router) 초기화 완료
        </h1>
        <p className="text-muted-foreground">
          Tailwind CSS, shadcn/ui 유틸 구조, Recharts 의존성이 준비되었습니다.
        </p>
        <div className="pt-2">
          <Button>shadcn/ui 버튼 예시</Button>
        </div>
      </div>
    </main>
  );
}
