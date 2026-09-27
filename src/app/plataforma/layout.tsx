import { PlataformaShell } from "@/components/plataforma/Shell";

export default function PlataformaLayout({ children }: LayoutProps<"/plataforma">) {
  return <PlataformaShell>{children}</PlataformaShell>;
}
