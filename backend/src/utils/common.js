// Structure for response
export class APIResponse {
    constructor(status, message = "", data="") {
      this.status = status
      this.message = message;
      this.data = data;
    }
  }
export const containsOnlyNumbers = (str) => {
  return /^\d+$/.test(str);
}