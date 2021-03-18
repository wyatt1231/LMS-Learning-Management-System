import { Avatar, Badge, IconButton, Tooltip } from "@material-ui/core";
import ImageSearchIcon from "@material-ui/icons/ImageSearch";
import React, { memo, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
interface IPhotoField {
  selectedFile: File | null;
  handleChange: (e: File | null) => any;
  name?: string;
  label?: string;
  height?: number;
  width?: number;
  variant?: any;
}

const PhotoField: React.FC<IPhotoField> = memo(
  ({ selectedFile, handleChange, name, label, height, width, variant }) => {
    const [preview, setPreview] = useState<any>(null);

    const onSelectFile = useCallback(
      async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
          handleChange(undefined);
          return;
        }

        if (e.target.files[0]) {
          handleChange(e.target.files[0]);
        }
      },
      [handleChange]
    );

    useEffect(() => {
      if (!selectedFile) {
        setPreview(null);
        return;
      }

      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }, [selectedFile]);

    return (
      <div>
        <div
          style={{
            fontSize: ".78em",
            fontWeight: 400,
            color: "rgba(0,0,0,.7)",
            marginBottom: "1em",
          }}
        >
          {label}
        </div>

        <StyledImageField
          overlap="circle"
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          badgeContent={
            <Tooltip title="Select a photo">
              <div className="btn-search-photo">
                <IconButton
                  className="btn"
                  style={{
                    backgroundColor: "#e3f2fd",
                    border: `.01em solid #90caf9`,
                  }}
                  htmlFor={name}
                  component="label"
                >
                  <ImageSearchIcon color="primary" fontSize="small" />
                </IconButton>
                <input
                  id={name}
                  className="fileInput"
                  onChange={onSelectFile}
                  type="file"
                  accept="image/x-png,image/gif,image/jpeg"
                />
              </div>
            </Tooltip>
          }
        >
          <Avatar
            src={preview}
            style={{
              height: height,
              width: width,
              backgroundColor: "#fff",
              boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1),
              0 2px 4px -1px rgba(0, 0, 0, 0.06)`,
              border: ".01em solid rgba(0,0,0,.1)",
            }}
            variant={variant ? variant : "circle"}
          >
            {!preview && (
              <div
                style={{
                  display: "grid",
                  justifyContent: "center",
                  textAlign: "center",
                  color: `rgba(0,0,0,.6)`,
                  fontWeight: 600,
                  fontSize: `.87em`,
                }}
              >
                Upload an image
              </div>
            )}
          </Avatar>
        </StyledImageField>
      </div>
    );
  }
);

export default PhotoField;

export const StyledImageField = styled(Badge)`
  .btn-search-photo {
    display: grid;
    grid-template-areas: "content";
    .btn {
      grid-area: content;
    }
    .fileInput {
      grid-area: content;
      display: none;
      opacity: 0;
    }
  }
`;
