declare global {
  type Foo = 'bar';
  type backendResponse<T> = {
    FILE: string;
    LINE: number;
    code: number;
    response: T;
  };
}

export {};
