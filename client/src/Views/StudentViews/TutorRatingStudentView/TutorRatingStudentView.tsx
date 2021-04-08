import { Avatar, Button } from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import React, { FC, memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import FormDialog from "../../../Component/FormDialog/FormDialog";
import { setGeneralPrompt } from "../../../Services/Actions/PageActions";
import { insertDummyTutorRatingsAction } from "../../../Services/Actions/TutorActions";
import { SetCurrentUserAction } from "../../../Services/Actions/UserActions";
import { getDummyTutorsApi } from "../../../Services/Api/TutorApi";
import { TutorRatingsModel } from "../../../Services/Models/TutorRatingsModel";
import { RootStore } from "../../../Services/Store";

interface TutorRatingStudentViewInterface {}

interface RateTutorInterface {
  picture: any;
  tutor_pk: number;
  name: string;
  bio: string;
  rating: number;
}

export const TutorRatingStudentView: FC<TutorRatingStudentViewInterface> = memo(
  () => {
    const dispatch = useDispatch();

    const user = useSelector((store: RootStore) => store.UserReducer.user);

    const [
      rateTutors,
      setRateTutors,
    ] = useState<Array<TutorRatingsModel> | null>();

    const [steps, setSteps] = useState(0);

    const handleNextStep = () => {
      setSteps((step) => {
        if (step !== 4) {
          return step + 1;
        }

        return step;
      });
    };
    const handlePrevStep = () => {
      setSteps((step) => {
        if (step !== 0) {
          return step - 1;
        }

        return step;
      });
    };

    useEffect(() => {
      let mounted = true;

      const fetch_dummy_tutors = async () => {
        const response = await getDummyTutorsApi();

        if (response.success) {
          setRateTutors(response.data);
        }
      };

      mounted && fetch_dummy_tutors();

      return () => {
        mounted = false;
      };
    }, []);

    return (
      <FormDialog
        title="Please rate these tutors to let us find the best one for you."
        open={user?.rated_tutor === "n"}
        minWidth={400}
        hideCloseButton={true}
        body={
          <>
            {rateTutors &&
              rateTutors.map((t, i) =>
                i === steps ? (
                  <StyledTutorRatingStudentView key={i}>
                    <Avatar
                      className="pic"
                      src={`data:image/jpg;base64,${t.picture}`}
                      variant="square"
                    />

                    <div className="name">{t.name}</div>

                    <div className="bio">
                      <small>{t.bio}</small>
                    </div>

                    <div className="stars">
                      <Rating
                        value={t.rating}
                        name={t.name}
                        onChange={(event, newValue) => {
                          setRateTutors((prevTutor) => {
                            const temp = prevTutor;
                            const foundTutor = temp.findIndex(
                              (item, k) => k === i
                            );

                            temp[foundTutor].rating = newValue;
                            return [...temp];
                          });
                        }}
                      />
                    </div>
                  </StyledTutorRatingStudentView>
                ) : null
              )}
          </>
        }
        actions={
          rateTutors && (
            <>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  handlePrevStep();
                }}
                disabled={steps === 0}
              >
                Previous
              </Button>
              <Button
                variant="contained"
                color="primary"
                disabled={rateTutors[steps]?.rating === 0}
                onClick={() => {
                  if (steps === 4) {
                    let payload = [];

                    rateTutors.forEach((t) => {
                      payload.push({
                        ...t,
                        picture: "",
                      });
                    });

                    dispatch(
                      setGeneralPrompt({
                        open: true,
                        continue_callback: () =>
                          dispatch(
                            insertDummyTutorRatingsAction(
                              payload,
                              (msg: string) => {
                                dispatch(SetCurrentUserAction());
                              }
                            )
                          ),
                      })
                    );
                  } else {
                    handleNextStep();
                  }
                }}
              >
                {steps === 4 ? "Submit" : "Next"}
              </Button>
            </>
          )
        }
      />
    );
  }
);

export default TutorRatingStudentView;

const StyledTutorRatingStudentView = styled.div`
  display: grid;
  justify-items: center;
  grid-gap: 1em;
  .pic {
    height: 220px;
    width: 350px;
  }
  .name {
    font-weight: 700;
  }
  .specialties {
    display: grid;
    grid-gap: 0.5em;
    grid-auto-flow: column;
  }
`;
