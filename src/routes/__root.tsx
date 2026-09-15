import {
  createRootRoute,
  type ErrorComponentProps,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";

import { Button, Container, Heading, Text, VStack } from "#/components/ui";
import { UIProvider } from "#/components/ui/provider";
import { useMessages } from "#/i18n/locale";
import { LocaleProvider } from "#/i18n/locale-provider";
import { getAppContext } from "#/server/functions";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "sage" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&family=Noto+Sans+Mono:wght@400;700&display=swap",
      },
    ],
  }),
  loader: () => getAppContext(),
  shellComponent: RootDocument,
  component: RootComponent,
  notFoundComponent: NotFound,
  errorComponent: ErrorView,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <HeadContent />
      </head>
      <body>
        <UIProvider>{children}</UIProvider>
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { locale } = Route.useLoaderData();
  return (
    <LocaleProvider locale={locale}>
      <Outlet />
    </LocaleProvider>
  );
}

function NotFound() {
  const messages = useMessages();
  return (
    <Container maxW="4xl" py="xl">
      <VStack align="start" gap="md">
        <Heading level="h1" size="28">
          {messages.error.notFoundTitle}
        </Heading>
        <Text>{messages.error.notFoundBody}</Text>
        <Button asChild variant="outline">
          <a href="/">{messages.nav.backToTop}</a>
        </Button>
      </VStack>
    </Container>
  );
}

function ErrorView({ error }: ErrorComponentProps) {
  const messages = useMessages();
  const detail = error instanceof Error ? error.message : String(error);
  return (
    <Container maxW="4xl" py="xl">
      <VStack align="start" gap="md">
        <Heading level="h1" size="28">
          {messages.error.unexpectedTitle}
        </Heading>
        <Text color="error">{detail}</Text>
        <Button asChild variant="outline">
          <a href="/">{messages.nav.backToTop}</a>
        </Button>
      </VStack>
    </Container>
  );
}
