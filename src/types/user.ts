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

export interface Friend {
  id: string;
  name: string;
  username: string;
  email: string;
  status?: string;
  icon: React.ReactNode;
  color: string;
  initial: string;
  mutuals?: number;
}

export interface UserData {
  _id: string;
  name: string;
  username: string;
  email: string;
  dob: string;
  createdAt: string;
  bio?: string;
  location?: string;
  website?: string;
}
