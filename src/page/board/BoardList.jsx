import {
  Box,
  Button,
  Center,
  Flex,
  Input,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
  faMagnifyingGlass,
  faUserPen,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

export function BoardList() {
  const navigate = useNavigate();
  const [boardList, setBoardList] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [searchParams] = useSearchParams(); //key,value로 저장
  const [searchType, setSearchType] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");

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

  function handleSearchClick() {
    navigate(`/?type=${searchType}&keyword=${searchKeyword}`);
  }

  return (
    <Box mt={"30px"}>
      <Box>게시물 목록</Box>
      <Box>
        {boardList.length === 0 && <Center>조회된 결과가 없습니다.</Center>}
        {boardList.length > 0 && (
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
        )}
      </Box>

      {/*검색*/}
      <Center>
        <Box mt={"30px"}>
          <Flex>
            <Box>
              <Select onChange={(e) => setSearchType(e.target.value)}>
                <option value={"all"}>전체</option>
                <option value={"text"}>글(제목+내용)</option>
                <option value={"nickName"}> 작성자</option>
              </Select>
            </Box>
            <Box>
              <Input
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder={"검색어를 입력하세요."}
              />
            </Box>
            <Box>
              <Button onClick={handleSearchClick}>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </Button>
            </Box>
          </Flex>
        </Box>
      </Center>

      {/*페이지네이션*/}
      <Center>
        <Box mt={"30px"}>
          {/*만약 이전 버튼이 보이면 처음 버튼도 보인다. */}
          {pageInfo.prevPageNumber && (
            <>
              <Button onClick={() => navigate(`/?page=1`)}>
                <FontAwesomeIcon icon={faAnglesLeft} />
              </Button>
              <Button
                onClick={() => navigate(`/?page=${pageInfo.prevPageNumber}`)}
              >
                <FontAwesomeIcon icon={faAngleLeft} />
              </Button>
            </>
          )}

          {/*페이지 번호*/}
          {pageNumbers.map((pageNumber) => (
            <Button
              mr={"10px"}
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

          {/*만약 다음 버튼이 보이면 맨끝 버튼도 보인다. */}
          {pageInfo.nextPageNumber && (
            <>
              <Button
                onClick={() => navigate(`/?page=${pageInfo.nextPageNumber}`)}
              >
                <FontAwesomeIcon icon={faAngleRight} />
              </Button>
              <Button
                onClick={() => navigate(`/?page=${pageInfo.lastPageNumber}`)}
              >
                <FontAwesomeIcon icon={faAnglesRight} />
              </Button>
            </>
          )}
        </Box>
      </Center>
    </Box>
  );
}
