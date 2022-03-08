import React, {
  useState,
  createContext,
  useContext,
  FunctionComponent,
  useEffect,
} from "react";
import {
  api_login,
  api_logout,
  api_register,
  api_validate_login,
  api_validate_register,
  api_spot_add,
  api_spot_getall,
  api_spot_image_add,
} from "../apis";
import { AuthContextInterface, SignUpData } from "../interfaces";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ImgToBase64 from "react-native-image-base64";
import SplashScreen from "react-native-splash-screen";

const AuthContext = createContext<AuthContextInterface>({
  register: async (user_data) => "",
  login: async (mobile: string, countryCode: string) => "",
  validate_register: async (otp: string, mobile: string, otpId: string) => {},
  validate_login: async (otp: string, mobile: string, otpId: string) => {},
  x_sopa_key: null,
  logout: async () => {},
  spot_add: async (
    data: string,
    location: any,
    images: any,
    typev: string
  ) => {},
  spot_image_add: async (images: any[]) => [],
  spot_getall: async (data: any[]) => [],
});

export function useAuthContext() {
  return useContext(AuthContext);
}

export const AuthProvider: FunctionComponent<{}> = ({ children }) => {
  useEffect(() => {
    AsyncStorage.getItem("@x_sopa_key")
      .then((x_sopa_key) => setXSopaKey(x_sopa_key))
      .catch((e) => console.log(e))
      .finally(() => SplashScreen.hide());
  }, []);
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
    if (response["auth"] && typeof response["auth"] === "string") {
      setXSopaKey(response["auth"]);
      AsyncStorage.setItem("@x_sopa_key", response["auth"]);
    }
  }

  async function validate_login(otp: string, mobile: string, otpId: string) {
    console.log("validate login", otp, mobile, otpId);
    let response = await api_validate_login({ otp, otpId, mobile });
    console.log("response", response);
    if (response.auth && typeof response.auth === "string") {
      setXSopaKey(response.auth);
      AsyncStorage.setItem("@x_sopa_key", response["auth"]);
    }
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
      AsyncStorage.removeItem("@x_sopa_key");
    }
  }

  async function spot_add(
    data: string,
    location: any,
    images: any,
    typev: string
  ) {
    console.log("spot add");
    if (!x_sopa_key) return;
    try {
      await api_spot_add(x_sopa_key, {
        address: { data, location },
        images,
        type: typev,
      });
    } catch (e) {
      console.error(e);
    }
  }

  async function spot_image_add(images: any[]) {
    console.log(`Uploading ${images.length} Images`);
    if (!x_sopa_key) return;
    let imagesURI: string[] = [];
    let value = 0;
    imagesURI = images.map((x) =>
      ImgToBase64.getBase64String(x)
        .then((base: string) => base)
        .catch((e) => console.log("Base64 ERROR"))
    );
    Promise.all(imagesURI).then((a) => (imagesURI = a));
    setTimeout(async () => {
      // console.log(imagesURI)
      // console.log(imagesURI.length + " AuthContext ");
      // console.log(imagesURI.slice(0, 40));
      try {
        console.log("auth context spot add");
        return await api_spot_image_add(x_sopa_key, imagesURI);
      } catch (e) {
        console.error(e);
      }
    });
  }

  async function spot_getall(data: any) {
    console.log("Fetch All Spots");
    if (!x_sopa_key) return;
    try {
      const spots = await api_spot_getall(x_sopa_key, data, 9999999999, false);
      console.log("Auth Spots :");
      console.log(spots);
      return spots;
    } catch (e) {
      console.error(e);
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
        spot_add,
        spot_image_add,
        spot_getall,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
