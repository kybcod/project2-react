import {
  Box,
  Button,
  Center,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

export function MemberList() {
  const [memberList, setMemberList] = useState([]);
  const [memberPageInfo, setMemberPageInfo] = useState({});
  const navigate = useNavigate();
  const [page] = useSearchParams();

  useEffect(() => {
    axios.get(`/api/member/list?${page}`).then((res) => {
      setMemberList(res.data.memberList);
      setMemberPageInfo(res.data.memberPageInfo);
    });
  }, [page]);

  const pageNumbers = [];
  for (let i = 1; i <= memberPageInfo.lastPage; i++) {
    pageNumbers.push(i);
  }

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

      {/*/!*검색*!/*/}
      {/*<Box>*/}
      {/*  <Flex>*/}
      {/*    <Box>*/}
      {/*      <Select>*/}
      {/*        <option value={"all"}>전체</option>*/}
      {/*        <option value={"text"}>글(제목+내용)</option>*/}
      {/*        <option value={"nickName"}> 작성자</option>*/}
      {/*      </Select>*/}
      {/*    </Box>*/}
      {/*    <Box></Box>*/}
      {/*    <Box></Box>*/}
      {/*  </Flex>*/}
      {/*</Box>*/}

      {/*/!*페이지네이션*!/*/}
      <Center>
        <Box>
          {pageNumbers.map((pageNumber) => (
            <Button
              mr={"10px"}
              onClick={() => {
                navigate(`?page=${pageNumber}`);
              }}
              key={pageNumber}
              colorScheme={
                pageNumber == memberPageInfo.currentPage ? "teal" : "gray"
              }
            >
              {pageNumber}
            </Button>
          ))}
        </Box>
      </Center>
    </Box>
  );
}
