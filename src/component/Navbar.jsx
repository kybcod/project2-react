import { useNavigate } from "react-router-dom";
import { Box, Button, ButtonGroup, Flex, Spacer } from "@chakra-ui/react";
import React, { useContext } from "react";
import { LoginContext } from "./LoginProvider.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";

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
      {account.isLoggedIn() && (
        <Box
          onClick={() => navigate("/write")}
          cursor={"pointer"}
          _hover={{ bgColor: "gray.200" }}
        >
          글쓰기
        </Box>
      )}
      {account.isAdmin() && (
        <Box
          onClick={() => navigate("/member/list")}
          cursor={"pointer"}
          _hover={{ bgColor: "gray.200" }}
        >
          회원목록
        </Box>
      )}

      <Spacer />
      {/*아이콘 */}
      {account.isLoggedIn() && (
        <Box
          onClick={() => navigate(`/member/${account.id}`)}
          cursor={"pointer"}
          _hover={{ bgColor: "gray.200" }}
        >
          <FontAwesomeIcon icon={faUser} />
          {account.nickName}
        </Box>
      )}

      <ButtonGroup gap="1">
        {account.isLoggedIn() || (
          <Button
            onClick={() => navigate("/signup")}
            cursor={"pointer"}
            _hover={{ bgColor: "gray.200" }}
            colorScheme="teal"
          >
            회원가입
          </Button>
        )}
        {account.isLoggedIn() || (
          <Button
            onClick={() => navigate("/login")}
            cursor={"pointer"}
            _hover={{ bgColor: "gray.200" }}
            colorScheme="teal"
          >
            로그인
          </Button>
        )}
        {account.isLoggedIn() && (
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
        )}
      </ButtonGroup>
    </Flex>
  );
}
