import React from 'react';
import { useState } from "react";
import { CourseMetadataForm } from "./CourseMetadataForm";
import { LessonMetadataForm } from "./LessonMetadataForm";
import { 
  Box,
  Button,
  Dialog,
  Flex,
  Text,
  Card
} from '@radix-ui/themes';
import { useAppSelector } from '../../../hooks/useAppSelector';

export const MetadataEditor = () => {
    const { currentProject } = useAppSelector(state => state.editor);
    const [isOpen, setIsOpen] = useState(false);
    
    const onClickCancel = () => {
        setIsOpen(false);
    }

    return (
        <Box>
            {/* Edit Metadata Button */}
            <Button
                onClick={() => setIsOpen(true)}
                variant="solid"
                color="mint"
                size="1"
            >
                Edit Metadata
            </Button>

            {/* Metadata Form Modal */}
            <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
                <Dialog.Content >
                    <Box>
                        {currentProject?.projectType === 'lesson' ? (
                            <LessonMetadataForm forCourse={false} isEdit={true} />
                        ) : currentProject?.projectType === 'course' ? (
                            <CourseMetadataForm isEdit={true}/>
                        ) : (
                            <Card >
                                <Flex direction="column" gap="4">
                                    <Text align="center" >
                                        Switch to "Lesson" or "Course" mode to edit metadata
                                    </Text>
                                    <Flex justify="end" mt="4">
                                        <Button
                                            onClick={onClickCancel}
                                            variant="surface"
                                        >
                                            Close
                                        </Button>
                                    </Flex>
                                </Flex>
                            </Card>
                        )}
                    </Box>
                </Dialog.Content>
            </Dialog.Root>
        </Box>
    );
};