import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function MemberSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickName, setNickName] = useState("");
  const toast = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  function handleMemberSaveClick() {
    setIsLoading(true);
    axios
      .post("/api/member/signup", {
        email,
        password,
        nickName,
      })
      .then((res) => {
        toast({
          status: "success",
          description: "회원 가입이 완료되었습니다.",
          position: "top-right",
          duration: 2000,
        });
        navigate("/"); //로그인 화면으로 이동 나중에 추가
      })
      .catch((err) => {
        const code = err.response.status;
        if (code === 400) {
          toast({
            status: "error",
            description: "입력값을 확인해 주세요.",
            position: "top-right",
          });
        } else {
          toast({
            status: "error",
            description: "회원 가입 중 문제가 발생하였습니다.",
            position: "top-right",
          });
        }
      })
      .finally(() => setIsLoading(false));
  }

  let isDisabled = false;
  if (email.trim().length === 0) {
    isDisabled = true;
  }
  if (password.trim().length === 0) {
    isDisabled = true;
  }
  if (nickName.trim().length === 0) {
    isDisabled = true;
  }

  return (
    <Box>
      <Box>회원 가입</Box>
      <Box>
        <Box>
          <FormControl>
            <FormLabel>이메일</FormLabel>
            <Input onChange={(e) => setEmail(e.target.value)} />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>패스워드</FormLabel>
            <Input onChange={(e) => setPassword(e.target.value)} />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>별명</FormLabel>
            <Input onChange={(e) => setNickName(e.target.value)} />
          </FormControl>
        </Box>
        <Box>
          <Button
            isDisabled={isDisabled}
            isLoading={isLoading}
            onClick={handleMemberSaveClick}
            colorScheme={"blue"}
          >
            가입
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
