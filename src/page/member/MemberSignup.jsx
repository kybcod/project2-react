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

  function handleCheckEmail() {
    axios
      .get(`/api/member/check?email=${email}`)
      .then((res) => {
        toast({
          status: "warning",
          description: "사용할 수 없는 이메일입니다.",
          position: "top",
          duration: 1000,
        });
      }) // 이미 있는 이메일 (사용 못함)
      .catch((err) => {
        if (err.response.status === 404) {
          // 사용할 수 있는 이메일
          toast({
            status: "info",
            description: "사용할 수 있는 이메일입니다.",
            position: "top",
            duration: 1000,
          });
        }
      })
      .finally();
  }

  function handleCheckNickName() {
    axios
      .get(`/api/member/check?nickName=${nickName}`)
      .then((res) => {
        toast({
          status: "warning",
          description: "중복된 닉네임입니다.",
          position: "top",
          duration: 1000,
        });
      })
      .catch((err) => {
        if (err.response.status === 404) {
          toast({
            status: "info",
            description: "사용할 수 있는 닉네임입니다.",
            position: "top",
            duration: 1000,
          });
        }
      });
  }

  return (
    <Box>
      <Box>회원 가입</Box>
      <Box>
        <Box>
          <FormControl>
            <FormLabel>이메일</FormLabel>
            <InputGroup>
              <Input onChange={(e) => setEmail(e.target.value)} />
              <InputRightElement w={"100px"} mr={1}>
                <Button
                  onClick={handleCheckEmail}
                  size={"sm"}
                  colorScheme={"green"}
                >
                  중복 확인
                </Button>
              </InputRightElement>
            </InputGroup>
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
            <FormLabel>닉네임</FormLabel>
            <InputGroup>
              <Input onChange={(e) => setNickName(e.target.value)} />
              <InputRightElement w={"100px"} mr={1}>
                <Button
                  onClick={handleCheckNickName}
                  size={"sm"}
                  colorScheme={"green"}
                >
                  중복 확인
                </Button>
              </InputRightElement>
            </InputGroup>
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
