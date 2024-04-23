"use client";

import * as React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";

const pages = ["Home", "About", "Versions"];

const NavBar = () => {
  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          flexGrow: 1,
          display: { xs: "none", md: "flex" },
        }}
      >
        {pages.map((page) => (
          <Button
            key={page}
            onClick={() =>
              window.location.replace(`/${page.toLocaleLowerCase()}`)
            }
            sx={{
              my: 2,
              color: "white",
              display: "block",
              marginInline: "1rem",
            }}
          >
            {page}
          </Button>
        ))}
      </Box>
    </Container>
  );
};
export default NavBar;
