import {
    Box,
    Button,
  } from "@mui/material";
  import AddIcon from "@mui/icons-material/Add";

export default function TopToolAction({table,titleCreate}) {
  return (
    <Box>
      <Button
        onClick={() => {
          table.setCreatingRow(true);
        }}
        startIcon={<AddIcon />}
      >
        {titleCreate}
      </Button>
    </Box>
  );
}
