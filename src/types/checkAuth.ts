export type CheckAuthValues = {
  id: number;
  username: string;
  email: string;
  is_email_verified: boolean;
  password: string;
  gender: string;
  phone: string;
  address: string;
  photo: string;
  role: {
    id: number,
    role: string,
  };
};
