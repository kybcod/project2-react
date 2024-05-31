import {
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Heading,
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
  faComments,
  faHeart,
  faImages,
  faMagnifyingGlass,
  faUserPen,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

export function BoardList() {
  const navigate = useNavigate();
  const [boardList, setBoardList] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [searchParams] = useSearchParams();
  const [searchType, setSearchType] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    axios.get(`/api/board/list?${searchParams}`).then((res) => {
      console.log(res.data.boardList);
      setBoardList(res.data.boardList);
      setPageInfo(res.data.pageInfo);
    });

    setSearchType("all");
    setSearchKeyword("");

    const typeParam = searchParams.get("type");
    const keywordParam = searchParams.get("keyword");
    if (typeParam) {
      setSearchType(typeParam);
    }

    if (keywordParam) {
      setSearchKeyword(keywordParam);
    }
  }, [searchParams]); //의존성(dependency)가 있다면 변경될때마다 함수를 trigger를 합니다.

  // 총 페이지 번호
  const pageNumbers = [];
  for (let i = pageInfo.leftPageNumber; i <= pageInfo.rightPageNumber; i++) {
    pageNumbers.push(i);
  }

  function handleSearchClick() {
    navigate(`/?type=${searchType}&keyword=${searchKeyword}`);
  }

  function handlePageButtonClick(pageNumber) {
    searchParams.set("page", pageNumber);
    navigate(`/?${searchParams}`);
  }

  console.log(boardList);

  return (
    <Box mb={10}>
      <Box mb={10}>
        <Heading>게시물 목록</Heading>
      </Box>
      <Box mb={10}>
        {boardList.length === 0 && <Center>조회된 결과가 없습니다.</Center>}
        {boardList.length > 0 && (
          <Table>
            <Thead>
              <Tr>
                <Th w={20}>NO</Th>
                <Th>제목</Th>
                <Th w={20}>
                  <FontAwesomeIcon icon={faHeart} />
                </Th>
                <Th w={20}>조회수</Th>
                <Th w={40}>
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
                  <Td>
                    {board.title}
                    {board.numberOfImages > 0 && (
                      <Badge>
                        <FontAwesomeIcon icon={faImages} />(
                        {board.numberOfImages})
                      </Badge>
                    )}
                    {board.numberOfComment > 0 && (
                      <Badge>
                        <FontAwesomeIcon icon={faComments} />(
                        {board.numberOfComment})
                      </Badge>
                    )}
                  </Td>
                  <Td>{board.numberOfLike}</Td>
                  <Td>{board.view}</Td>
                  <Td>{board.writer}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>

      {/*검색*/}
      <Center mb={10}>
        <Box mt={"30px"}>
          <Flex gap={1}>
            <Box>
              <Select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
              >
                <option value={"all"}>전체</option>
                <option value={"text"}>글(제목+내용)</option>
                <option value={"nickName"}> 작성자</option>
              </Select>
            </Box>
            <Box>
              <Input
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder={"검색어를 입력하세요."}
              />
            </Box>
            <Box gap={1}>
              <Button onClick={handleSearchClick}>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </Button>
            </Box>
          </Flex>
        </Box>
      </Center>

      {/*페이지네이션*/}
      <Center>
        <Flex gap={1}>
          <Box mt={"30px"}>
            {/*만약 이전 버튼이 보이면 처음 버튼도 보인다. */}
            {pageInfo.prevPageNumber && (
              <>
                <Button onClick={() => handlePageButtonClick(1)}>
                  <FontAwesomeIcon icon={faAnglesLeft} />
                </Button>
                <Button
                  onClick={() => handlePageButtonClick(pageInfo.prevPageNumber)}
                >
                  <FontAwesomeIcon icon={faAngleLeft} />
                </Button>
              </>
            )}

            {/*페이지 번호*/}
            {pageNumbers.map((pageNumber) => (
              <Button
                mr={"10px"}
                onClick={() => handlePageButtonClick(pageNumber)}
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
                  onClick={() => handlePageButtonClick(pageInfo.nextPageNumber)}
                >
                  <FontAwesomeIcon icon={faAngleRight} />
                </Button>
                <Button
                  onClick={() => handlePageButtonClick(pageInfo.lastPageNumber)}
                >
                  <FontAwesomeIcon icon={faAnglesRight} />
                </Button>
              </>
            )}
          </Box>
        </Flex>
      </Center>
    </Box>
  );
}
