import { Box, Button, Textarea, Tooltip, useToast } from "@chakra-ui/react";
import { useContext, useState } from "react";
import axios from "axios";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LoginContext } from "../LoginProvider.jsx";

export function CommentWrite({ boardId, isSending, setIsSending }) {
  const [comment, setComment] = useState("");
  const toast = useToast();
  const account = useContext(LoginContext);

  function handleCommentSubmitClick() {
    setIsSending(true); //전송 중
    axios
      .post("/api/comment/add", {
        boardId,
        comment,
      })
      .then((res) => {
        setComment("");
        toast({
          description: "댓글이 등록되었습니다.",
          position: "top",
          status: "success",
          duration: 1000,
        });
      })
      .catch(() => {})
      .finally(() => {
        setIsSending(false); //전송 끝남
      });
  }

  return (
    <Box>
      <Textarea
        isDisabled={!account.isLoggedIn()}
        placeholder={
          account.isLoggedIn()
            ? "댓글을 작성해 보세요."
            : "로그인 시 댓글 작성이 가능합니다."
        }
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <Tooltip
        hasArrow
        placement="top"
        label={"로그인 해주세요"}
        isDisabled={account.isLoggedIn()}
      >
        <Button
          isDisabled={comment.trim().length === 0 || !account.isLoggedIn()}
          isLoading={isSending}
          onClick={handleCommentSubmitClick}
          colorScheme={"blue"}
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </Button>
      </Tooltip>
    </Box>
  );
}
