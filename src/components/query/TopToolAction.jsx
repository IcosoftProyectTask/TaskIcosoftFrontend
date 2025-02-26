import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import {
    Box,
    Button,
    Menu,
    MenuItem,
  } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function TopToolAction({ role }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (type) => {
    if (type === "normal") {
      navigate("/add-query");
    } else if (type === "personalizada") {
        console.log("Navergando a la consulta personalizada");
    }
    handleClose();
  };

  return (
    <Box>
      {role === "Admin" && (
        <>
          <Button onClick={handleClick} startIcon={<AddIcon />}>
            Agregar Consulta
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => handleMenuItemClick("normal")}>
              Normal
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick("personalizada")}>
              Personalizada
            </MenuItem>
          </Menu>
        </>
      )}
    </Box>
  );
}
