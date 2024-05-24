import React, { createContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const LoginContext = createContext(null);
export function LoginProvider(props) {
  // 닉네임, 아이디, isLoggedIn, login, logout, hasAccess. isAdmin
  const [id, setId] = useState("");
  const [nickName, setNickName] = useState("");
  const [expired, setExpired] = useState(0);

  function isLoggedIn() {
    return Date.now() < expired * 1000;
  }

  function hasAccess(param) {
    return id == param;
  }

  function login(token) {
    localStorage.setItem("userId", token);
    const payload = jwtDecode(token);
    setExpired(payload.exp);
    setId(payload.sub);
    setNickName(payload.nickName);
  }

  function logout() {
    localStorage.removeItem("userId");
    setExpired(0);
    setId("");
    setNickName("");
  }

  return (
    <LoginContext.Provider
      value={{ id, nickName, login, logout, isLoggedIn, hasAccess }}
    >
      {children}
    </LoginContext.Provider>
  );
}
