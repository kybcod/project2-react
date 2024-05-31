import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Heading,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../component/LoginProvider.jsx";

export function MemberLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate();
  const account = useContext(LoginContext);

  function handleLogin() {
    axios
      .post("/api/member/token", { email, password })
      .then((res) => {
        account.login(res.data.token);
        toast({
          status: "success",
          description: "로그인 성공하였습니다.",
          position: "bottom-right",
          duration: 1000,
        });
        navigate("/");
      })
      .catch((err) => {
        account.logout();
        toast({
          status: "error",
          description: "로그인 실패하였습니다.",
          position: "bottom-right",
          duration: 1000,
        });
      });
  }

  return (
    <Center>
      <Box mt={"30px"}>
        <Box w={500}>
          <Box mb={10}>
            <Heading>로그인</Heading>
          </Box>
          <Box mb={7}>
            <FormControl>
              <FormLabel>이메일</FormLabel>
              <Input onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
          </Box>
        </Box>
        <Box mb={7}>
          <FormControl>
            <FormLabel>비밀번호</FormLabel>
            <Input
              type={"password"}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
        </Box>
        <Box mb={7}>
          <Button onClick={handleLogin} colorScheme={"blue"}>
            로그인
          </Button>
        </Box>
      </Box>
    </Center>
  );
}
