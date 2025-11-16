"use client";
import React from 'react';
import { Box, Stepper, Step, StepLabel, Tooltip } from '@mui/material';

const ProgressBar = ({ status }) => {
  const steps = [
    "planned",
    "script", 
    "record",
    "edit",
    "upload",
    "review",
    "publish",
  ];

  const activeStep = steps.indexOf(status?.toLowerCase());

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep >= 0 ? activeStep : 0}>
        {steps.map((label, index) => (
          <Step key={index}>
            <Tooltip title={label} arrow>
              <StepLabel icon={index} />
            </Tooltip>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default ProgressBar;
