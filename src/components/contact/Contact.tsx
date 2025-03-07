import React from 'react';
import { FieldValues } from 'react-hook-form';
import { useUser } from '@clerk/clerk-react';
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Link as RadixLink
} from '@radix-ui/themes';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { postContactForm } from '../../utils/api/postContactForm';
import { Form } from './Form';

export const Contact = () => {
  const { user } = useUser();
  const { isContactSuccessful, isSubmitting } = useAppSelector((state) => state.forms);
  const dispatch = useAppDispatch();

  const email = user ? user.primaryEmailAddress?.emailAddress || '' : '';
  const name = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '';

  return (
    <Container size="3" py="9" style={{ height: '80vh' }}>
      <Heading
        size="7"
        align="center"
        id="contact" // id needed for link routing
      >
        Contact
      </Heading>

      <Flex direction="column" align="center">
        <Text align="center" mt="3" mb="5">
          Don't hesitate to contact us 24/7 with questions, concerns, or ideas to make CodeVideo better.
        </Text>
        <Box maxWidth="700px">
          <Form
            name={name}
            email={email}
            messagePlaceholder="Questions, comments, critiques..."
            onSubmitForm={(data: FieldValues) => postContactForm(data, dispatch)}
            isSuccessful={isContactSuccessful}
            isSubmitting={isSubmitting}
          />

          <Flex direction="column" align="center" justify="center">
            <Text mt="6" mb="4">
              Or Email Us At:
            </Text>
            <Text >
              <RadixLink href="mailto:hi@fullstackcraft.com" target='_blank' style={{ color: 'var(--gray-12)' }}>
                hi@fullstackcraft.com
              </RadixLink>
            </Text>
          </Flex>
        </Box>
      </Flex>
    </Container>
  );
};