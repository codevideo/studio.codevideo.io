import React, { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Text, Flex, Box, Button, TextField, Tooltip, Card, Code } from '@radix-ui/themes';
import { CopyIcon, CheckIcon, PlusCircledIcon, TrashIcon } from '@radix-ui/react-icons';

interface ApiKeySummary {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
  lastUsedAt: string | null;
}

// Manages the user's CodeVideo API keys via the codevideo-api endpoints
// (GATSBY_CODEVIDEO_API_URL/api-keys), authenticated with the Clerk session
// token — same pattern as ExportDropdown. The plaintext key is shown once.
export const ApiKeysSection = () => {
  const { isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();

  const [keys, setKeys] = useState<ApiKeySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null); // plaintext, shown once
  const [copied, setCopied] = useState(false);

  const apiBase = process.env.GATSBY_CODEVIDEO_API_URL;

  const load = async () => {
    if (!(isLoaded && isSignedIn)) return;
    try {
      const token = await getToken();
      const res = await fetch(`${apiBase}/api-keys`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setKeys(data.apiKeys || []);
    } catch (e) {
      console.error('Error loading API keys:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn]);

  const createKey = async () => {
    setCreating(true);
    try {
      const token = await getToken();
      const res = await fetch(`${apiBase}/api-keys`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() || 'API key' }),
      });
      const data = await res.json();
      if (res.ok) {
        setNewKey(data.plaintext);
        setName('');
        await load();
      }
    } catch (e) {
      console.error('Error creating API key:', e);
    } finally {
      setCreating(false);
    }
  };

  const revokeKey = async (id: string) => {
    try {
      const token = await getToken();
      await fetch(`${apiBase}/api-keys/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      await load();
    } catch (e) {
      console.error('Error revoking API key:', e);
    }
  };

  const copyNewKey = () => {
    if (!newKey) return;
    navigator.clipboard.writeText(newKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <Flex direction="column" gap="3">
      <Text size="1" color="gray">
        Keys let you call the CodeVideo API directly; requests draw on your account's tokens.
      </Text>

      {newKey && (
        <Card size="1" variant="surface">
          <Flex direction="column" gap="2" p="1">
            <Text size="1" color="amber" weight="medium">
              Copy this key now — you won't be able to see it again.
            </Text>
            <Flex gap="2">
              <TextField.Root
                style={{ flexGrow: 1, fontFamily: 'monospace' }}
                value={newKey}
                readOnly
                size="2"
              />
              <Tooltip content={copied ? 'Copied!' : 'Copy'}>
                <Button size="2" variant="soft" color={copied ? 'green' : 'gray'} onClick={copyNewKey}>
                  {copied ? <CheckIcon /> : <CopyIcon />}
                </Button>
              </Tooltip>
            </Flex>
          </Flex>
        </Card>
      )}

      <Flex gap="2">
        <TextField.Root
          style={{ flexGrow: 1 }}
          placeholder="Key name (e.g. CI, production)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          size="2"
        />
        <Button size="2" color="mint" onClick={createKey} disabled={creating}>
          <PlusCircledIcon />
          {creating ? 'Generating…' : 'Generate key'}
        </Button>
      </Flex>

      {loading ? (
        <Text size="1" color="gray">Loading API keys…</Text>
      ) : keys.length === 0 ? (
        <Text size="1" color="gray">No API keys yet.</Text>
      ) : (
        <Flex direction="column" gap="2">
          {keys.map((k) => (
            <Card key={k.id} size="1" variant="surface">
              <Flex align="center" justify="between" p="1" gap="2">
                <Box>
                  <Text size="2" weight="medium">{k.name}</Text>{' '}
                  <Code>{k.prefix}…</Code>{' '}
                  <Text size="1" color="gray">
                    {k.lastUsedAt
                      ? `last used ${new Date(k.lastUsedAt).toLocaleDateString()}`
                      : 'never used'}
                  </Text>
                </Box>
                <Tooltip content="Revoke">
                  <Button size="1" variant="soft" color="red" onClick={() => revokeKey(k.id)}>
                    <TrashIcon />
                  </Button>
                </Tooltip>
              </Flex>
            </Card>
          ))}
        </Flex>
      )}
    </Flex>
  );
};
