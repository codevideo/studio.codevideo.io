import { FieldValues } from 'react-hook-form'
import { addToast } from '../../store/toastSlice'
import { AppDispatch } from '../../store';
import { setContactSuccessful, setIsSubmitting } from '../../store/formsSlice';
import IMessageForm from '../../interfaces/IMessageForm';

export const postContactForm = async (data: FieldValues, dispatch: AppDispatch) => {
    // check that data has all fields needed to be of type IMessageForm
    if (!data.name || !data.email || !data.message) {
        dispatch(addToast('Error sending message! Did you fill out all the required fields?'))
        return;
    }
    dispatch(setIsSubmitting(true))
    const postData = data as IMessageForm
    try {
        await fetch('/.netlify/functions/contactForm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData),
        })
        dispatch(setIsSubmitting(false))
        dispatch(setContactSuccessful())
        dispatch(addToast("Message sent successfully! We'll get back to you as soon as possible."))
    } catch (error) {
        dispatch(setIsSubmitting(false))
        dispatch(addToast('Error sending message! Did you fill out all the required fields?'))
        return;
    }
}
