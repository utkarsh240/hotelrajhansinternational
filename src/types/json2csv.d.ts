declare module 'json2csv' {
  export function json2csv(data: any[], options?: any): string;
  export class Parser {
    constructor(opts?: any);
    parse(data: any): string;
  }
}
