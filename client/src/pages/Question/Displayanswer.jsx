import React from "react";
import moment from "moment";
import { Link, useParams } from "react-router-dom";
import Avatar from "../../Comnponent/Avatar/Avatar";
import { useDispatch, useSelector } from "react-redux";
import upvoteIcon from "../../assets/sort-up.svg";
import downvoteIcon from "../../assets/sort-down.svg";
import { deleteanswer, voteanswer } from "../../action/question";
import { addPoints, reducePoints } from "../../api";

const Displayanswer = ({ question, handleshare }) => {
  const { id: questionId } = useParams();
  const user = useSelector((s) => s.currentuserreducer);
  const dispatch = useDispatch();

  const onDelete = async (ansId, newCount) => {
    dispatch(deleteanswer(questionId, ansId, newCount));
    try {
      await reducePoints(user.result._id, 5);
    } catch (err) {
      console.error(err);
    }
  };

  const onUpvote = async (ansId, upCount) => {
    if (!user) return alert("Login or Signup to upvote");
    dispatch(voteanswer(questionId, ansId, "upvote"));
    const newCount = (upCount || 0) + 1;
    if (newCount === 5) {
      try {
        await addPoints(user.result._id, 5);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const onDownvote = async (ansId) => {
    if (!user) return alert("Login or Signup to downvote");
    dispatch(voteanswer(questionId, ansId, "downvote"));
    try {
      await reducePoints(user.result._id, 1);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {(question.answer || []).map((ans) => (
        <div className="display-ans" key={ans._id}>

          {/* ─ Vote column ───────────────────────────────── */}
          <div className="question-votes">
            <img
              src={upvoteIcon}
              alt="upvote"
              width={18}
              className="votes-icon"
              onClick={() => onUpvote(ans._id, ans.upvote?.length)}
            />
            <p>
              {(ans.upvote?.length || 0) - (ans.downvote?.length || 0)}
            </p>
            <img
              src={downvoteIcon}
              alt="downvote"
              width={18}
              className="votes-icon"
              onClick={() => onDownvote(ans._id)}
            />
          </div>

          {/* ─ Answer content ───────────────────────────── */}
          <div className="ans-content">
            <p>{ans.answerbody}</p>

            {/* ─ Actions + User info ────────────────────── */}
            <div className="question-actions-user">
              <div className="actions">
                <button onClick={handleshare}>Share</button>
                {user?.result?._id === ans.userid && (
                  <button
                    onClick={() =>
                      onDelete(ans._id, (question.answer?.length || 1) - 1)
                    }
                  >
                    Delete
                  </button>
                )}
              </div>
              <div className="user-info">
                <Link to={`/Users/${ans.userid}`} className="user-link">
                  <Avatar backgroundColor="lightgreen">
                    {ans.useranswered.charAt(0).toUpperCase()}
                  </Avatar>
                  <span>{ans.useranswered}</span>
                </Link>
                <p className="date-text">
                  answered {moment(ans.answeredon).fromNow()}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Displayanswer;
