export function calendarDateFormatter(day, month, year){
    const dayStr = String(day).padStart(2, "0")
    const monthStr = String(month + 1).padStart(2, "0");
    return`${year}-${monthStr}-${dayStr}`;
}