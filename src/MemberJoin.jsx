import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function MemberJoin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [nickName, setNickName] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  function handleJoin() {
    axios
      .post("/api/member/join", {
        email,
        password,
        nickName,
      })
      .then((res) => {
        toast({
          status: "success",
          description: "회원가입 성공하였습니다.",
          position: "top-right",
          duration: 1000,
        });
      })
      .catch((err) => {
        if (err.response.status === 400) {
          toast({
            status: "error",
            description: "회원가입 실패했습니다",
            position: "top-right",
            duration: 1000,
          });
        }
      });
  }

  function handleNickNameCheckClick() {
    axios
      .get(`/api/member/check?nickName=${nickName}`)
      .then((res) => {
        toast({
          status: "warning",
          description: "이미 존재하는 닉네임 입니다.",
          position: "top-right",
          duration: 1000,
        });
      })
      .catch((err) => {
        toast({
          status: "info",
          description: "사용 가능한 닉네임입니다.",
          position: "top-right",
          duration: 1000,
        });
      })
      .finally();
  }

  function handleEmailCheckClick() {
    axios
      .get(`/api/member/check?email=${email}`)
      .then((res) => {
        toast({
          status: "warning",
          description: "이미 존재하는 이메일입니다.",
          position: "top-right",
          duration: 1000,
        });
      })
      .catch((err) => {
        toast({
          status: "info",
          description: "사용 가능한 이메일입니다.",
          position: "top-right",
          duration: 1000,
        });
      })
      .finally();
  }

  return (
    <Box>
      <Box>
        <FormControl>
          <FormLabel>이메일</FormLabel>
          <InputGroup>
            <Input onChange={(e) => setEmail(e.target.value)} />
            <InputRightElement w={"100px"}>
              <Button onClick={handleEmailCheckClick} colorScheme={"green"}>
                중복확인
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
      </Box>
      <Box>
        <FormControl>
          <FormLabel>비밀번호</FormLabel>
          <Input onChange={(e) => setPassword(e.target.value)} />
        </FormControl>
      </Box>
      <Box>
        <FormControl>
          <FormLabel>비밀번호 확인</FormLabel>
          <Input onChange={(e) => setPasswordCheck(e.target.value)} />
        </FormControl>
      </Box>
      <Box>
        <FormControl>
          <FormLabel>닉네임</FormLabel>
          <InputGroup>
            <Input onChange={(e) => setNickName(e.target.value)} />
            <InputRightElement w={"100px"}>
              <Button onClick={handleNickNameCheckClick} colorScheme={"green"}>
                중복확인
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
      </Box>
      <Box>
        <Button colorScheme={"blue"} onClick={handleJoin}>
          가입
        </Button>
      </Box>
    </Box>
  );
}