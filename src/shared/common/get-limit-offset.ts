interface IGetLimitAndOffset {
    limit?: number;
    offset?: number;
}

const MAX_LIMIT_RECORDS = 1000;

export const getLimitAndOffset = ({
    limit,
    offset,
}: IGetLimitAndOffset = {}) => {
    const safeLimit = Number.isFinite(limit) ? Math.min(limit!, MAX_LIMIT_RECORDS) : MAX_LIMIT_RECORDS;
    const safeOffset = Number.isFinite(offset) ? Math.max(offset!, 0) : 0;

    return {
        limit: safeLimit,
        offset: safeOffset,
    };
};
