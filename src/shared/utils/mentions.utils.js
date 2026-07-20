export const extractMentions = (content = "") => {
    const matches =
        content.match(/@([a-zA-Z0-9_.-]+)/g);

    if (!matches) {
        return [];
    }

    return matches.map((mention) =>
        mention.substring(1).toLowerCase()
    );
};

export const hasMentions = (content = "") => {
    return /@[a-zA-Z0-9_.-]+/.test(content);
};