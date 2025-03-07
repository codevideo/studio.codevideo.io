import * as React from 'react';
import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import {
    Box,
    Flex,
    Grid,
    Text,
    TextField,
    TextArea,
    Button
} from '@radix-ui/themes';

// Constants (to replace the import)
const CONSTANTS = {
    FORMS_MESSAGE_MIN_LENGTH: 10,
    FORMS_MESSAGE_MAX_LENGTH: 500
};

export interface IFormData {
    name: string;
    email: string;
    message: string;
}

export interface IFormProps {
    name: string;
    email: string;
    messagePlaceholder: string;
    onSubmitForm: (data: FieldValues) => void;
    isSuccessful: boolean;
    isSubmitting: boolean;
}

export const Form = (props: IFormProps) => {
    const { name, email, messagePlaceholder, onSubmitForm, isSuccessful, isSubmitting } = props;
    const [message, setMessage] = useState<string>('');
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const onSubmit = (data: FieldValues) => {
        onSubmitForm(data);
    };

    const messageLengthColor =
        message.length > CONSTANTS.FORMS_MESSAGE_MAX_LENGTH || message.length < CONSTANTS.FORMS_MESSAGE_MIN_LENGTH
            ? 'red'
            : 'gray';

    const resolveSubmitButtonText = () => {
        if (isSuccessful) {
            return '👍 Sent';
        }
        if (isSubmitting) {
            return '✈️ Sending...';
        }

        return '✈️ Send';
    };

    const submitButtonText = resolveSubmitButtonText();

    return (
        <Box>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid columns={{ initial: '1', md: '2' }} gap="4">
                    <Box>
                        <TextField.Root size="3" mb="2"
                            disabled={isSuccessful || isSubmitting}
                            defaultValue={name}
                            placeholder="Name"
                            {...register('name', { required: true })}
                        />

                        {errors.name && (
                            <Text size="2" color="red">
                                Please enter your name.
                            </Text>
                        )}
                    </Box>

                    <Box>
                        <TextField.Root size="3"
                            disabled={isSuccessful || isSubmitting}
                            defaultValue={email}
                            type="email"
                            placeholder="Email"
                            {...register('email', { required: true })}
                        />

                        {errors.email && (
                            <Text size="2" color="red">
                                Please enter your email.
                            </Text>
                        )}
                    </Box>

                    <Box style={{ gridColumn: '1 / -1' }}>
                        <TextArea
                            size="3"
                            disabled={isSuccessful || isSubmitting}
                            placeholder={messagePlaceholder}
                            rows={5}
                            style={{ width: '100%' }}
                            {...register('message', {
                                required: true,
                                onChange: (event: any) => setMessage(event.target.value),
                                minLength: {
                                    value: CONSTANTS.FORMS_MESSAGE_MIN_LENGTH,
                                    message: `Your message must be at least ${CONSTANTS.FORMS_MESSAGE_MIN_LENGTH} characters long!`
                                },
                                maxLength: {
                                    value: CONSTANTS.FORMS_MESSAGE_MAX_LENGTH,
                                    message: `Your message can only be a maximum of ${CONSTANTS.FORMS_MESSAGE_MAX_LENGTH} characters!`
                                }
                            })}
                        />
                        <Flex justify="end" mt="1">
                            <Text size="2" color={messageLengthColor}>
                                {message.length} / {CONSTANTS.FORMS_MESSAGE_MAX_LENGTH}
                            </Text>
                        </Flex>
                        {errors.message && errors.message.type === 'required' && (
                            <Text size="2" color="red">
                                Please write your message.
                            </Text>
                        )}
                        {errors.message && errors.message.message && (
                            <Text size="2" color="red">
                                {errors.message.message?.toString()}
                            </Text>
                        )}
                    </Box>
                </Grid>

                <Flex justify="center" mt="2" mb="5">
                    <Button
                        type="submit"
                        disabled={isSuccessful || isSubmitting}
                        size="2"
                    >
                        {submitButtonText}
                    </Button>
                </Flex>
            </form>
        </Box>
    );
}