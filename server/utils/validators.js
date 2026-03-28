const { z } = require('zod');

const tripRequestSchema = z.object({
    destination: z.string().trim().min(2, "Destination name is too short"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    budget: z.enum(["budget", "moderate", "luxury"], { 
        errorMap: () => ({ message: "Budget must be budget, moderate, or luxury" }) 
    })
});

module.exports = { tripRequestSchema };