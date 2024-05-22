import { Box, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export function MemberView() {
  const { id } = useParams();
  const [member, setMember] = useState({});
  useEffect(() => {
    axios.get(`/api/member/${id}`).then((response) => {
      setMember(response.data);
    });
  }, []);

  return (
    <Box>
      <Box>
        <FormControl>
          <FormLabel>이메일</FormLabel>
          <Input value={member.email} />
        </FormControl>
      </Box>
      <Box>
        <FormControl>
          <FormLabel>비밀번호</FormLabel>
          <Input value={member.password} />
        </FormControl>
      </Box>
      <Box>
        <FormControl>
          <FormLabel>닉네임</FormLabel>
          <Input value={member.nickName} />
        </FormControl>
      </Box>
      <Box>
        <FormControl>
          <FormLabel>작성시간</FormLabel>
          <Input value={member.inserted} />
        </FormControl>
      </Box>
    </Box>
  );
}
