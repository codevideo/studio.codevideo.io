import * as React from 'react';
import { useEffect } from 'react';
import { Dialog, Flex, Text, Button, Box } from '@radix-ui/themes';

export interface IProjectConversionModalProps {
    currentType: 'course' | 'lesson' | 'actions' | '';
    targetType: 'course' | 'lesson' | 'actions' | '';
    onCancel: () => void;
    onConfirm: () => void;
}

export function ProjectConversionModal(props: IProjectConversionModalProps) {
    const { currentType, targetType, onCancel, onConfirm } = props;
    
    // Determine message based on conversion type
    const getMessage = () => {
        // Upgrades
        if (currentType === 'actions' && targetType === 'lesson') {
            return "Your actions will be converted to a lesson with empty metadata. You'll need to fill in details like name and description.";
        }

        if (currentType === 'actions' && targetType === 'course') {
            return "Your actions will be converted to a course with a single lesson. You'll need to fill in the course and lesson metadata.";
        }

        if (currentType === 'lesson' && targetType === 'course') {
            return "Your lesson will be converted to a course containing this lesson. You'll need to fill in the course metadata.";
        }

        // Downgrades (lossy conversions)
        if (currentType === 'course' && targetType === 'actions') {
            return "Warning: All course and lesson metadata will be lost. Your course will be converted to a single array of all actions compiled from each lesson.";
        }

        if (currentType === 'course' && targetType === 'lesson') {
            return "Warning: Course metadata will be lost. All actions from all lessons will be combined into a single lesson, and the metadata from the first lesson will be used.";
        }

        if (currentType === 'lesson' && targetType === 'actions') {
            return "Warning: Lesson metadata will be lost. Only the actions within the lesson will be preserved.";
        }

        return "Are you sure you want to convert your project?";
    };

    useEffect(() => {
        // Prevent scrolling when modal is open
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <Dialog.Root open={true} onOpenChange={(open) => !open && onCancel()}>
            <Dialog.Content style={{ maxWidth: 450 }}>
                <Dialog.Title>
                    <Text size="5" weight="medium" color="mint">
                        Confirm Conversion
                    </Text>
                </Dialog.Title>
                
                <Box mt="3" mb="4">
                    <Text size="3" color="mint">
                        {getMessage()}
                    </Text>
                </Box>
                
                <Flex justify="end" gap="3">
                    <Dialog.Close>
                        <Button 
                            onClick={onCancel}
                            variant="outline"
                            color="mint"
                        >
                            Cancel
                        </Button>
                    </Dialog.Close>
                    <Button 
                        onClick={onConfirm}
                        variant="solid"
                        color="blue"
                    >
                        Convert
                    </Button>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
}