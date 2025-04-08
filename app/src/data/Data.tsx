import { User } from "@ice-scout/api/src/utils/dbtypes.ts";
import { useEffect, useState } from "react";
import { initDB } from "../utils/idb.ts";
import DataLayout from "./DataLayout.tsx";
import Login from "./Login.tsx";

export default function Data() {
  const [token, setTokenState] = useState<string>(() => {
    if (
      localStorage.getItem("token") !== null &&
      localStorage.getItem("tokenExpiresAt") !== null &&
      localStorage.getItem("permLevel") !== null
    ) {
      if (Date.now() < parseInt(localStorage.getItem("tokenExpiresAt")!)) {
        return localStorage.getItem("token")!;
      }
    }
    return "";
  });
  const [permLevel, setPermLevelState] = useState<User["permLevel"]>(
    (localStorage.getItem("permLevel") || "none") as User["permLevel"]
  );
  const setToken = (
    newToken: string,
    expiresAt: number,
    permLevel: User["permLevel"]
  ) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("tokenExpiresAt", expiresAt.toString());
    setTokenState(newToken);
    localStorage.setItem("permLevel", permLevel);
    setPermLevelState(permLevel);
  };

  useEffect(() => {
    initDB();
  }, []);

  return (
      token === "" ||
        !["demo", "team", "datamanage", "admin"].includes(permLevel)
    ) ?
      <Login setToken={setToken} />
    : <DataLayout
        setToken={setToken}
        permLevel={permLevel}
      />;
}
