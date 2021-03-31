import {
  Avatar,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import FileCopyRoundedIcon from "@material-ui/icons/FileCopyRounded";
import { Form, Formik } from "formik";
import React, { FC, memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FileViwer from "../../../Component/FileViewer";
import FormDialog from "../../../Component/FormDialog/FormDialog";
import FormikInputField from "../../../Component/Formik/FormikInputField";
import IconButtonPopper from "../../../Component/IconButtonPopper/IconButtonPopper";
import LinearLoadingProgress from "../../../Component/LinearLoadingProgress";
import { API_BASE_URL } from "../../../Helpers/AppConfig";
import convertObjectToFormData from "../../../Helpers/convertObjectToFormData";
import { parseDateTimeOrDefault } from "../../../Hooks/UseDateParser";
import ClassMaterialActions from "../../../Services/Actions/ClassMaterialActions";
import { setGeneralPrompt } from "../../../Services/Actions/PageActions";
import { ClassMaterialModel } from "../../../Services/Models/ClassMaterialModel";
import { RootStore } from "../../../Services/Store";
interface ClassMaterialProps {
  class_pk: number;
}

export const ClassMaterialView: FC<ClassMaterialProps> = memo(
  ({ class_pk }) => {
    const dispatch = useDispatch();
    const user_type = useSelector(
      (store: RootStore) => store.UserReducer.user?.user_type
    );
    const [
      selectedMaterial,
      setSelectedMaterial,
    ] = useState<ClassMaterialModel | null>(null);

    const tbl_class_materials = useSelector(
      (store: RootStore) => store.ClassMaterialReducer.tbl_class_materials
    );

    const fetch_class_material = useSelector(
      (store: RootStore) => store.ClassMaterialReducer.fetch_class_material
    );

    const [openEnrollStudentModel, setOpenEnrollStudentModel] = useState(false);

    useEffect(() => {
      let mounted = true;

      const fetch_data = () => {
        dispatch(ClassMaterialActions.setTblClassMaterialAction(class_pk));
      };

      mounted && fetch_data();

      return () => {
        mounted = false;
      };
    }, [class_pk, dispatch]);

    return (
      <div className="class-tab">
        <Grid item container spacing={2}>
          {user_type === "tutor" && (
            <Grid item>
              <Button
                color="primary"
                variant="contained"
                disableElevation
                onClick={() => {
                  setOpenEnrollStudentModel(true);
                }}
              >
                Add Material
              </Button>
            </Grid>
          )}
          <Grid item container justify="flex-end"></Grid>

          <Grid item container spacing={3} justify="flex-start">
            <LinearLoadingProgress show={fetch_class_material} />
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell width="70%">File Description</TableCell>
                    <TableCell width="20%">Added At</TableCell>
                    <TableCell width="10%" align="center">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tbl_class_materials?.map((material, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div
                          style={{
                            display: `grid`,
                            gridAutoFlow: `column`,
                            justifyContent: `start`,
                            gridGap: `1em`,
                            alignItems: `center`,
                            alignContent: `center`,
                          }}
                        >
                          <Avatar
                            style={{
                              backgroundColor: `#f1f8e9`,
                              color: `#33691e`,
                            }}
                            className="avatar"
                          >
                            <FileCopyRoundedIcon />
                          </Avatar>

                          <div className="descrip">
                            <div className="title" style={{ fontWeight: 500 }}>
                              {material.descrip}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <small>
                          {parseDateTimeOrDefault(material.encoded_at, "-")}
                        </small>
                      </TableCell>
                      <TableCell align="center">
                        <div className="actions">
                          <IconButtonPopper
                            style={{ justifySelf: `end` }}
                            buttons={[
                              {
                                text: "View Material",
                                handleClick: () =>
                                  setSelectedMaterial(material),
                              },
                            ]}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
        <FormDialog
          open={openEnrollStudentModel}
          title="Add Material for this Class"
          handleClose={() => setOpenEnrollStudentModel(false)}
          minWidth={500}
          body={
            <Formik
              initialValues={{
                file: "",
                descrip: "",
              }}
              onSubmit={async (values: any, formikHelpers) => {
                values.class_pk = class_pk;
                const payload = convertObjectToFormData(values);

                dispatch(
                  setGeneralPrompt({
                    open: true,
                    continue_callback: () =>
                      dispatch(
                        ClassMaterialActions.addClassMaterialAction(
                          payload,
                          (msg: string) => {
                            formikHelpers.resetForm();
                            dispatch(
                              ClassMaterialActions.setTblClassMaterialAction(
                                class_pk
                              )
                            );
                            setOpenEnrollStudentModel(false);
                          }
                        )
                      ),
                  })
                );
              }}
            >
              {({ setFieldValue }) => (
                <Form>
                  <Grid container spacing={4} style={{ padding: `1em 0` }}>
                    <Grid item xs={12}>
                      {/* <BtnFileUpload /> */}
                      <input
                        accept=".docx,.pdf,.doc,.rtf,.pptx,.ppt,image/*"
                        //   className={classes.input}
                        id="contained-button-file"
                        // multiple
                        type="file"
                        onChange={(e) => {
                          setFieldValue("file", e.target.files[0]);
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <FormikInputField
                        name="descrip"
                        label="Description"
                        multiline={true}
                        required
                        variant="outlined"
                        rows={4}
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} container justify="flex-end">
                      <Grid item>
                        <Button
                          color="primary"
                          type="submit"
                          disableElevation
                          variant="contained"
                        >
                          Save Material
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          }
        />

        {selectedMaterial && (
          <FormDialog
            open={selectedMaterial !== null}
            handleClose={() => setSelectedMaterial(null)}
            title={selectedMaterial?.descrip}
            maxWidth="lg"
            fullScreen={true}
            body={
              <FileViwer
                file={`${API_BASE_URL}${selectedMaterial?.location}`}
              />
            }
          />
        )}
      </div>
    );
  }
);

export default ClassMaterialView;
