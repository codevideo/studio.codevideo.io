import React from 'react';
import { Tooltip } from '@radix-ui/themes';
import { HighlightText } from '../../../HighlightText';


interface Match {
  message: string;
  offset: number;
  length: number;
  replacements: { value: string }[];
}

interface ISpellCheckTooltipProps {
  // full text from which the match is derived
  text: string;
  // single Match object returned from the API
  match: Match;
}

export const SpellCheckTooltip: React.FC<ISpellCheckTooltipProps> = ({ text, match }) => {
  // Extract the substring that should be highlighted
  const highlight = text.substring(match.offset, match.offset + match.length);
  // Use the first suggested replacement if available
  const suggestionValue = match && match.replacements && match.replacements.length > 0 ? match.replacements[0]?.value : '';

  const textContainer = (
    <div
      style={{
        border: '1px solid #ccc',
        padding: '0.5rem',
        borderRadius: '4px',
        backgroundColor: 'white',
        cursor: suggestionValue ? 'pointer' : 'default'
      }}
    >
      <HighlightText text={text} highlights={[highlight]} />
    </div>
  );

  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ marginBottom: '0.5rem' }}>
        <strong>Error:</strong> {match.message} (offset {match.offset})
      </div>
      {suggestionValue ? (
        <Tooltip content={`Suggested: ${suggestionValue}`} side="top" align="center">
          {textContainer}
        </Tooltip>
      ) : (
        textContainer
      )}
    </div>
  );
};
