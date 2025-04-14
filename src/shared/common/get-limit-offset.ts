interface IGetLimitAndOffset {
    limit?: number;
    offset?: number;
}

export const getLimitAndOffset = (
    { limit, offset }: IGetLimitAndOffset,
    maxLimit = 10
) => {
    const parsedLimit = !isNaN(Number(limit)) ? Number(limit) : maxLimit;
    const parsedOffset = !isNaN(Number(offset)) ? Number(offset) : 0;

    const _limit = Math.min(parsedLimit, maxLimit);

    return {
        limit: _limit,
        offset: parsedOffset,
    };
};
