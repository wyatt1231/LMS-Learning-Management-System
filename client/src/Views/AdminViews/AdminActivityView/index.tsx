import { Drawer, Grid, IconButton } from "@material-ui/core";
import React, { memo, FC } from "react";
import CustomAvatar from "../../../Component/CustomAvatar";
import { StyledActivity } from "./styles";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "../../../Services/Store";
import { toggleActivitySidebar } from "../../../Services/Actions/PageActions";

interface IAdminActivityView {}

export const AdminActivityView: FC<IAdminActivityView> = memo(() => {
  const dispatch = useDispatch();
  const is_open = useSelector(
    (store: RootStore) => store.PageReducer.toggle_activity_sidebar
  );
  return (
    <>
      <Drawer
        anchor="right"
        PaperProps={{
          style: {
            minWidth: 300,
            maxWidth: 300,
            padding: `.5em`,
            paddingTop: `0`,
          },
        }}
        open={is_open}
        onClose={() => dispatch(toggleActivitySidebar(false))}
      >
        <div
          style={{
            display: `grid`,
            gridAutoFlow: `column`,
            gridAutoColumns: `1fr auto`,
            gridGap: `.5em`,
            padding: `0 .3em`,
            alignContent: `center`,
            alignItems: `center`,
            height: 60,
          }}
        >
          <div className="container-title">Latest Activities</div>
          <IconButton
            size="small"
            style={{
              backgroundColor: `#ffebee`,
              color: `#b71c1c
                `,
            }}
            onClick={() => dispatch(toggleActivitySidebar(false))}
          >
            <CloseRoundedIcon />
          </IconButton>
        </div>

        <Grid
          container
          spacing={2}
          style={{
            height: `90%`,
            maxHeight: `calc(100%-60px)`,
            overflowY: `auto`,
          }}
          alignContent="flex-start"
          alignItems="flex-start"
        >
          <Grid item xs={12}>
            <StyledActivity>
              <CustomAvatar
                heightSpacing={4}
                widthSpacing={4}
                className="img"
                src=""
                errorMessage="JD"
              />
              <div className="activity">
                <b>John Doe</b> added a new tutor
              </div>
              <div className="datetime">18 min ago</div>
            </StyledActivity>
          </Grid>
          <Grid item xs={12}>
            <StyledActivity>
              <CustomAvatar
                heightSpacing={4}
                widthSpacing={4}
                className="img"
                src=""
                errorMessage="JD"
              />
              <div className="activity">
                <b>John Doe</b> added a new tutor
              </div>
              <div className="datetime">18 min ago</div>
            </StyledActivity>
          </Grid>
          <Grid item xs={12}>
            <StyledActivity>
              <CustomAvatar
                heightSpacing={4}
                widthSpacing={4}
                className="img"
                src=""
                errorMessage="JD"
              />
              <div className="activity">
                <b>John Doe</b> added a new tutor
              </div>
              <div className="datetime">18 min ago</div>
            </StyledActivity>
          </Grid>

          <Grid item xs={12}>
            <StyledActivity>
              <CustomAvatar
                heightSpacing={4}
                widthSpacing={4}
                className="img"
                src=""
                errorMessage="JD"
              />
              <div className="activity">
                <b>John Doe</b> added a new tutor
              </div>
              <div className="datetime">18 min ago</div>
            </StyledActivity>
          </Grid>
          <Grid item xs={12}>
            <StyledActivity>
              <CustomAvatar
                heightSpacing={4}
                widthSpacing={4}
                className="img"
                src=""
                errorMessage="JD"
              />
              <div className="activity">
                <b>John Doe</b> added a new tutor
              </div>
              <div className="datetime">18 min ago</div>
            </StyledActivity>
          </Grid>
          <Grid item xs={12}>
            <StyledActivity>
              <CustomAvatar
                heightSpacing={4}
                widthSpacing={4}
                className="img"
                src=""
                errorMessage="JD"
              />
              <div className="activity">
                <b>John Doe</b> added a new tutor
              </div>
              <div className="datetime">18 min ago</div>
            </StyledActivity>
          </Grid>

          <Grid item xs={12}>
            <StyledActivity>
              <CustomAvatar
                heightSpacing={4}
                widthSpacing={4}
                className="img"
                src=""
                errorMessage="JD"
              />
              <div className="activity">
                <b>John Doe</b> added a new tutor
              </div>
              <div className="datetime">18 min ago</div>
            </StyledActivity>
          </Grid>
          <Grid item xs={12}>
            <StyledActivity>
              <CustomAvatar
                heightSpacing={4}
                widthSpacing={4}
                className="img"
                src=""
                errorMessage="JD"
              />
              <div className="activity">
                <b>John Doe</b> added a new tutor
              </div>
              <div className="datetime">18 min ago</div>
            </StyledActivity>
          </Grid>
          <Grid item xs={12}>
            <StyledActivity>
              <CustomAvatar
                heightSpacing={4}
                widthSpacing={4}
                className="img"
                src=""
                errorMessage="JD"
              />
              <div className="activity">
                <b>John Doe</b> added a new tutor
              </div>
              <div className="datetime">18 min ago</div>
            </StyledActivity>
          </Grid>

          <Grid item xs={12}>
            <StyledActivity>
              <CustomAvatar
                heightSpacing={4}
                widthSpacing={4}
                className="img"
                src=""
                errorMessage="JD"
              />
              <div className="activity">
                <b>John Doe</b> added a new tutor
              </div>
              <div className="datetime">18 min ago</div>
            </StyledActivity>
          </Grid>
          <Grid item xs={12}>
            <StyledActivity>
              <CustomAvatar
                heightSpacing={4}
                widthSpacing={4}
                className="img"
                src=""
                errorMessage="JD"
              />
              <div className="activity">
                <b>John Doe</b> added a new tutor
              </div>
              <div className="datetime">18 min ago</div>
            </StyledActivity>
          </Grid>
          <Grid item xs={12}>
            <StyledActivity>
              <CustomAvatar
                heightSpacing={4}
                widthSpacing={4}
                className="img"
                src=""
                errorMessage="JD"
              />
              <div className="activity">
                <b>John Doe</b> added a new tutor
              </div>
              <div className="datetime">18 min ago</div>
            </StyledActivity>
          </Grid>

          <Grid item xs={12}>
            <StyledActivity>
              <CustomAvatar
                heightSpacing={4}
                widthSpacing={4}
                className="img"
                src=""
                errorMessage="JD"
              />
              <div className="activity">
                <b>John Doe</b> added a new tutor
              </div>
              <div className="datetime">18 min ago</div>
            </StyledActivity>
          </Grid>
          <Grid item xs={12}>
            <StyledActivity>
              <CustomAvatar
                heightSpacing={4}
                widthSpacing={4}
                className="img"
                src=""
                errorMessage="JD"
              />
              <div className="activity">
                <b>John Doe</b> added a new tutor
              </div>
              <div className="datetime">18 min ago</div>
            </StyledActivity>
          </Grid>
          <Grid item xs={12}>
            <StyledActivity>
              <CustomAvatar
                heightSpacing={4}
                widthSpacing={4}
                className="img"
                src=""
                errorMessage="JD"
              />
              <div className="activity">
                <b>John Doe</b> added a new tutor
              </div>
              <div className="datetime">18 min ago</div>
            </StyledActivity>
          </Grid>

          <Grid item xs={12}>
            <StyledActivity>
              <CustomAvatar
                heightSpacing={4}
                widthSpacing={4}
                className="img"
                src=""
                errorMessage="JD"
              />
              <div className="activity">
                <b>John Doe</b> added a new tutor
              </div>
              <div className="datetime">18 min ago</div>
            </StyledActivity>
          </Grid>
          <Grid item xs={12}>
            <StyledActivity>
              <CustomAvatar
                heightSpacing={4}
                widthSpacing={4}
                className="img"
                src=""
                errorMessage="JD"
              />
              <div className="activity">
                <b>John Doe</b> added a new tutor
              </div>
              <div className="datetime">18 min ago</div>
            </StyledActivity>
          </Grid>
          <Grid item xs={12}>
            <StyledActivity>
              <CustomAvatar
                heightSpacing={4}
                widthSpacing={4}
                className="img"
                src=""
                errorMessage="JD"
              />
              <div className="activity">
                <b>John Doe</b> added a new tutor
              </div>
              <div className="datetime">18 min ago</div>
            </StyledActivity>
          </Grid>
        </Grid>
      </Drawer>
    </>
  );
});

export default AdminActivityView;
