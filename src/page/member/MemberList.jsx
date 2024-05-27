import {
  Box,
  Button,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

export function MemberList() {
  const [memberList, setMemberList] = useState([]);
  const navigate = useNavigate();
  const [memberPageInfo, setMemberPageInfo] = useState({});
  const [page] = useSearchParams();

  useEffect(() => {
    axios.get(`/api/member/list?${page}`).then((res) => {
      setMemberList(res.data.memberList);
      setMemberPageInfo(res.data.memberPageInfo);
    });
  }, [page]);

  if (memberList.length === 0) {
    return <Spinner />;
  }

  return (
    <Box mt={"30px"}>
      <Box>
        <Table>
          <Thead>
            <Tr>
              <Th>No</Th>
              <Th>이메일</Th>
              <Th>닉네임</Th>
              <Th>가입일시</Th>
            </Tr>
          </Thead>
          <Tbody>
            {memberList.map((member) => (
              <Tr
                key={member.id}
                cursor={"pointer"}
                _hover={{ bgColor: "gray.200" }}
                onClick={() => navigate(`/member/${member.id}`)}
              >
                <Td>{member.id}</Td>
                <Td>{member.email}</Td>
                <Td>{member.nickName}</Td>
                <Td>{member.signupDateAndTime}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <Box>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((pageNumber) => {
          <Button>{pageNumber}</Button>;
        })}
      </Box>
    </Box>
  );
}
