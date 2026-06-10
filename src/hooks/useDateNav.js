import {useState} from 'react';
import {getToday, isSameDay} from '../utils/dateUtils';

export default function useDateNav(){
    const [selectedDate, setSelectedDate] = useState(getToday());
    const isToday = isSameDay(selectedDate, getToday());
    function goToPrev() {
        setSelectedDate(prev => {
        const d = new Date(prev);
        d.setDate(d.getDate() - 1);
        return d;
        });
    }

    function goToNext() {
        setSelectedDate(prev => {
        const d = new Date(prev);
        d.setDate(d.getDate() + 1);
        return d;
        });
    }
    return{selectedDate, isToday, goToPrev, goToNext,goToday: () => setSelectedDate(getToday())};
}