import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Spacer } from "@chakra-ui/react";

export function CommentList({ boardId }) {
  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    axios
      .get(`/api/comment/list/${boardId}`)
      .then((res) => {})
      .catch((err) => console.log(err))
      .finally();
  }, []);

  if (commentList.length === 0) {
    return <Box>댓글이 없습니다. 첫 댓글을 작성해보세요.</Box>;
  }
  return (
    <Box>
      {commentList.map((comment) => (
        <Box key={comment.id} border={"1px solid black"} my={3}>
          <Box>{comment.memberId}</Box>
          <Spacer />
          <Box>{comment.inserted}</Box>
          <Box>{comment.comment}</Box>
        </Box>
      ))}
    </Box>
  );
}
