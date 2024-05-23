import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export function MemberInfo() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const toast = useToast();

  useEffect(() => {
    axios
      .get(`/api/member/${id}`)
      .then((response) => {
        setMember(response.data);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          toast({
            status: "error",
            description: "해당 회원이 존재하지 않습니다.",
            position: "top-right",
            duration: 1000,
          });
        }
      });
  }, []);

  if (member === null) {
    return <Spinner />;
  }

  return (
    <Box>
      <Box>{member.id}번 게시물</Box>
      <Box>
        <FormControl>
          <FormLabel>이메일</FormLabel>
          <Input value={member.email} readOnly />
        </FormControl>
      </Box>
      <Box>
        <FormControl>
          <FormLabel>닉네임</FormLabel>
          <Input value={member.nickName} readOnly />
        </FormControl>
      </Box>
      <Box>
        <FormControl>
          <FormLabel>가입일시</FormLabel>
          <Input value={member.inserted} readOnly />
        </FormControl>
      </Box>

      <Box>
        <Button colorScheme={"green"}>수정</Button>
        <Button colorScheme={"red"}>탈퇴</Button>
      </Box>
    </Box>
  );
}
