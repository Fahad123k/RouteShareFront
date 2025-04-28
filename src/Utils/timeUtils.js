
export const calculateArrivalTime = (departureTime, arrivalMinutes) => {

    // Validate inputs
    if (!departureTime || !arrivalMinutes) return "N/A";

    // Convert minutes to number
    const mins = parseInt(arrivalMinutes, 10);
    if (isNaN(mins)) return "N/A";

    // Verify time format (HH:MM)
    const timeParts = departureTime.split(':');
    if (timeParts.length !== 2) return "N/A";

    const depHours = parseInt(timeParts[0], 10);
    const depMinutes = parseInt(timeParts[1], 10);

    if (isNaN(depHours) || isNaN(depMinutes)) return "N/A";

    // Calculate arrival time
    const totalMinutes = depHours * 60 + depMinutes + mins;
    let hours = Math.floor(totalMinutes / 60) % 24;
    const minutes = totalMinutes % 60;

    // Format to 12-hour with AM/PM
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert 0 to 12

    return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;

};

// Optional: Add time math utilities as separate exports
export const timeMath = {
    addMinutes: (time, minutes) => {
        const result = calculateArrivalTime(time, minutes);
        return result === "N/A" ? null : result;
    },
    timeToMinutes: (time) => {
        if (!time || !/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/.test(time)) return null;
        const [h, m] = time.split(':').map(Number);
        return h * 60 + m;
    },
    minutesToTime: (totalMinutes) => {
        if (isNaN(totalMinutes)) return null;
        const hours = Math.floor(totalMinutes / 60) % 24;
        const minutes = totalMinutes % 60;
        return `${hours}:${minutes.toString().padStart(2, '0')}`;
    }
};