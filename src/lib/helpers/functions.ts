export const toTitleCase = (str: string) => {
    return str.replace(/(^|\s)\S/g, (t) => t.toUpperCase());
};

export const toUrlSafe = (str: string) => {
    return str
        .toLowerCase()
        .replaceAll(/\s/g, '-')
        .replaceAll(/[^\w\-]/g, '');
};
