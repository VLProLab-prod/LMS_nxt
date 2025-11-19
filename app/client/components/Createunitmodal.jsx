import { ModalDialog, DialogContent } from '@mui/joy';
import { DialogTitle, Modal, Button, FormControl, FormLabel, Input, Stack } from '@mui/joy';
import React, { useState } from 'react';


const Createunitmodal = ({ open, onClose }) => {
  const [data,setdata] = useState({
      unitname:""
    })
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
        setdata({ unitname:"" }); 
  
      } catch (error) {
        console.error("Error posting data:", error);
      }
    };
  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog>
        <DialogTitle>Create Unit</DialogTitle>
        <DialogContent>Create a new unit to organize related topics within this course.</DialogContent>

        <form
          onSubmit={submitHandler}
        >
          <Stack spacing={2}>
            <FormControl>
              <FormLabel>Unit Name</FormLabel>
              <Input autoFocus required placeholder='e.g., Introduction to Computing' name="unitname" value={data.unitname} onChange={formhandler} />
            </FormControl>

            <Button type="submit">Submit</Button>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  );
};

export default Createunitmodal;
