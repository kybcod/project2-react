import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export function MemberEdit() {
  const [member, setMember] = useState(null);
  const { id } = useParams();
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    axios
      .get(`/api/member/${id}`)
      .then((response) => {
        const member1 = response.data;
        setMember({ ...member1, password: "" });
      })
      .catch((err) => {
        toast({
          status: "error",
          description: "해당 회원이 없습니다.",
          position: "top-right",
          duration: 1000,
        });
        navigate("/");
      });
  }, []);

  function handleClickSave() {
    axios
      .put(`/api/member/modify`, member)
      .then((response) => {})
      .catch((err) => {})
      .finally(() => {});
  }

  if (member == null) {
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
          <FormLabel>비밀번호</FormLabel>
          <Input
            defaultValue={member.password}
            placeholder={"암호를 변경하려면 입력하세요."}
            onChange={(e) => setMember({ ...member, password: e.target.value })}
          />
          <FormHelperText color={"red"}>
            입력하지 않으면 기존 암호를 변경하지 않습니다.
          </FormHelperText>
        </FormControl>
      </Box>
      <Box>
        <FormControl>
          <FormLabel>닉네임</FormLabel>
          <Input
            onChange={(e) => setMember({ ...member, nickName: e.target.value })}
            value={member.nickName}
          />
        </FormControl>
      </Box>
      <Box>
        <FormControl>
          <FormLabel>가입일시</FormLabel>
          <Input disabled={true} value={member.inserted} readOnly />
        </FormControl>
      </Box>
      <Box>
        <Button onClick={handleClickSave} colorScheme={"blue"}>
          저장
        </Button>
      </Box>
    </Box>
  );
}
