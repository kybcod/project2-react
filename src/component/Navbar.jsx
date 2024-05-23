import { useNavigate } from "react-router-dom";
import { Box, Button, ButtonGroup, Flex, Spacer } from "@chakra-ui/react";
import React, { useContext } from "react";
import { LoginContext } from "./LoginProvider.jsx";

export function Navbar() {
  const navigate = useNavigate();
  const account = useContext(LoginContext);

  return (
    <Flex minWidth="max-content" alignItems="center" gap="3">
      <Box
        onClick={() => navigate("/")}
        cursor={"pointer"}
        _hover={{ bgColor: "gray.200" }}
      >
        Home
      </Box>
      <Box
        onClick={() => navigate("/write")}
        cursor={"pointer"}
        _hover={{ bgColor: "gray.200" }}
      >
        글쓰기
      </Box>
      <Box
        onClick={() => navigate("/signup")}
        cursor={"pointer"}
        _hover={{ bgColor: "gray.200" }}
      >
        회원가입
      </Box>
      <Box
        onClick={() => navigate("/member/list")}
        cursor={"pointer"}
        _hover={{ bgColor: "gray.200" }}
      >
        회원목록
      </Box>
      <Spacer />
      <ButtonGroup gap="1">
        <Button
          onClick={() => navigate("/login")}
          cursor={"pointer"}
          _hover={{ bgColor: "gray.200" }}
          colorScheme="teal"
        >
          로그인
        </Button>
        <Button
          onClick={() => {
            account.logout();
            navigate("/login");
          }}
          cursor={"pointer"}
          _hover={{ bgColor: "gray.200" }}
          colorScheme="teal"
        >
          로그아웃
        </Button>
      </ButtonGroup>
    </Flex>
  );
}
