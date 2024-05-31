import { useNavigate } from "react-router-dom";
import { Button, ButtonGroup, Center, Flex, Spacer } from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { LoginContext } from "./LoginProvider.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faHouse } from "@fortawesome/free-solid-svg-icons";

export function Navbar() {
  const [ani1, setAni1] = useState(false);
  const navigate = useNavigate();
  const account = useContext(LoginContext);

  return (
    <Flex
      minWidth="max-content"
      alignItems="center"
      gap="3"
      px={{
        lg: 200,
        base: 0,
      }}
      height={20}
      bgColor="blue.900"
      color="white"
    >
      <Center
        onClick={() => navigate("/")}
        cursor={"pointer"}
        _hover={{ bgColor: "blue.300" }}
        p={8}
        fontSize={20}
        fontWeight={600}
      >
        <FontAwesomeIcon
          style={{ fontSize: "30px" }}
          onMouseOver={() => setAni1(true)}
          onMouseLeave={() => setAni1(false)}
          icon={faHouse}
          beatFade={ani1}
        />
      </Center>
      {account.isLoggedIn() && (
        <Center
          onClick={() => navigate("/write")}
          cursor={"pointer"}
          _hover={{ bgColor: "blue.300" }}
          p={8}
          fontSize={20}
          fontWeight={600}
        >
          글쓰기
        </Center>
      )}

      <Spacer />
      {/*아이콘 */}
      {account.isLoggedIn() && (
        <Center
          onClick={() => navigate(`/member/${account.id}`)}
          cursor={"pointer"}
          _hover={{ bgColor: "blue.300" }}
          p={8}
          fontSize={20}
          fontWeight={600}
        >
          <FontAwesomeIcon icon={faUser} />
          {account.nickName}
        </Center>
      )}

      {account.isAdmin() && (
        <Center
          onClick={() => navigate("/member/list")}
          cursor={"pointer"}
          _hover={{ bgColor: "blue.300" }}
          p={8}
          fontSize={20}
          fontWeight={600}
        >
          회원목록
        </Center>
      )}

      <Center>
        <ButtonGroup gap="1">
          {account.isLoggedIn() || (
            <Button
              onClick={() => navigate("/signup")}
              cursor={"pointer"}
              _hover={{ bgColor: "blue.300" }}
              colorScheme="gray"
              p={6}
              fontSize={20}
              fontWeight={600}
            >
              회원가입
            </Button>
          )}
          {account.isLoggedIn() || (
            <Button
              onClick={() => navigate("/login")}
              cursor={"pointer"}
              _hover={{ bgColor: "blue.300" }}
              colorScheme="gray"
              p={6}
              fontSize={20}
              fontWeight={600}
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
              _hover={{ bgColor: "blue.300" }}
              colorScheme="gray"
              p={4}
              fontSize={20}
              fontWeight={600}
            >
              로그아웃
            </Button>
          )}
        </ButtonGroup>
      </Center>
    </Flex>
  );
}
