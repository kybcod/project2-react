import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons/faTriangleExclamation";

export function MemberView() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    axios
      .get(`/api/member/${id}`)
      .then((response) => {
        setMember(response.data);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          toast({
            status: "error",
            description: "해당 회원이 존재하지 않습니다.",
            position: "top-right",
            duration: 1000,
          });
        }
      });
  }, []);

  if (member === null) {
    return <Spinner />;
  }

  function handleDeleteClick() {
    setIsLoading(true);
    axios
      .delete(`/api/member/${id}`)
      .then((res) => {
        toast({
          status: "success",
          description: `${member.id}님dl 탈퇴하였습니다. `,
          position: "top-right",
          duration: 1000,
        });
        navigate("/member/list");
      })
      .catch((err) => {
        toast({
          status: "error",
          description: `회원 탈퇴 중 문제가 발생하였습니다.`,
          position: "top-right",
          duration: 1000,
        });
      })
      .finally(() => setIsLoading(false));
  }

  return (
    <Box>
      <Box>{member.id}번 게시물</Box>
      <Box>
        <FormControl>
          <FormLabel>이메일</FormLabel>
          <Input value={member.email} readOnly />
        </FormControl>
      </Box>
      <Box>
        <FormControl>
          <FormLabel>닉네임</FormLabel>
          <Input value={member.nickName} readOnly />
        </FormControl>
      </Box>
      <Box>
        <FormControl>
          <FormLabel>가입일시</FormLabel>
          <Input value={member.inserted} readOnly />
        </FormControl>
      </Box>

      <Box>
        <Button colorScheme={"green"}>수정</Button>
        <Button onClick={onOpen} colorScheme={"red"}>
          삭제
        </Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <FontAwesomeIcon icon={faTriangleExclamation} />
              경고
            </ModalHeader>
            <ModalBody>정말로 탈퇴하시겠습니까?</ModalBody>
            <ModalFooter>
              <Button
                isLoading={isLoading}
                colorScheme={"red"}
                onClick={handleDeleteClick}
              >
                탈퇴
              </Button>
              <Button colorScheme={"blue"} onClick={onClose}>
                취소
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
}