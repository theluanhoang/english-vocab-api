import { UnprocessableEntityException } from "@nestjs/common";
import { ReasonStatusCodes } from "./reason-status-code";
import { StatusCodes } from "./status-code";

const CODE_DEFAULT = 100;

class ErrorResponse extends Error {
    private status: number;
    private code: number;

    constructor(message: string, code: number, status: number) {
        super(message);
        this.status = status;
        this.code = code;
    }
}

class CONFLICT extends ErrorResponse {
    constructor(message = ReasonStatusCodes.CONFLICT, code = CODE_DEFAULT, status = StatusCodes.CONFLICT) {
        super(message, code, status);
    }
}

class FORBIDDEN extends ErrorResponse {
    constructor(message = ReasonStatusCodes.FORBIDDEN, code = CODE_DEFAULT, status = StatusCodes.FORBIDDEN) {
        super(message, code, status);
    }
}

class UNAUTHORIZED extends ErrorResponse {
    constructor(message = ReasonStatusCodes.UNAUTHORIZED, code = CODE_DEFAULT, status = StatusCodes.UNAUTHORIZED) {
        super(message, code, status);
    }
}

class BAD_REQUEST extends ErrorResponse {
    constructor(message = ReasonStatusCodes.BAD_REQUEST, code = CODE_DEFAULT, status = StatusCodes.BAD_REQUEST) {
        super(message, code, status);
    }
}

class UNPROCESSABLE_ENTITY extends ErrorResponse {
    constructor(
        message = ReasonStatusCodes.UNPROCESSABLE_ENTITY,
        code = CODE_DEFAULT,
        status = StatusCodes.UNPROCESSABLE_ENTITY,
    ) {
        super(message, code, status);
    }
}

export { CONFLICT, FORBIDDEN, UNAUTHORIZED, BAD_REQUEST, UNPROCESSABLE_ENTITY };