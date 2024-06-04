import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  Hide,
  Show,
  Spacer,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { LoginContext } from "./LoginProvider.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import {
  faHouse,
  faPencil,
  faRightFromBracket,
  faRightToBracket,
  faUserPlus,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

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
        p={6}
        fontSize={20}
        fontWeight={600}
      >
        <Show below={"lg"}>
          <FontAwesomeIcon
            style={{ fontSize: "30px" }}
            onMouseOver={() => setAni1(true)}
            onMouseLeave={() => setAni1(false)}
            icon={faHouse}
            beatFade={ani1}
          />
        </Show>
        <Hide below={"lg"}>HOME</Hide>
      </Center>
      {account.isLoggedIn() && (
        <Center
          onClick={() => navigate("/write")}
          cursor={"pointer"}
          _hover={{ bgColor: "blue.300" }}
          p={6}
          fontSize={20}
          fontWeight={600}
        >
          <Show below={"lg"}>
            <FontAwesomeIcon icon={faPencil} />
          </Show>
          <Hide below={"lg"}>글쓰기</Hide>
        </Center>
      )}
      <Center
        onClick={() => navigate("/product")}
        cursor={"pointer"}
        _hover={{ bgColor: "blue.300" }}
        p={6}
        fontSize={20}
        fontWeight={600}
      >
        <Box>상품 목록</Box>
      </Center>

      <Spacer />
      {/*아이콘 */}
      {account.isLoggedIn() && (
        <Center
          onClick={() => navigate(`/member/${account.id}`)}
          cursor={"pointer"}
          _hover={{ bgColor: "blue.300" }}
          p={6}
          fontSize={20}
          fontWeight={600}
        >
          <Flex gap={2}>
            <Box>
              <FontAwesomeIcon icon={faUser} />
            </Box>
            <Box>
              <Hide below={"lg"}>{account.nickName}</Hide>
            </Box>
          </Flex>
        </Center>
      )}

      {account.isAdmin() && (
        <Center
          onClick={() => navigate("/member/list")}
          cursor={"pointer"}
          _hover={{ bgColor: "blue.300" }}
          p={6}
          fontSize={20}
          fontWeight={600}
        >
          <FontAwesomeIcon icon={faUsers} />
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
              <FontAwesomeIcon icon={faUserPlus} />
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
              <FontAwesomeIcon icon={faRightToBracket} />
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
              p={6}
              fontSize={20}
              fontWeight={600}
            >
              <FontAwesomeIcon icon={faRightFromBracket} />
            </Button>
          )}
        </ButtonGroup>
      </Center>
    </Flex>
  );
}
