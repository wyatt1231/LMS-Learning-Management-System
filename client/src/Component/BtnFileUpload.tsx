import { IconButton } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import React, { FC } from "react";

interface IBtnFileUpload {
  onChange: (values: any) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& > *": {
        margin: theme.spacing(1),
      },
    },
    input: {
      display: "none",
    },
  })
);

const BtnFileUpload: FC<IBtnFileUpload> = ({ onChange }) => {
  const classes = useStyles();

  return (
    // accept="image/*"
    <div className={classes.root}>
      <input
        accept=".docx,.pdf,.doc,.rtf,.pptx,.ppt,image/*"
        className={classes.input}
        id="contained-button-file"
        multiple
        type="file"
        onChange={onChange}
      />
      <label htmlFor="contained-button-file">
        {/* <Button variant="contained" color="primary" component="span">
          Upload
        </Button> */}

        <IconButton color="primary" size="small" component="span">
          <AttachFileIcon />
        </IconButton>
      </label>
      <input
        accept="image/*"
        className={classes.input}
        id="icon-button-file"
        type="file"
        onChange={onChange}
      />
    </div>
  );
};

export default BtnFileUpload;
