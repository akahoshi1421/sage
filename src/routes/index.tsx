import { createFileRoute } from "@tanstack/react-router";

import { Button, Container, Heading, HStack, Icon, Text, VStack } from "#/components/ui";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <Container maxW="4xl" py="xl">
      <VStack align="start" gap="lg">
        <Heading level="h1" size="36" chip>
          sage
        </Heading>
        <Text>AI 時代に新しいライブラリを効率的に学ぶためのフレームワークです。</Text>
        <HStack gap="md">
          <Button>
            <Icon name="complete_line" />
            回答する
          </Button>
          <Button variant="outline">
            次の問題へ
            <Icon name="arrow_right_line" />
          </Button>
        </HStack>
      </VStack>
    </Container>
  );
}
