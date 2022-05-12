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
    api_user_details,
    api_update_user_details,
    api_search_spots,
    api_get_spot_details,
    api_create_reservation,
    api_list_reservation_created,
    api_list_reservation_raised,
    api_respond_reservation,
    api_initiate_premium,
    api_complete_premium,
    api_insert_spot_review,
    api_bookmark_add,
    api_bookmark_delete,
    api_bookmarks_fetch,
    api_is_bookmark
} from "../apis";
import { AuthContextInterface, SignUpData } from "../interfaces";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ImgToBase64 from "react-native-image-base64";
import SplashScreen from "react-native-splash-screen";

const AuthContext = createContext<AuthContextInterface>({
    register: async (user_data) => "",
    login: async (mobile: string, countryCode: string) => "",
    validate_register: async (otp: string, mobile: string, otpId: string) => { },
    validate_login: async (otp: string, mobile: string, otpId: string) => { },
    x_sopa_key: null,
    logout: async () => { },
    spot_add: async (
        data: any,
        location: any,
        images: any,
        typev: string
    ) => { },
    spot_image_add: async (images: any[]) => [],
    spot_getall: async (data: any[]) => [],
    user_details_fetch: async () => { },
    user_details_update: async (data: any) => { },
    spot_search: async (query: string) => [],
    spot_getById: async (spotId: string) => { },
    spot_create_reservation: async (spotId: string, data: any) => { },
    spot_list_reservation_created: async () => [],
    spot_list_reservation_raised: async () => [],
    spot_reservation_respond: async (data: any) => { },
    user_initiate_premium: async () => { },
    user_complete_premium: async (data: any) => { },
    user_detail: {},
    profile_pic: "",
    bookmarks_fetch: async () => [],
    bookmark_add: async () => [],
    bookmark_delete: async () => [],
    spot_insert_review: async () => {},
    api_is_bookmark: async () => "",
    bookmark_list: [],
});

export function useAuthContext() {
    return useContext(AuthContext);
}

