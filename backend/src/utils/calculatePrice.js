const calculatePrice = (startDate, endDate, pricePerDay) => {
    // Parse dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate time difference in ms
    const timeDiff = Math.abs(end.getTime() - start.getTime());

    // Calculate days (ceil to ensure at least 1 day if partial, or following business logic)
    // Usually car rental is per 24 hours or calendar day. 
    // Let's assume standard 1 day minimum and ceiling.
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24));

    const totalDays = days > 0 ? days : 1; // Minimum 1 day

    return {
        days: totalDays,
        totalPrice: totalDays * pricePerDay
    };
};

module.exports = calculatePrice;
