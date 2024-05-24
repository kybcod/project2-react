import { Box, Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";

export function MemberLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  axios.post("/api/member/login", { email, password })
    .then((res) => {
    toast({
      status: "success",
      description: "로그인 성공하였습니다.",
      position: "top-right",
      duration: 1000,
    });
    navigate("/");
  })
    .catch((err) => {
      toast({
        status: "error",
        description: "로그인 실패하였습니다.",
        position: "top-right",
        duration: 1000,
      });
    })
}
  return (
    <Box>
      <Box>
        <FormControl>
          <FormLabel>이메일</FormLabel>
          <Input onChange={(e) => setEmail(e.target.value.trim)} />
        </FormControl>
      </Box>
      <Box>
        <FormControl>
          <FormLabel>비밀번호</FormLabel>
          <Input onChange={(e) => setPassword(e.target.value)} />
        </FormControl>
      </Box>
      <Box>
        <Button colorScheme={"yellow"}>로그인</Button>
      </Box>
    </Box>
  );
}
