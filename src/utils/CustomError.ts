class CustomError extends Error {
  constructor(
    public status: number,
    public publicMessage: string,
    public privateMessage: string = publicMessage,
    public name: string = "Error"
  ) {
    super();
  }
}

export default CustomError;
