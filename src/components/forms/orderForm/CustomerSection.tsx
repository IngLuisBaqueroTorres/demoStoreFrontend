import * as React from "react";
import { Box, Typography, TextField, IconButton, Tooltip } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

export interface CustomerSectionProps {
  customerId?: string;
  editable?: boolean;
}

const CustomerSection: React.FC<CustomerSectionProps> = ({
  customerId,
  editable = false,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    if (!customerId) return;
    await navigator.clipboard.writeText(customerId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Información del Cliente
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <TextField
          fullWidth
          label="Customer ID"
          value={customerId || ""}
          InputProps={{ readOnly: !editable }}
        />

        {!editable && customerId && (
          <Tooltip title={copied ? "Copiado!" : "Copiar ID"}>
            <IconButton onClick={handleCopy} color="primary">
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};

export default CustomerSection;
