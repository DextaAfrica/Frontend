import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <Container className="grid min-h-[65vh] place-items-center py-20 text-center">
      <div>
        <p className="text-sm font-bold tracking-widest text-primary uppercase">
          404
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">
          Page not found
        </h1>
        <p className="mt-3 text-muted-foreground">
          The page you requested does not exist.
        </p>
        <ButtonLink href="/" className="mt-7">
          Return home
        </ButtonLink>
      </div>
    </Container>
  );
}
