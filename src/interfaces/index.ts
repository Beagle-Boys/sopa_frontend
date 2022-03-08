export interface SignUpData {
  userName: string;
  countryCode: string;
  mobile: string;
  email?: string;
}

export interface AuthContextInterface {
  register: (user_data: SignUpData) => Promise<string>;
  validate_register: (
    otp: string,
    mobile: string,
    otpId: string
  ) => Promise<void>;
  validate_login: (otp: string, mobile: string, otpId: string) => Promise<void>;
  login: (mobile: string, countryCode: string) => Promise<string>;
  x_sopa_key: string | null;
  logout: () => Promise<void>;
  spot_add: (
    data: string,
    location: any,
    images: any,
    typev: string
  ) => Promise<void>;
  spot_image_add: (images: string[]) => Promise<[]>;
  spot_getall: (data: any) => Promise<[]>;
}
