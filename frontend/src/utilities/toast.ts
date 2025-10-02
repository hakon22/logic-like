import { toast as reactToastify } from 'react-toastify';

type ToastType = 'info' | 'success' |'warning' | 'error';

export const toast = (text: string, type: ToastType) => reactToastify[type](text);
