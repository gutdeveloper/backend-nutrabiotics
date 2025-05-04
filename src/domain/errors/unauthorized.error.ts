export class UnauthorizedError extends Error {
    public readonly statusCode: number = 401;
 
    constructor(message: string) {
        super(message);
        this.name = 'UnauthorizedError';
    }
} 