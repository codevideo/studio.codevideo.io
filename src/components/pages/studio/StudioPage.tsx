import React from 'react';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { CreateNewOverlay } from './components/start/CreateNewOverlay';
import { MainStudio } from './components/main/MainStudio';
import { CourseMetadataForm } from '../../layout/sidebar/CourseMetadataForm';
import { LessonMetadataForm } from '../../layout/sidebar/LessonMetadataForm';

export function StudioPage() {
    const { locationInStudio: createNewStep } = useAppSelector(state => state.editor);


    // currently in unselected mode, show start overlay
    if (createNewStep === 'select') {
        return <CreateNewOverlay />
    }

    if (createNewStep === 'course') {
        console.log('rendering course metadata form')   
        // form for course metadata
        return <CourseMetadataForm isEdit={false}/>
    }

    if (createNewStep === 'lesson') {
        console.log('rendering lesson metadata form')
        // form for lesson metadata
        return <LessonMetadataForm forCourse={false} isEdit={false}/>
    }

    // have at least 1 project, show the main studio
    return <MainStudio/>
}

export default StudioPage;