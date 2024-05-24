import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons/faTriangleExclamation";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export function MemberEdit() {
  const [member, setMember] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [oldNickName, setOldNickName] = useState("");
  const { id } = useParams();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();
  const [isCheckedNickNameButton, setIsCheckedNickNameButton] = useState(false);

  useEffect(() => {
    console.log(id);
    axios
      .get(`/api/member/${id}`)
      .then((res) => {
        const member1 = res.data;
        setMember({ ...member1, password: "" });
      })
      .catch((err) => {
        toast({
          status: "error",
          description: "해당 회원이 없습니다.",
          position: "top-right",
          duration: 1000,
        });
        navigate("/");
      });
  }, []);

  if (member == null) {
    return <Spinner />;
  }

  function handleCheckNickName() {
    axios
      .get(`/api/member/check?nickName=${member.nickName}`)
      .then((res) => {
        toast({
          status: "warning",
          description: "중복된 닉네임입니다.",
          position: "top",
          duration: 1000,
        });
      })
      .catch((err) => {
        if (err.response.status === 404) {
          toast({
            status: "info",
            description: "사용할 수 있는 닉네임입니다.",
            position: "top",
            duration: 1000,
          });
          setIsCheckedNickNameButton(true);
        }
      })
      .finally();
  }

  function handleUpdate() {}

  let isDisableNickNameCheckButton = false;
  if (member.nickName === oldNickName) {
    isDisableNickNameCheckButton = true;
  }
  if (member.nickName.trim().length === 0) {
    isDisableNickNameCheckButton = true;
  }

  return (
    <Box>
      <Box>{member.id}번 회원</Box>
      <Box>
        <FormControl>
          <FormLabel>이메일</FormLabel>
          <Input defaultValue={member.email} readOnly />
        </FormControl>
      </Box>

      <Box>
        <FormControl>
          <FormLabel>비밀번호</FormLabel>
          <Input defaultValue={member.password} readOnly />
        </FormControl>
      </Box>
      <Box>
        <FormControl>
          <FormLabel>비밀번호 확인</FormLabel>
          <Input />
        </FormControl>
      </Box>

      <Box>
        <FormControl>
          <FormLabel>닉네임</FormLabel>
          <InputGroup>
            <Input
              value={member.nickName}
              onChange={(e) => {
                const newNickName = e.target.value.trim();
                setMember({ ...member, nickName: newNickName });
                setIsCheckedNickNameButton(true);
              }}
            />
            <InputRightElement w={"100px"}>
              <Button
                isDisabled={isDisableNickNameCheckButton}
                onClick={handleCheckNickName}
                colorScheme={"green"}
              >
                중복확인
              </Button>
            </InputRightElement>
          </InputGroup>
          {isCheckedNickNameButton || (
            <FormHelperText>닉네임 중복 확인 해주세요.</FormHelperText>
          )}
        </FormControl>
      </Box>

      <Box>
        <FormControl>
          <FormLabel>가입일시</FormLabel>
          <Input disabled={true} value={member.inserted} />
        </FormControl>
      </Box>

      <Box>
        <Button onClick={onOpen} colorScheme={"red"}>
          수정
        </Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <FontAwesomeIcon icon={faTriangleExclamation} />
              경고
            </ModalHeader>
            <ModalBody>
              <FormControl>
                <FormLabel>암호</FormLabel>
                <Input onChange={(e) => setOldPassword(e.target.value)} />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button onClick={handleUpdate} colorScheme={"red"}>
                확인
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