export const AuthProvider: FunctionComponent<{}> = ({ children }) => {
    useEffect(() => {
        AsyncStorage.getItem("@x_sopa_key")
            .then((x_sopa_key) => {
                setXSopaKey(x_sopa_key);
                console.log("SOPA KEY : " + x_sopa_key);
            })
            .catch((e) => console.log(e))
            .finally(() => SplashScreen.hide());
    }, []);
    const [x_sopa_key, setXSopaKey] = useState<string | null>(null);
    const [user_detail, set_user_detail] = useState(null);
    const [profile_pic, set_profile_pic] = useState();
    const [bookmark_list, set_bookmark_list] = useState([]);

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
        data: any,
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
        await Promise.all(imagesURI).then((a) => (imagesURI = a));
        // console.log(imagesURI)
        // console.log(imagesURI.length + " AuthContext ");
        // console.log(imagesURI.slice(0, 40));
        try {
            const id = await api_spot_image_add(x_sopa_key, imagesURI);
            console.log("image id from context " + id);
            return id;
        } catch (e) {
            console.error(e);
        }
    }

    async function spot_getall(data: any) {
        // console.log("Fetch All Spots DATA :");

        console.log(data);
        if (!x_sopa_key) return;
        try {
            const spots = await api_spot_getall(x_sopa_key, data, 12000000, true);
            // console.log("Auth Spots :");
            // console.log(spots);
            return spots;
        } catch (e) {
            console.error(e);
        }
    }

    async function spot_reservation_respond(data: any) {
        console.log("Responding to Reservation");
        if (!x_sopa_key) return;
        try {
            const spots = await api_respond_reservation(x_sopa_key, data);
            console.log(spots);
            return spots;
        } catch (e) {
            console.error(e);
        }
    }

    async function user_details_fetch() {
        if (!x_sopa_key) return;
        try {
            const user_details = await api_user_details(x_sopa_key);
            console.log("Auth User Details :");
            console.log(user_details);
            set_user_detail(user_details);
            fetch(user_details.imageUrl).then(r => r.text()).then(res => set_profile_pic(res)).then(() => { console.log(profile_pic) });
            return user_details;
        } catch (e) {
            console.error(e);
        }
    }

    async function user_details_update(data: any) {
        console.log(data);
        if (!x_sopa_key) return;
        try {
            const user_details = await api_update_user_details(x_sopa_key, data);
            console.log("Auth User Details :");
            console.log(user_details);
            return user_details;
        } catch (e) {
            console.error(e);
        }
    }

    async function spot_search(query: string) {
        console.log("Searching All Spots");
        if (!x_sopa_key) return;
        try {
            const spots = await api_search_spots(x_sopa_key, query);
            console.log("Auth Spots Searched :");
            console.log(spots);
            return spots;
        } catch (e) {
            console.error(e);
        }
    }

    async function spot_getById(spotId: string) {
        console.log("Get by Id Spot");
        if (!x_sopa_key) return;
        try {
            const spot = await api_get_spot_details(x_sopa_key, spotId);
            console.log(spot);
            return spot;
        } catch (e) {
            console.error(e);
        }
    }

    async function spot_create_reservation(spotId: string, data: any) {
        console.log("Creating Spot Reservation");
        if (!x_sopa_key) return;
        try {
            console.log(data);
            const spot = await api_create_reservation(x_sopa_key, data, spotId);
            console.log(spot);
            return spot;
        } catch (e) {
            console.error(e);
        }
    }

    async function spot_list_reservation_created() {
        console.log("Fetch All Created Reservation");
        if (!x_sopa_key) return;
        try {
            const spots = await api_list_reservation_created(x_sopa_key);
            console.log("Reservations Created : ");
            console.log(spots);
            return spots;
        } catch (e) {
            console.error(e);
        }
    }

    async function spot_list_reservation_raised() {
        console.log("Fetch All Created Reservation");
        if (!x_sopa_key) return;
        try {
            const spots = await api_list_reservation_raised(x_sopa_key);
            console.log("Raised Reservations : ");
            console.log(spots);
            return spots;
        } catch (e) {
            console.error(e);
        }
    }

    async function user_initiate_premium() {
        console.log("Initiating Premium");
        if (!x_sopa_key) return;
        try {
            const spots = await api_initiate_premium(x_sopa_key);
            console.log(spots);
            return spots;
        } catch (e) {
            console.error(e);
        }
    }

    async function user_complete_premium(data: any) {
        console.log("Completeing Premium");
        if (!x_sopa_key) return;
        try {
            const spots = await api_complete_premium(x_sopa_key, data);
            console.log(spots);
            return spots;
        } catch (e) {
            console.error(e);
        }
    }

    async function spot_insert_review( spotId: string, data: any) {
        console.log("Inserting Review");
        if (!x_sopa_key) return;
        try {
            const spots = await api_insert_spot_review(x_sopa_key, data, spotId);
            console.log(spots);
            return spots;
        } catch (e) {
            console.error(e);
        }
    }


    async function bookmarks_fetch() {
        console.log("Fetching Bookmarks");
        if (!x_sopa_key) return;
        try {
            const spots = await api_bookmarks_fetch(x_sopa_key);
            console.log(spots);
            set_bookmark_list(spots);
            return spots;
        } catch (e) {
            console.error(e);
        }
    }

    async function bookmark_add(spotId: string) {
        console.log("Adding Bookmarks");
        if (!x_sopa_key) return;
        try {
            const spots = await api_bookmark_add(x_sopa_key, spotId);
            console.log(spots);
            set_bookmark_list(spots);
            return spots;
        } catch (e) {
            console.error(e);
        }
    }

    async function bookmark_delete(spotId: string) {
        console.log("Deleting Bookmarks");
        if (!x_sopa_key) return;
        try {
            const spots = await api_bookmark_delete(x_sopa_key, spotId);
            console.log(spots);
            set_bookmark_list(spots);
            return spots;
        } catch (e) {
            console.error(e);
        }
    }

    async function is_bookmark(spotId: string) {
        console.log("Checking Bookmarks State");
        if (!x_sopa_key) return;
        try {
            const spots = await api_is_bookmark(x_sopa_key, spotId);
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
                user_details_fetch,
                user_details_update,
                spot_search,
                spot_getById,
                spot_create_reservation,
                spot_list_reservation_created,
                spot_list_reservation_raised,
                spot_reservation_respond,
                user_initiate_premium,
                user_complete_premium,
                user_detail,
                profile_pic,
                bookmarks_fetch,
                bookmark_add,
                bookmark_delete,
                spot_insert_review,
                is_bookmark,
                bookmark_list,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
