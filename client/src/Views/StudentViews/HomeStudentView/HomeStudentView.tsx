import { Avatar, Paper } from "@material-ui/core";
import React, { FC, memo, useEffect } from "react";
import { useDispatch } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import { setSelectedClassAction } from "../../../Services/Actions/ClassActions";
import { setPageLinks } from "../../../Services/Actions/PageActions";
import { StyledHomeStudent } from "./styles";

interface HomeStudentViewInterface {}

export const HomeStudentView: FC<HomeStudentViewInterface> = memo(() => {
  const dispatch = useDispatch();
  const params = useParams<any>();

  useEffect(() => {
    let mounted = true;

    const fetching_data = () => {
      dispatch(setSelectedClassAction(params.id));
    };

    mounted && fetching_data();
    return () => (mounted = false);
  }, [dispatch, params.id]);

  useEffect(() => {
    let mounted = true;

    const initializingState = () => {
      dispatch(
        setPageLinks([
          {
            link: "/student/home",
            title: "Home",
          },
        ])
      );
    };

    mounted && initializingState();
    return () => (mounted = false);
  }, [dispatch]);

  return (
    <StyledHomeStudent>
      <Paper className="recommended-tutor-ctnr">
        <div className="content-title">Tutors you may like</div>
        <div className="recommendations">
          <div className="recommend-item">
            <Avatar
              variant="rounded"
              className="img"
              src={`https://cdn.tutors.com/assets/images/bg/desktop/math-tutor-cost.jpg`}
            />
            <NavLink to="/" className="name">
              John Doe
            </NavLink>
            <div className="rating">
              3.4 <small>stars</small>
            </div>
          </div>
          <div className="recommend-item">
            <Avatar
              variant="rounded"
              className="img"
              src={`https://excellenthometutorghana.files.wordpress.com/2020/01/92485-math-tutor-12.jpg?w=1000`}
            />
            <NavLink to="/" className="name">
              John Doe
            </NavLink>
            <div className="rating">
              3.4 <small>stars</small>
            </div>
          </div>
          <div className="recommend-item">
            <Avatar
              variant="rounded"
              className="img"
              src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9ciYleVOn1U316xJEVCnsVpW9D_rOEu8tfw&usqp=CAU`}
            />
            <NavLink to="/" className="name">
              John Doe
            </NavLink>
            <div className="rating">
              3.4 <small>stars</small>
            </div>
          </div>
        </div>
      </Paper>

      <Paper className="timeline-ctnr">
        <div className="content-title">Timeline</div>
        <div className="timeline">
          <div className="timeline-item">
            <Avatar
              src={`https://cdn.tutors.com/assets/images/bg/desktop/math-tutor-cost.jpg`}
              className="pic"
            />
            <div className="description">
              <div className="name">Professor Idpalina</div>
              <div className="body">
                Here are a few things you can do to get started
              </div>
              <div className="datetime">Thu Jul 11, 2019 at 5:28 pm</div>
            </div>
          </div>

          <div className="timeline-item">
            <Avatar
              src={`https://cdn.tutors.com/assets/images/bg/desktop/math-tutor-cost.jpg`}
              className="pic"
            />
            <div className="description">
              <div className="name">Professor Idpalina</div>
              <div className="body">
                Here are a few things you can do to get started
              </div>
              <div className="datetime">Thu Jul 11, 2019 at 5:28 pm</div>
            </div>
          </div>

          <div className="timeline-item">
            <Avatar
              src={`https://cdn.tutors.com/assets/images/bg/desktop/math-tutor-cost.jpg`}
              className="pic"
            />
            <div className="description">
              <div className="name">Professor Idpalina</div>
              <div className="body">
                Here are a few things you can do to get started
              </div>
              <div className="datetime">Thu Jul 11, 2019 at 5:28 pm</div>
            </div>
          </div>

          <div className="timeline-item">
            <Avatar
              src={`https://cdn.tutors.com/assets/images/bg/desktop/math-tutor-cost.jpg`}
              className="pic"
            />
            <div className="description">
              <div className="name">Professor Idpalina</div>
              <div className="body">
                Here are a few things you can do to get started
              </div>
              <div className="datetime">Thu Jul 11, 2019 at 5:28 pm</div>
            </div>
          </div>

          <div className="timeline-item">
            <Avatar
              src={`https://cdn.tutors.com/assets/images/bg/desktop/math-tutor-cost.jpg`}
              className="pic"
            />
            <div className="description">
              <div className="name">Professor Idpalina</div>
              <div className="body">
                Here are a few things you can do to get started
              </div>
              <div className="datetime">Thu Jul 11, 2019 at 5:28 pm</div>
            </div>
          </div>
        </div>
      </Paper>

      <Paper className="class-ctnr">
        <div className="content-title">On-going Sessions</div>

        <div className="classes">
          <div className="class-item">
            <div className="date">FRIDAY, FEBRUARY 22, 2019</div>
            <NavLink to="/" className="title">
              Math 501
            </NavLink>
            <div className="time">7:59 am</div>
          </div>

          <div className="class-item">
            <div className="date">FRIDAY, FEBRUARY 22, 2019</div>
            <NavLink to="/" className="title">
              Math 501
            </NavLink>
            <div className="time">7:59 am</div>
          </div>

          <div className="class-item">
            <div className="date">FRIDAY, FEBRUARY 22, 2019</div>
            <NavLink to="/" className="title">
              Math 501
            </NavLink>
            <div className="time">7:59 am</div>
          </div>

          <div className="class-item">
            <div className="date">FRIDAY, FEBRUARY 22, 2019</div>
            <NavLink to="/" className="title">
              Math 501
            </NavLink>
            <div className="time">7:59 am</div>
          </div>

          <div className="class-item">
            <div className="date">FRIDAY, FEBRUARY 22, 2019</div>
            <NavLink to="/" className="title">
              Math 501
            </NavLink>
            <div className="time">7:59 am</div>
          </div>

          <div className="class-item">
            <div className="date">FRIDAY, FEBRUARY 22, 2019</div>
            <NavLink to="/" className="title">
              Math 501
            </NavLink>
            <div className="time">7:59 am</div>
          </div>
        </div>
      </Paper>
    </StyledHomeStudent>
  );
});

export default HomeStudentView;
