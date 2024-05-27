import { Box, Button, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
  faUserPen,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

export function BoardList() {
  const navigate = useNavigate();
  const [boardList, setBoardList] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  // const boardList = [
  //   { id: 5, title: "title1", writer: "who1" },
  //   { id: 6, title: "title1", writer: "who1" },
  //   { id: 7, title: "title1", writer: "who1" },
  //   { id: 8, title: "title1", writer: "who1" },
  // ];
  const [searchParams] = useSearchParams(); //key,value로 저장

  useEffect(() => {
    axios.get(`/api/board/list?${searchParams}`).then((res) => {
      setBoardList(res.data.boardList);
      setPageInfo(res.data.pageInfo);
    });
  }, [searchParams]); //의존성(dependency)가 있다면 변경될때마다 함수를 trigger를 합니다.

  // 총 페이지 번호
  const pageNumbers = [];
  for (let i = pageInfo.leftPageNumber; i <= pageInfo.rightPageNumber; i++) {
    pageNumbers.push(i);
  }

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
        {/*만약에 현재 페이지 번호가 1이라면 처음 버튼 안보이게 합니다*/}
        {pageInfo.currentPageNumber === 1 || (
          <Button onClick={() => navigate(`/?page=1`)}>
            <FontAwesomeIcon icon={faAnglesLeft} />
          </Button>
        )}

        {/*만약에 현재 페이지 번호가 11보다 작으면 처음 버튼 안보이게 합니다*/}
        {pageInfo.currentPageNumber < 11 || (
          <Button onClick={() => navigate(`/?page=${pageInfo.prevPageNumber}`)}>
            <FontAwesomeIcon icon={faAngleLeft} />
          </Button>
        )}

        {/*페이지 번호*/}
        {pageNumbers.map((pageNumber) => (
          <Button
            onClick={() => {
              navigate(`/?page=${pageNumber}`);
            }}
            key={pageNumber}
            colorScheme={
              pageNumber == pageInfo.currentPageNumber ? "teal" : "gray"
            }
          >
            {pageNumber}
          </Button>
        ))}

        {/*만약 다음 페이지 번호가 마지막 페이지 번호 보다 작으면 안보이게 합니다. */}
        {pageInfo.nextPageNumber > pageInfo.lastPageNumber || (
          <Button onClick={() => navigate(`/?page=${pageInfo.nextPageNumber}`)}>
            <FontAwesomeIcon icon={faAngleRight} />
          </Button>
        )}

        {/*현재 페이지 번호가 마지막 페이지 번호이면 맨끝 버튼 안보이게 합니다.*/}
        {pageInfo.currentPageNumber === pageInfo.lastPageNumber || (
          <Button onClick={() => navigate(`/?page=${pageInfo.lastPageNumber}`)}>
            <FontAwesomeIcon icon={faAnglesRight} />
          </Button>
        )}
      </Box>
    </Box>
  );
}
