import { format, isValid, parseISO } from 'date-fns';

export function formatDate(dateString: string | undefined): string {
    if (!dateString) return 'Not specified';
    const date = parseISO(dateString);
    return isValid(date) ? format(date, 'yyyy/MM/dd') : 'Invalid Date';
}