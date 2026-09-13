import {
  AppFooter,
  AppHeader,
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  Link,
  List,
  ListItem,
  Markdown,
  Panel,
  Text,
  VStack,
} from "#/components/ui";
import { groupQuestionsByDifficulty } from "#/features/questions/group-by-difficulty";
import type { QuestionSummary, Subject } from "#/features/questions/types";
import { useMessages } from "#/i18n/locale";

export type TopPageProps = {
  /** 学習対象の技術 */
  subject: Subject;
  questions: QuestionSummary[];
  /** 問題の回答ページへのリンク先 */
  questionHref: (question: QuestionSummary) => string;
};

/** トップページ: 対象技術の概要と、難易度ごとの問題一覧 */
export function TopPage({ subject, questions, questionHref }: TopPageProps) {
  const messages = useMessages();
  const groups = groupQuestionsByDifficulty(questions);

  return (
    <Flex direction="column" minH="100dvh">
      <AppHeader homeHref="/" />
      <Box as="main" flex="1">
        <Container maxW="7xl" py="8">
          <VStack align="stretch" gap="8">
            <Panel variant="subtle" size="lg">
              <VStack align="stretch" gap="4">
                <Heading level="h1" size="32">
                  {subject.name}
                </Heading>
                <Markdown>{subject.description}</Markdown>
              </VStack>
            </Panel>

            <Box as="section" aria-label={messages.nav.questionList}>
              {groups.length === 0 ? (
                <Text color="muted">{messages.question.empty}</Text>
              ) : (
                <Flex gap="4" align="stretch" overflowX="auto" pb="2">
                  {groups.map((group) => (
                    <Panel
                      key={group.difficulty}
                      title={messages.difficulty[group.difficulty]}
                      titleLevel="h2"
                      scrollable
                      flex="none"
                      w="20rem"
                      maxH="32rem"
                    >
                      <List as="ol" spacing="4">
                        {group.questions.map((question) => (
                          <ListItem key={question.number} value={question.number}>
                            <HStack gap="1" align="center">
                              {question.solved && (
                                <Text as="span" color="success">
                                  <Icon
                                    name="complete_fill"
                                    size="sm"
                                    label={messages.question.solved}
                                  />
                                </Text>
                              )}
                              <Link href={questionHref(question)}>{question.title}</Link>
                            </HStack>
                          </ListItem>
                        ))}
                      </List>
                    </Panel>
                  ))}
                </Flex>
              )}
            </Box>
          </VStack>
        </Container>
      </Box>
      <AppFooter />
    </Flex>
  );
}
