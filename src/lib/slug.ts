export const getHabitSlug = (name: string): string => {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/[\s_-]+/g, '-') // Replace spaces/underscores with a single hyphen
        .replace(/^-+|-+$/g, ''); // Trim hyphens from start/end
};