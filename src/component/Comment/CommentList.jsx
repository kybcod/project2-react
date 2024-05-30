import { useEffect, useState } from "react";
import axios from "axios";
import { Box } from "@chakra-ui/react";
import { CommentItem } from "./CommentItem.jsx";

export function CommentList({ boardId, isSending }) {
  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    if (!isSending) {
      axios
        .get(`/api/comment/list/${boardId}`)
        .then((res) => {
          setCommentList(res.data);
        })
        .catch((err) => console.log(err))
        .finally();
    }
  }, [isSending]); //isSending이 변경될 때 isSending이 아닐 때만

  if (commentList.length === 0) {
    return <Box>댓글이 없습니다. 첫 댓글을 작성해보세요.</Box>;
  }
  return (
    <Box>
      {commentList.map((comment) => (
        <CommentItem comment={comment} key={comment.id} />
      ))}
    </Box>
  );
}
