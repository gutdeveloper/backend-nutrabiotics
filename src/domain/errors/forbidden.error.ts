export class ForbiddenError extends Error {
    public readonly statusCode: number = 403;
 
    constructor(message: string) {
        super(message);
        this.name = 'ForbiddenError';
    }
} 