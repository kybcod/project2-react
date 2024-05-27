import { Box, Button, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPen } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

export function BoardList() {
  const navigate = useNavigate();
  const [boardList, setBoardList] = useState([]);
  // const boardList = [
  //   { id: 5, title: "title1", writer: "who1" },
  //   { id: 6, title: "title1", writer: "who1" },
  //   { id: 7, title: "title1", writer: "who1" },
  //   { id: 8, title: "title1", writer: "who1" },
  // ];
  const [searchParams] = useSearchParams(); //key,value로 저장

  useEffect(() => {
    axios
      .get(`/api/board/list?${searchParams}`)
      .then((res) => setBoardList(res.data));
  }, [searchParams]); //의존성(dependency)가 있다면 변경될때마다 함수를 trigger를 합니다.

  return (
    <Box mt={"30px"}>
      <Box>게시물 목록</Box>
      <Box>
        <Table>
          <Thead>
            <Tr>
              <Th>NO</Th>
              <Th>제목</Th>
              <Th>
                <FontAwesomeIcon icon={faUserPen} />
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {boardList.map((board) => (
              <Tr
                cursor={"pointer"}
                _hover={{ bgColor: "gray.200" }}
                onClick={() => navigate(`/board/${board.id}`)}
                key={board.id}
              >
                <Td>{board.id}</Td>
                <Td>{board.title}</Td>
                <Td>{board.writer}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <Box>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((pageNumber) => (
          <Button
            onClick={() => navigate(`/?page=${pageNumber}`)}
            key={pageNumber}
          >
            {pageNumber}
          </Button>
        ))}
      </Box>
    </Box>
  );
}
