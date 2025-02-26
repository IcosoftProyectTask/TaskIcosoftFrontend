import { DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { MRT_EditActionButtons } from "material-react-table";

export default function DialogBase({ table, row, internalEditComponents, title }) {
  return (
    <>
      <DialogTitle variant="h5">{title}</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        {internalEditComponents}
      </DialogContent>
      <DialogActions>
        <MRT_EditActionButtons variant="text" table={table} row={row} />
      </DialogActions>
    </>
  );
}
