import { CircularProgress, Switch } from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import React, { FC, memo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomAvatar from "../../../Component/CustomAvatar";
import FormDialog from "../../../Component/FormDialog/FormDialog";
import UseNumbers from "../../../Hooks/UseNumbers";
import TutorActions from "../../../Services/Actions/TutorActions";
import { TutorFavModel } from "../../../Services/Models/TutorFavModel";
import { TutorRatingsModel } from "../../../Services/Models/TutorRatingsModel";
import { RootStore } from "../../../Services/Store";
import { StyledRateTutorDialog } from "./styles";

interface IRateTutorDialog {}

export const RateTutorDialog: FC<IRateTutorDialog> = memo(() => {
  const dispatch = useDispatch();
  const single_tutor_to_student = useSelector(
    (store: RootStore) => store.TutorReducer.single_tutor_to_student
  );

  const fetch_single_tutor_to_student = useSelector(
    (store: RootStore) => store.TutorReducer.fetch_single_tutor_to_student
  );

  const handleCloseDialog = useCallback(() => {
    dispatch(TutorActions.getSingTutorToStudent(null));
  }, [dispatch]);

  return (
    <>
      <FormDialog
        open={!!single_tutor_to_student}
        title="Tutor's Information"
        handleClose={handleCloseDialog}
        minWidth={500}
        maxWidth="xs"
        body={
          <StyledRateTutorDialog>
            {fetch_single_tutor_to_student && !single_tutor_to_student ? (
              <div
                style={{
                  display: `grid`,
                  justifyContent: `center`,
                  justifyItems: `center`,
                  padding: `5em`,
                }}
              >
                <CircularProgress size={30} />
              </div>
            ) : (
              <div className="tutor-info-container">
                <CustomAvatar
                  src={single_tutor_to_student?.picture}
                  heightSpacing={20}
                  widthSpacing={20}
                  errorMessage={single_tutor_to_student?.firstname?.charAt(0)}
                />

                <div className="name">
                  {single_tutor_to_student?.firstname}{" "}
                  {single_tutor_to_student?.middlename}{" "}
                  {single_tutor_to_student?.lastname}{" "}
                  {single_tutor_to_student?.suffix}
                </div>
                <div className="position">
                  {single_tutor_to_student?.position}
                </div>

                <div className="bio">{single_tutor_to_student?.bio}</div>

                <div className="info-group-container">
                  <div className="info-group bordered">
                    <div className="label">Gender</div>
                    <div className="value">
                      {single_tutor_to_student?.gender === "f"
                        ? "Female"
                        : "Male"}
                    </div>
                  </div>

                  <div className="info-group bordered">
                    <div className="label">Rating</div>
                    <div className="value">
                      <Rating
                        value={UseNumbers.toNumber(
                          single_tutor_to_student?.rating,
                          0
                        )}
                        name="rating"
                        onChange={(event, newValue) => {
                          const payload: TutorRatingsModel = {
                            rating: newValue,
                            tutor_pk: parseInt(
                              single_tutor_to_student.tutor_pk
                            ),
                          };

                          dispatch(
                            TutorActions.rateTutor(payload, () => {
                              dispatch(
                                TutorActions.getSingTutorToStudent(
                                  parseInt(single_tutor_to_student.tutor_pk)
                                )
                              );
                            })
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div className="info-group bordered">
                    <div className="label">Favorited</div>
                    <div className="value">
                      <Switch
                        color="primary"
                        checked={single_tutor_to_student?.favorited === "y"}
                        onChange={() => {
                          const payload: TutorFavModel = {
                            tutor_pk: parseInt(
                              single_tutor_to_student.tutor_pk
                            ),
                          };
                          dispatch(
                            TutorActions.favoriteTutor(payload, () => {
                              dispatch(
                                TutorActions.getSingTutorToStudent(
                                  parseInt(single_tutor_to_student.tutor_pk)
                                )
                              );
                            })
                          );
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </StyledRateTutorDialog>
        }
        actions={
          <>
            {/* <Button color="primary" variant="contained">
              Save Changes
            </Button> */}
          </>
        }
      />
    </>
  );
});

export default RateTutorDialog;
