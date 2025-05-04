export interface IToken {
    generate(payload: any): Promise<string>;
    verify(token: string): Promise<any>;
} 