import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Input,
  Select,
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
  const [type, setType] = useState("all");
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    axios.get(`/api/member/list?${page}`).then((res) => {
      setMemberList(res.data.memberList);
      setMemberPageInfo(res.data.memberPageInfo);
    });

    setType("all");
    setKeyword("");

    const typeParam = page.get("type");
    const keywordParam = page.get("keyword");

    if (typeParam) {
      setType(typeParam);
    }

    if (keywordParam) {
      setKeyword(keywordParam);
    }
  }, [page]);

  const pageNumbers = [];
  for (let i = memberPageInfo.beginPage; i <= memberPageInfo.endPage; i++) {
    pageNumbers.push(i);
  }

  if (memberList.length === 0) {
    return <Spinner />;
  }

  function handlePageClick(pageNumber) {
    page.set("page", pageNumber);
    navigate(`?${page}`);
  }

  return (
    <Box mt={"30px"}>
      <Box>
        <Box mb={10}>
          <Heading>회원 목록</Heading>
        </Box>
        <Box mb={10}>
          {memberList.length === 0 && (
            <Center>해당 회원이 존재하지 않습니다.</Center>
          )}
          {memberList.length > 0 && (
            <Table>
              <Thead>
                <Tr>
                  <Th w={20}>No</Th>
                  <Th>이메일</Th>
                  <Th w={"150"}>닉네임</Th>
                  <Th w={96}>가입일시</Th>
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
          )}
        </Box>

        {/*검색*/}
        <Center mt={"30px"}>
          <Box>
            <Flex>
              <Box>
                <Select value={type} onChange={(e) => setType(e.target.value)}>
                  <option value={"all"}>전체</option>
                  <option value={"email"}>이메일</option>
                  <option value={"nickName"}>닉네임</option>
                </Select>
              </Box>
              <Box>
                <Input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </Box>
              <Box>
                <Button
                  onClick={() => navigate(`?type=${type}&keyword=${keyword}`)}
                >
                  검색
                </Button>
              </Box>
            </Flex>
          </Box>
        </Center>

        {/*/!*페이지네이션*!/*/}
        <Center>
          <Box mt={"30px"}>
            {memberPageInfo.prevPage && (
              <>
                <Button
                  onClick={() => {
                    handlePageClick(1);
                  }}
                >
                  처음
                </Button>
                <Button
                  onClick={() => {
                    handlePageClick(memberPageInfo.prevPage);
                  }}
                >
                  이전
                </Button>
              </>
            )}

            {pageNumbers.map((pageNumber) => (
              <Button
                mr={"10px"}
                onClick={() => {
                  handlePageClick(pageNumber);
                }}
                key={pageNumber}
                colorScheme={
                  pageNumber == memberPageInfo.currentPage ? "teal" : "gray"
                }
              >
                {pageNumber}
              </Button>
            ))}

            {memberPageInfo.nextPage && (
              <>
                <Button
                  onClick={() => {
                    handlePageClick(memberPageInfo.nextPage);
                  }}
                >
                  다음
                </Button>
                <Button
                  onClick={() => {
                    handlePageClick(memberPageInfo.lastPage);
                  }}
                >
                  맨끝
                </Button>
              </>
            )}
          </Box>
        </Center>
      </Box>
    </Box>
  );
}
