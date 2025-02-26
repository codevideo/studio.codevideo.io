export interface ModalState {
    isOpen: boolean;
    modalType: string | null;
    modalProps?: Record<string, any>;
}

export enum ModalTypes {
    CONFIRM = 'CONFIRM',
    ALERT = 'ALERT',
    CUSTOM = 'CUSTOM'
}
