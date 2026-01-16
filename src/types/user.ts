export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  createdAt: string;
  dob: string;
  icon: React.ReactNode;
  color: string;
  initial?: string;
  handle?: string;
  status?: string;
}

export type FetchStatus = "idle" | "loading" | "success" | "error";
