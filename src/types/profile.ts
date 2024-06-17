export type ProfileValues = {
  id: number;
  username: string;
  email: string;
  password: string;
  gender: string;
  phone: string;
  address: string;
  photo: File | string;
  role: {
    id: number;
    role: string;
  }
};
