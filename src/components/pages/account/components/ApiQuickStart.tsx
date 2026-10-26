import React, { useState } from 'react';
import { Box, Button, Code, Flex, Link as RadixLink, Strong, Text, Tooltip } from '@radix-ui/themes';
import { CopyIcon, CheckIcon } from '@radix-ui/react-icons';

// Same wording and example as docs.codevideo.io (docs/quick-start.md) and
// codevideo.io (src/components/pages/home/components/ApiQuickStartSection.tsx).
// Keep the three in sync.
const curlExample = `export CODEVIDEO_API_KEY="cvk_your_key_here"

curl -X POST https://api.codevideo.io/create-video-v3 \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: $CODEVIDEO_API_KEY" \\
  -d '{
    "project": [
      { "name": "author-speak-before", "value": "Here is how to log a value in JavaScript." },
      { "name": "file-explorer-create-file", "value": "index.js" },
      { "name": "file-explorer-open-file", "value": "index.js" },
      { "name": "editor-type", "value": "console.log(1 + 1);" },
      { "name": "author-speak-before", "value": "Run it and you will see 2 in the console." }
    ]
  }'`;

export const ApiQuickStart = () => {
  const [copied, setCopied] = useState(false);

  const copyExample = () => {
    navigator.clipboard
      .writeText(curlExample)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      })
      .catch((e) => console.error('Error copying the API example:', e));
  };

  return (
    <Flex direction="column" gap="3">
      <Text size="2" weight="medium">API Quick Start</Text>
      <Text size="1" color="gray">
        Turn a JSON list of actions into a narrated coding video with one request.
      </Text>

      <ol style={{ margin: 0, paddingLeft: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
        <li>
          <Text size="1">
            <Strong>Get an API key.</Strong> Generate a key above. Copy it right away; it's shown once.
            New accounts get 50 free tokens, and each video costs 10.
          </Text>
        </li>
        <li>
          <Text size="1">
            <Strong>Send your actions.</Strong> POST them to <Code size="1">https://api.codevideo.io/create-video-v3</Code>{' '}
            with your key in the <Code size="1">x-api-key</Code> header.
          </Text>
        </li>
        <li>
          <Text size="1">
            <Strong>Get your video.</Strong> The API replies once the job is queued, and we email you a link to
            the MP4 when rendering finishes.
          </Text>
        </li>
      </ol>

      <Box position="relative">
        <Code size="1" style={{ display: 'block', whiteSpace: 'pre', overflowX: 'auto', padding: 'var(--space-3)' }}>
          {curlExample}
        </Code>
        <Tooltip content={copied ? 'Copied!' : 'Copy'}>
          <Button
            size="1"
            variant="soft"
            color={copied ? 'green' : 'gray'}
            onClick={copyExample}
            style={{ position: 'absolute', top: 'var(--space-2)', right: 'var(--space-2)' }}
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
          </Button>
        </Tooltip>
      </Box>

      <Text size="1" color="gray">
        Response: <Code size="1">{'{"message":"Video generation enqueued successfully"}'}</Code>
      </Text>
      <Text size="1" color="gray">
        Full docs:{' '}
        <RadixLink href="https://docs.codevideo.io" target="_blank" rel="noopener">docs.codevideo.io</RadixLink>
        {' · '}All 133 actions:{' '}
        <RadixLink href="https://docs.codevideo.io/actions" target="_blank" rel="noopener">docs.codevideo.io/actions</RadixLink>
      </Text>
    </Flex>
  );
};
