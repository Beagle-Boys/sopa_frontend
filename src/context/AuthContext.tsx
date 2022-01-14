import React, {
  useState,
  createContext,
  useContext,
  FunctionComponent,
} from "react";
import {
  api_login,
  api_logout,
  api_register,
  api_validate_login,
  api_validate_register,
} from "../apis";
import { AuthContextInterface, SignUpData } from "../interfaces";

const AuthContext = createContext<AuthContextInterface>({
  register: async (user_data) => "",
  login: async (mobile: string, countryCode: string) => "",
  validate_register: async (otp: string, mobile: string, otpId: string) => {},
  validate_login: async (otp: string, mobile: string, otpId: string) => {},
  x_sopa_key: null,
  logout: async () => {},
});

export function useAuthContext() {
  return useContext(AuthContext);
}

export const AuthProvider: FunctionComponent<{}> = ({ children }) => {
  const [x_sopa_key, setXSopaKey] = useState<string | null>(null);

  async function register(user_data: SignUpData) {
    console.log("register", user_data);
    let response = await api_register(user_data);
    console.log("response", response);
    return response["otpId"];
  }

  async function login(mobile: string, countryCode: string) {
    console.log("login", mobile);
    let response = await api_login({ mobile, countryCode });
    console.log("response", response);
    return response["otpId"];
  }

  async function validate_register(otp: string, mobile: string, otpId: string) {
    console.log("validate register", otp, mobile, otpId);
    let response = await api_validate_register({ otp, otpId, mobile });
    console.log("response", response);
    if (response["auth"] && typeof response["auth"] === "string")
      setXSopaKey(response['auth']);
  }

  async function validate_login(otp: string, mobile: string, otpId: string) {
    console.log("validate login", otp, mobile, otpId);
    let response = await api_validate_login({ otp, otpId, mobile });
    console.log("response", response);
    if (response.auth && typeof response.auth === "string")
      setXSopaKey(response.auth);
  }

  async function logout() {
    console.log("logout");
    if (!x_sopa_key) return;
    try {
      await api_logout(x_sopa_key);
    } catch (e) {
      console.error(e);
    } finally {
      setXSopaKey(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        x_sopa_key,
        register,
        login,
        logout,
        validate_login,
        validate_register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
