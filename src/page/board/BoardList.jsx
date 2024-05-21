import { Box, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPen } from "@fortawesome/free-solid-svg-icons";

export function BoardList() {
  const [boardList, setBoardList] = useState([]);

  // [{id:5 title:"제목1", writer:"누구1"}]

  return (
    <Box>
      <Box>게시물 목록</Box>
      <Box>
        <Table>
          <Thead>
            <Tr>
              <Th>NO</Th>
              <Th>제목</Th>
              <Th>
                <FontAwesomeIcon icon={faUserPen} />
                작성자
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {boardList.map((board) => (
              <Tr key={board.id}>
                <Td>{board.id}</Td>
                <Td>{board.title}</Td>
                <Td>{board.writer}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
