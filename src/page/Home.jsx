import { Box } from "@chakra-ui/react";
import { Link, Outlet } from "react-router-dom";
import React from "react";

export function Home() {
  return (
    <Box>
      <Box>
        <Link to={"/"}>Home</Link>
        <Link to={"write"}>글 작성</Link>
      </Box>
      <Box>
        <Outlet />
      </Box>
    </Box>
  );
}
