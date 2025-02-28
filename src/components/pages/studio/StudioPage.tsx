import React, { useState } from 'react';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { CreateNewOverlay } from './components/start/CreateNewOverlay';
import { CourseMetadataForm } from './components/sidebar/CourseMetadataForm';
import { MainStudio } from './components/main/MainStudio';
import { ProjectType } from '@fullstackcraftllc/codevideo-types';
import { LessonMetadataForm } from './components/sidebar/LessonMetadataForm';

export function StudioPage() {
    const { currentProjectIndex } = useAppSelector(state => state.editor);
    const [selectedProjectType, setSelectedProjectType] = useState<ProjectType>('');

    const onClickCancelCourse = () => {
        setSelectedProjectType('');
    };

    const onClickCancelLesson = () => {
        setSelectedProjectType('');
    };

    // currently in unselected mode, show start overlay
    if (currentProjectIndex === -1) {
        return <CreateNewOverlay setSelectedProjectType={setSelectedProjectType}/>
    }

    if (selectedProjectType === 'course') {
        console.log('rendering course metadata form')   
        // form for course metadata
        return <CourseMetadataForm onClickCancel={onClickCancelCourse}/>
    }

    if (selectedProjectType === 'lesson') {
        console.log('rendering lesson metadata form')
        // form for lesson metadata
        return <LessonMetadataForm forCourse={false} onClickCancel={onClickCancelLesson}/>
    }

    // have at least 1 project, show the main studio
    return <MainStudio/>
}

export default StudioPage;