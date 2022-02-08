import MapboxGL from "@react-native-mapbox-gl/maps";
import React, {
  useState,
  createContext,
  useContext,
  FunctionComponent,
  useEffect,
} from "react";

const TabContext = createContext<any>({});

export function useTabContext() {
  return useContext(TabContext);
}

export const TabProvider: FunctionComponent<{}> = ({ children }) => {
  const [curCords, setCurCords] = useState<MapboxGL.Coordinates>();
  return (
    <TabContext.Provider value={{ curCords, setCurCords }}>
      {children}
    </TabContext.Provider>
  );
};
