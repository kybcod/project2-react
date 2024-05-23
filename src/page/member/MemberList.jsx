import { Box, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function MemberList() {
  const [memberList, setMemberList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/member/list").then((res) => {
      setMemberList(res.data);
    });
  }, []);

  return (
    <Box mt={"30px"}>
      <Box>
        <Table>
          <Thead>
            <Tr>
              <Th>NO</Th>
              <Th>이메일</Th>
              <Th>닉네임</Th>
              <Th>가입일자</Th>
            </Tr>
          </Thead>
          <Tbody>
            {memberList.map((member) => (
              <Tr
                key={member.id}
                onClick={() => navigate(`/member/${member.id}`)}
              >
                <Td>{member.id}</Td>
                <Td>{member.email}</Td>
                <Td>{member.nickName}</Td>
                <Td>{member.inserted}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
