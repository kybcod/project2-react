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
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons/faTriangleExclamation";

export function MemberEdit() {
  const [member, setMember] = useState(null);
  const [passwordCheck, setPasswordCheck] = useState("");
  const [oldPassword, setOldPassword] = useState(""); //기존 패스워드
  const [oldNickName, setOldNickName] = useState(""); // 기존 닉네임
  const [isCheckedNickName, setIsCheckedNickName] = useState(true);
  const { id } = useParams();
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    axios
      .get(`/api/member/${id}`)
      .then((response) => {
        const member1 = response.data;
        setMember({ ...member1, password: "" });
        setOldNickName(member1.nickName);
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

  function handleClickSave() {
    axios
      .put(`/api/member/modify`, { ...member, oldPassword })
      .then(() => {
        toast({
          status: "success",
          description: `${member.id}번 회원이 수정되었습니다.`,
          position: "top-right",
        });
        navigate(`/member/${member.id}`);
      })
      .catch((err) => {
        if (err.response.status === 400) {
          toast({
            status: "error",
            description: `회원 정보가 수정되지 않았습니다. 작성한 내용을 확인해주세요.`,
            position: "top-right",
          });
        }
      })
      .finally(() => {
        onClose();
        setOldPassword("");
      });
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
          setIsCheckedNickName(true); // 중복확인하고 사용할 수 있으면 true, 입력을 시작하면 false
        }
      })
      .finally();
  }

  if (member == null) {
    return <Spinner />;
  }

  let isDisableNickNameCheckButton = false; // 활성화

  // 새로운 닉네임과 기존 닉네임이 같다면 중복 확인 버튼 비활성화
  if (member.nickName === oldNickName) {
    isDisableNickNameCheckButton = true;
  }

  // 새로운 닉네임을 작성하지 않으면 중복 확인 버튼 비활성화
  if (member.nickName.trim().length === 0) {
    isDisableNickNameCheckButton = true;
  }

  // 닉네임 중복확인 했으면 중복 확인 버튼 비활성화
  if (isCheckedNickName) {
    isDisableNickNameCheckButton = true;
  }

  let isDisableSaveButton = false; //활성화

  // 비밀번호가 같지 않으면 저장 버튼 비활성화
  if (member.password !== passwordCheck) {
    isDisableSaveButton = true;
  }

  // 작성한 닉네임이 없다면 저장 버튼 비활성화
  if (member.nickName.trim().length === 0) {
    isDisableSaveButton = true;
  }

  // 닉네임 중복을 확인하지 않았다면 비활성화
  if (!isCheckedNickName) {
    isDisableSaveButton = true;
  }

  return (
    <Box mt={"30px"}>
      <Box>{member.id}번 회원</Box>
      <Box mt={"30px"}>
        <FormControl>
          <FormLabel>이메일</FormLabel>
          <Input value={member.email} readOnly />
        </FormControl>
      </Box>
      <Box mt={"30px"}>
        <FormControl>
          <FormLabel>비밀번호</FormLabel>
          <Input
            defaultValue={member.password}
            placeholder={"암호를 변경하려면 입력하세요."}
            onChange={(e) => setMember({ ...member, password: e.target.value })}
          />
          <FormHelperText color={"red"}>
            입력하지 않으면 기존 암호를 변경하지 않습니다.
          </FormHelperText>
        </FormControl>
      </Box>
      <Box mt={"30px"}>
        <FormControl>
          <FormLabel>비밀번호 확인</FormLabel>
          <Input onChange={(e) => setPasswordCheck(e.target.value)} />
          {member.password === passwordCheck || (
            <FormHelperText color={"red"}>
              비밀번호가 일지하지 않습니다.
            </FormHelperText>
          )}
        </FormControl>
      </Box>
      <Box mt={"30px"}>
        <FormControl>
          <FormLabel>닉네임</FormLabel>
          <InputGroup>
            <Input
              onChange={(e) => {
                const newNickName = e.target.value.trim();
                setMember({ ...member, nickName: newNickName });
                setIsCheckedNickName(newNickName === oldNickName); // 기존 닉네임과 새로운 닉네임이 같지 않을때,입력을 시작할 때 활성화
              }}
              value={member.nickName}
            />
            <InputRightElement w={"100px"} mr={1}>
              <Button
                isDisabled={isDisableNickNameCheckButton}
                onClick={handleCheckNickName}
                colorScheme={"green"}
              >
                중복 확인
              </Button>
            </InputRightElement>
          </InputGroup>
          {isDisableNickNameCheckButton || (
            <FormHelperText color={"red"}>
              닉네임 중복 확인 해야 합니다.
            </FormHelperText>
          )}
        </FormControl>
      </Box>
      <Box mt={"30px"}>
        <Button
          isDisabled={isDisableSaveButton}
          colorScheme={"blue"}
          onClick={onOpen}
        >
          저장
        </Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <FontAwesomeIcon icon={faTriangleExclamation} />
              기존 패스워드 확인
            </ModalHeader>
            <ModalBody>
              <FormControl>
                <FormLabel>기존 패스워드</FormLabel>
                <Input onChange={(e) => setOldPassword(e.target.value)} />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button onClick={handleClickSave} colorScheme={"blue"}>
                확인
              </Button>
              <Button onClick={onClose}>취소</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
}
