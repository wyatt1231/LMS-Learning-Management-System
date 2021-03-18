import {
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import FileCopyRoundedIcon from "@material-ui/icons/FileCopyRounded";
import React, { FC, memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FileViwer from "../../../Component/FileViewer";
import FormDialog from "../../../Component/FormDialog/FormDialog";
import IconButtonPopper from "../../../Component/IconButtonPopper/IconButtonPopper";
import LinearLoadingProgress from "../../../Component/LinearLoadingProgress";
import { API_BASE_URL } from "../../../Helpers/AppConfig";
import { parseDateTimeOrDefault } from "../../../Hooks/UseDateParser";
import ClassMaterialActions from "../../../Services/Actions/ClassMaterialActions";
import { ClassMaterialModel } from "../../../Services/Models/ClassMaterialModel";
import { RootStore } from "../../../Services/Store";
interface ManageClassMaterialTutorInterface {
  class_pk: number;
}

//https://www.pdftron.com/blog/webviewer/introducing-webviewer-react-toolkit/

export const ManageClassMaterialStudentView: FC<ManageClassMaterialTutorInterface> = memo(
  ({ class_pk }) => {
    const dispatch = useDispatch();
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

    console.log(`tbl_class_materials`, tbl_class_materials);

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
        <LinearLoadingProgress show={fetch_class_material} />
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell width="90%">File Description</TableCell>
                <TableCell align="center">Actions</TableCell>
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
                      }}
                    >
                      <Avatar
                        style={{ backgroundColor: `#f5f5f5`, color: `#333` }}
                        className="avatar"
                      >
                        <FileCopyRoundedIcon />
                      </Avatar>

                      <div className="descrip">
                        <div className="title" style={{ fontWeight: 600 }}>
                          {material.descrip}
                        </div>
                        <div className="datetime" style={{ fontSize: `.87em` }}>
                          {parseDateTimeOrDefault(material.encoded_at, "-")}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell align="center">
                    <div className="actions">
                      <IconButtonPopper
                        style={{ justifySelf: `end` }}
                        buttons={[
                          {
                            text: "View Material",
                            handleClick: () => setSelectedMaterial(material),
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

        {selectedMaterial && (
          <FormDialog
            open={selectedMaterial !== null}
            handleClose={() => setSelectedMaterial(null)}
            title={selectedMaterial?.descrip}
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

export default ManageClassMaterialStudentView;
