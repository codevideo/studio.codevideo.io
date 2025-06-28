import * as React from 'react';
import { Box, Card, Flex, Text, Button, Badge } from '@radix-ui/themes';
import { LightningBoltIcon } from '@radix-ui/react-icons';

export interface IExamplePromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

const EXAMPLE_PROMPTS = [
  {
    category: 'Courses',
    examples: [
      'Create a Python course about data structures with 5 lessons covering arrays, linked lists, stacks, queues, and trees',
      'Create a JavaScript course about async programming with 3 lessons covering promises, async/await, and error handling',
      'Create a React course for beginners with 4 lessons covering components, props, state, and hooks',
    ]
  },
  {
    category: 'Lessons',
    examples: [
      'Create a lesson about Python functions with examples and exercises',
      'Create a lesson explaining REST APIs with practical examples',
      'Create a lesson about CSS flexbox with interactive examples',
    ]
  },
  {
    category: 'Videos',
    examples: [
      'Generate a video showing how to create a simple React component',
      'Create a video demonstrating Python list comprehensions',
      'Make a video explaining the difference between var, let, and const in JavaScript',
    ]
  }
];

export function ExamplePrompts(props: IExamplePromptsProps) {
  const { onSelectPrompt } = props;

  return (
    <Box>
      <Flex direction="column" gap="4">
        <Flex align="center" gap="2">
          <LightningBoltIcon color="var(--mint-9)" />
          <Text size="3" weight="bold" color="mint">
            Example Prompts
          </Text>
        </Flex>
        
        {EXAMPLE_PROMPTS.map((category) => (
          <Card key={category.category} variant="surface">
            <Flex direction="column" gap="3">
              <Badge color="mint" variant="soft" size="1">
                {category.category}
              </Badge>
              
              <Flex direction="column" gap="2">
                {category.examples.map((example, index) => (
                  <Card 
                    key={index}
                    variant="ghost" 
                    style={{ cursor: 'pointer' }}
                    onClick={() => onSelectPrompt(example)}
                  >
                    <Text size="2" style={{ lineHeight: '1.4' }}>
                      "{example}"
                    </Text>
                  </Card>
                ))}
              </Flex>
            </Flex>
          </Card>
        ))}
        
        <Card variant="surface">
          <Flex direction="column" gap="2">
            <Badge color="blue" variant="soft" size="1">
              Tips
            </Badge>
            <Text size="2" color="gray">
              • Be specific about what you want to create
              • Mention the number of lessons for courses
              • Include topics you want covered
              • You can also use direct tool calls for advanced usage
            </Text>
          </Flex>
        </Card>
      </Flex>
    </Box>
  );
}
