import { ModalDialog, DialogContent } from '@mui/joy';
import { DialogTitle, Modal, Button, FormControl, FormLabel, Input, Stack } from '@mui/joy';
import React, { useState } from 'react';

const CreateTopicmodal = ({ open, onClose }) => {
  const [data, setData] = useState({
    topicname: "",
    duration: ""
  });
  const formhandler = (e)=>{
     const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  }

   const submitHandler = async (event) => {
    event.preventDefault();

    try {
      const res = await fetch("____", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to create topic");
      }

      onClose(); 
      setData({ topicname: "", duration: "" }); 

    } catch (error) {
      console.error("Error posting data:", error);
    }
  };


  return (
    <Modal open={open} onClose={onClose}>

      <ModalDialog>
        <DialogTitle>Create Topic</DialogTitle>
        <DialogContent>Add a topic to this unit with an estimated completion time.</DialogContent>

        <form
        onSubmit={submitHandler}
        >
          <Stack spacing={2}>
            <FormControl>
              <FormLabel >Topic Name</FormLabel>
              <Input autoFocus required name="topicname"  placeholder='e.g., What is a Computer?' value={data.topicname} onChange={formhandler} />
            </FormControl>
              <FormControl>
                <FormLabel >Duration(mins)</FormLabel>
                <Input required placeholder='45' name="duration" value={data.duration} onChange={formhandler} />
              </FormControl>
            <Button type="submit">Submit</Button>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  );
};

export default CreateTopicmodal;
