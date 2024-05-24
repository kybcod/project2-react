import React, { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const LoginContext = createContext(null);

export function LoginProvider({ children }) {
  const [id, setId] = useState("");
  const [nickName, setNickName] = useState("");
  const [expired, setExpired] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token === null) {
      return;
    } else {
      login(token);
    }
  }, []);

  // 현재 로그인 된 상태인지 알아보는 함수
  function isLoggedIn() {
    // 현제 시간이 토큰 만료시간보다 작으면 로그인 크면 로그아웃
    return Date.now() < expired * 1000; //단위가 다름
  }

  function login(token) {
    //로그인할 때 expire 업데이트
    localStorage.setItem("token", token);
    const payload = jwtDecode(token);
    setExpired(payload.exp);
    setId(payload.sub);
    setNickName(payload.nickName);
  }

  function logout() {
    localStorage.removeItem("token");
    setExpired(0);
    setId("");
    setNickName("");
  }

  // 권한 있는지
  function hasAccess(param) {
    return id == param;
  }

  return (
    <LoginContext.Provider
      value={{
        id,
        nickName,
        login,
        logout,
        isLoggedIn,
        hasAccess,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
}
