import React, { useState } from "react";
import axios from "axios";
import { url, token } from "../../../api";
import { ToastContainer, toast } from "react-toastify";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
} from "reactstrap";
import { Card, CardContent } from "@material-ui/core";
import MatButton from "@material-ui/core/Button";
import { TiArrowBack } from "react-icons/ti";

const Import = (props) => {
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);
  function handleChange(event) {
    setFile(event.target.files[0]);
  }
  
  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);

    const config = {
      headers: {
        "content-type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.post(
        `${url}linkages/import`,
        formData,
        config
      );
      if (response.data === "file not imported successfully") {
        toast.error("File not imported successfully!");
      } else {
        toast.success("File imported successfully!");
      }

      props.toggle();
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while importing the file!");
    }
  }

  return (
    <>
      <Modal
        isOpen={props.modal}
        toggle={props.toggle}
        style={{ display: "flex", maxWidth: "85%", maxHeight: "80%" }}
        fullscreen="true"
      >
        <ModalHeader toggle={props.toggle}></ModalHeader>
        <ModalBody>
          <Card>
            <CardContent>
              <h4>Choose a File to Import</h4>
              <hr />
              <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleChange} />
                <MatButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  className=" float-center mr-1"
                  disabled={loading}
                >
                  {" "}
                  Upload {loading ? <Spinner /> : ""}{" "}
                </MatButton>
              </form>
            </CardContent>
          </Card>
        </ModalBody>
        <ModalFooter>
          {/* <Button color="primary" onClick={props.toggle}>
            Do Something
          </Button>{" "}
          <Button color="secondary" onClick={props.toggle}>
            Cancel
          </Button> */}
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Import;
