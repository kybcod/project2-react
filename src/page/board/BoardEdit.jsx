import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Switch,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

export function BoardEdit() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [removeFileList, setRemoveFileList] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    axios.get(`/api/board/${id}`).then((res) => setBoard(res.data));
  }, []);

  function handleClickSave() {
    axios
      .putForm("/api/board/edit", {
        id: board.id,
        title: board.title,
        content: board.content,
        removeFileList,
      })
      .then(() => {
        toast({
          status: "success",
          description: `${board.id}번 게시물이 수정되었습니다.`,
          position: "bottom-right",
        });
        navigate(`/board/${board.id}`);
      })
      .catch((err) => {
        if (err.response.status === 400) {
          toast({
            status: "error",
            description: `게시물이 수정되지 않았습니다. 작성한 내용을 확인해주세요.`,
            position: "bottom-right",
          });
        }
      })
      .finally(() => {
        onClose();
      });
  }

  if (board === null) {
    return <Spinner />;
  }

  function handleRemoveSwitchChange(name, checked) {
    if (checked) {
      // 체크 되면 파일 삭제할 배열에 추가
      setRemoveFileList([...removeFileList, name]);
    } else {
      // 지울 목록에 있었다면 해당 이름 제외
      setRemoveFileList(removeFileList.filter((item) => item !== name));
    }
  }

  return (
    <Box mt={"30px"}>
      <Box>{board.id}번 게시물 수정</Box>
      <Box>
        <Box>
          <FormControl>
            <FormLabel>제목</FormLabel>
            <Input
              defaultValue={board.title}
              onChange={(e) => setBoard({ ...board, title: e.target.value })}
            />
          </FormControl>
        </Box>
        <Box mt={"30px"}>
          <FormControl>
            <FormLabel>본문</FormLabel>
            <Textarea
              defaultValue={board.content}
              onChange={(e) => setBoard({ ...board, content: e.target.value })}
            ></Textarea>
          </FormControl>
        </Box>
        <Box display={"flex"} flexWrap={"wrap"} mt={"30px"}>
          {board.fileList &&
            board.fileList.map((file) => (
              <Box
                boxSize={"210px"}
                border={"2px solid black"}
                m={3}
                key={file.name}
              >
                <Center>
                  <Box>
                    <Flex>
                      <FontAwesomeIcon icon={faTrashCan} />
                      <Switch
                        onChange={(e) =>
                          handleRemoveSwitchChange(file.name, e.target.checked)
                        }
                      />
                      <Text>{file.name}</Text>
                    </Flex>
                  </Box>
                </Center>
                <Center>
                  <Box>
                    <Image
                      sx={
                        removeFileList.includes(file.name)
                          ? { filter: "blur(5px)" }
                          : {}
                      }
                      borderRadius={"full"}
                      boxSize={"180px"}
                      src={file.src}
                    />
                  </Box>
                </Center>
              </Box>
            ))}
        </Box>
        <Box mt={"30px"}>
          <FormControl>
            <FormLabel>작성자</FormLabel>
            <Input defaultValue={board.writer} readOnly />
          </FormControl>
        </Box>
        <Box mt={"30px"}>
          <Button w={"100px"} colorScheme={"green"} onClick={onOpen}>
            저장
          </Button>
        </Box>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalBody>저장하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>취소</Button>
            <Button onClick={handleClickSave} colorScheme={"blue"}>
              확인
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
