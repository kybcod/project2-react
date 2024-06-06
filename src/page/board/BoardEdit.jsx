import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  StackDivider,
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
  const [addFileList, setAddFileList] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    axios.get(`/api/board/${id}`).then((res) => setBoard(res.data.board));
  }, []);

  function handleClickSave() {
    axios
      .putForm("/api/board/edit", {
        id: board.id,
        title: board.title,
        content: board.content,
        removeFileList,
        addFileList,
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

  // file 목록 작성
  const fileNameList = [];
  for (let addFile of addFileList) {
    // 이미 있는 파일과 중복된 파일명인지 확인
    let duplicate = false;
    for (let file of board.fileList) {
      if (file.name === addFile.name) {
        duplicate = true;
        break;
      }
    }
    fileNameList.push(
      <Flex>
        <Text fontSize={"md"} mr={3}>
          {addFile.name}
        </Text>
        <Box>
          {duplicate && (
            <Badge ml={"10px"} colorScheme={"red"}>
              override
            </Badge>
          )}
        </Box>
      </Flex>,
    );
  }

  return (
    <Box>
      <Center>
        <Box w={500}>
          <Box mb={10}>
            <Heading>회원 정보 수정</Heading>
          </Box>
          <Box mb={10}>
            <Heading>{board.id}번 게시물 수정</Heading>
          </Box>
          <Box>
            <Box mb={7}>
              <FormControl>
                <FormLabel>제목</FormLabel>
                <Input
                  defaultValue={board.title}
                  onChange={(e) =>
                    setBoard({ ...board, title: e.target.value })
                  }
                />
              </FormControl>
            </Box>
            <Box mb={7}>
              <FormControl>
                <FormLabel>본문</FormLabel>
                <Textarea
                  defaultValue={board.content}
                  onChange={(e) =>
                    setBoard({ ...board, content: e.target.value })
                  }
                ></Textarea>
              </FormControl>
            </Box>
            <Box display={"flex"} flexWrap={"wrap"} mt={"30px"}>
              {board.fileList &&
                board.fileList.map((file) => (
                  <Card m={3} key={file.name}>
                    <CardFooter>
                      <Flex gap={3}>
                        <Box>
                          <FontAwesomeIcon color={"red"} icon={faTrashCan} />
                        </Box>
                        <Box>
                          <Switch
                            ml="10px"
                            onChange={(e) =>
                              handleRemoveSwitchChange(
                                file.name,
                                e.target.checked,
                              )
                            }
                          />
                        </Box>
                        <Box>
                          <Text ml="10px">{file.name}</Text>
                        </Box>
                      </Flex>
                    </CardFooter>
                    <CardBody>
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
                    </CardBody>
                  </Card>
                ))}
            </Box>

            <Box mb={7}>
              <FormControl>
                <FormLabel>파일</FormLabel>
                <Input
                  multiple={true}
                  type={"file"}
                  accept={"image/*"}
                  onChange={(e) => {
                    setAddFileList(e.target.files);
                  }}
                />
                <FormHelperText color={"red"}>
                  총 용량은 10MB 한 파일은 1MB를 초과할 수 없습니다.
                </FormHelperText>
              </FormControl>
            </Box>
            <Box>
              {fileNameList.length > 0 && (
                <Box mb={7}>
                  <Card>
                    <CardHeader>
                      <Heading size="md">선택된 파일 목록</Heading>
                    </CardHeader>
                    <CardBody>
                      <Stack divider={<StackDivider />} spacing={3}>
                        {fileNameList}
                      </Stack>
                    </CardBody>
                  </Card>
                </Box>
              )}
            </Box>
            <Box mb={7}>
              <FormControl>
                <FormLabel>작성자</FormLabel>
                <Input defaultValue={board.writer} readOnly />
              </FormControl>
            </Box>
            <Box mb={7}>
              <Button w={"100px"} colorScheme={"green"} onClick={onOpen}>
                저장
              </Button>
            </Box>
          </Box>
        </Box>
      </Center>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalBody>저장하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button mr={2} onClick={onClose}>
              취소
            </Button>
            <Button onClick={handleClickSave} colorScheme={"blue"}>
              확인
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
