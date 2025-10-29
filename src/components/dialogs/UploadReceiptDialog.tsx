import ClearIcon from "@mui/icons-material/Clear";
import { Box, Snackbar, SnackbarOrigin, Tab, Tabs } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import UploadReceipt from "../receipt/upload-receipt";

interface DialogProps {
  open: boolean;
  onClose: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function UploadReceiptDialog(props: DialogProps) {
  const { onClose, open: openDialog } = props;
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [extractedText, setExtractedText] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [openSB, setOpenSB] = useState<boolean>(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleCloseDialog = () => {
    onClose();
  };

  const handleCloseSB = () => {
    setOpenSB(false);
  };

  return (
    <Dialog onClose={handleCloseDialog} open={openDialog}>
      <Snackbar
        open={openSB}
        autoHideDuration={3000}
        onClose={handleCloseSB}
        message="Text extracted successfully"
        anchorOrigin={
          { vertical: "bottom", horizontal: "center" } as SnackbarOrigin
        }
      />
      <DialogTitle
        className="bg-gray-900 text-gray-200"
        style={{ fontFamily: "monospace" }}
      >
        Upload Receipt
      </DialogTitle>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            aria-label="basic tabs example"
          >
            <Tab label="Receipt" {...a11yProps(0)} />
            <Tab
              label="Text"
              {...a11yProps(1)}
              disabled={extractedText === ""}
            />
          </Tabs>
        </Box>
        <CustomTabPanel value={selectedTab} index={0}>
          <UploadReceipt
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            setExtractedText={setExtractedText}
            setOpenSB={setOpenSB}
          />
        </CustomTabPanel>
        <CustomTabPanel value={selectedTab} index={1}>
          <div className="flex flex-col items-center justify-center w-full h-full p-4 gap-4 overflow-hidden">
            <h2 className="text-lg font-medium">Extracted Text Preview</h2>
            <div className="w-full h-64 p-4 border border-gray-300 rounded overflow-auto bg-white text-left">
              <pre className="whitespace-pre-wrap break-words">
                {extractedText}
              </pre>
            </div>
          </div>
        </CustomTabPanel>
      </Box>
      <button
        onClick={handleCloseDialog}
        className="absolute right-0 top-0 w-[24px] h-[24px] bg-red-500 text-white rounded hover:bg-red-300 cursor-pointer"
      >
        <ClearIcon />
      </button>
    </Dialog>
  );
}
