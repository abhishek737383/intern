import React, { useState } from "react";
import moment from "moment";
import copy from "copy-to-clipboard";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import upvoteIcon from "../../assets/sort-up.svg";
import downvoteIcon from "../../assets/sort-down.svg";
import "./Question.css";
import Avatar from "../../Comnponent/Avatar/Avatar";
import Displayanswer from "./Displayanswer";
import { deletequestion, votequestion, postanswer } from "../../action/question";
import { addPoints, reducePoints } from "../../api";

export default function QuestionDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const baseUrl = window.location.origin;

  // Find this question in Redux state
  const question = useSelector((s) =>
    s.questionreducer.data?.find((q) => q._id === id)
  );
  const user = useSelector((s) => s.currentuserreducer);
  const [answer, setAnswer] = useState("");

  // ─── 1. Posting an answer (and +5 points) ─────────────────
  const handlePostAns = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/Auth", { state: { from: location } });
    if (!answer.trim()) return alert("Enter an answer.");

    dispatch(
      postanswer({
        id,
        noofanswers: (question.answer?.length || 0) + 1,
        answerbody: answer,
        useranswered: user.result.name,
        userid: user.result._id,
      })
    );
    try {
      await addPoints(user.result._id, 5);
    } catch (err) {
      console.error(err);
    }
    setAnswer("");
  };

  // ─── 2. Copy link to clipboard ─────────────────────────
  const handleShare = () => {
    copy(`${baseUrl}${location.pathname}`);
    alert("Link copied!");
  };

  // ─── 3. Delete question ────────────────────────────────
  const handleDelete = () => dispatch(deletequestion(id, navigate));

  // ─── 4. Upvote question (+bonus at 5) ──────────────────
  const handleUpvote = async () => {
    if (!user) return navigate("/Auth", { state: { from: location } });
    dispatch(votequestion(id, "upvote"));
    const newCount = (question.upvote?.length || 0) + 1;
    if (newCount === 5) {
      try {
        await addPoints(user.result._id, 5);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // ─── 5. Downvote question (–1 pt) ─────────────────────
  const handleDownvote = async () => {
    if (!user) return navigate("/Auth", { state: { from: location } });
    dispatch(votequestion(id, "downvote"));
    try {
      await reducePoints(user.result._id, 1);
    } catch (err) {
      console.error(err);
    }
  };

  if (!question) {
    return (
      <div className="question-details-page">
        <h1>Question not found</h1>
        <Link to="/">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="question-details-page">
      <section className="question-details-container">
      <h1>{question.questiontitle}</h1>

        <div className="question-details-container-2">
          {/* ─ Vote column ──────────────────────────────────── */}
          <div className="question-votes">
            <img src={upvoteIcon} alt="up" onClick={handleUpvote} />
            <p>
              {(question.upvote?.length || 0) -
                (question.downvote?.length || 0)}
            </p>
            <img src={downvoteIcon} alt="down" onClick={handleDownvote} />
          </div>

          {/* ─ Main content ─────────────────────────────────── */}
          <div className="question-content">
            <p>{question.questionbody}</p>

            <div className="question-details-tags">
              {question.questiontags.map((t) => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>

            {/* ─ Actions + User info row ─────────────────────── */}
            <div className="question-actions-user">
              {/* Wrap your Share/Delete in a wrapper */}
              <div className="actions">
                <button onClick={handleShare}>Share</button>
                {user?.result?._id === question.userid && (
                  <button onClick={handleDelete}>Delete</button>
                )}
              </div>

              {/* User info block: avatar/name on top, date below */}
              <div className="user-info">
                <Link to={`/Users/${question.userid}`} className="user-link">
                  <Avatar backgroundColor="orange">
                    {question.userposted.charAt(0).toUpperCase()}
                  </Avatar>
                  <span>{question.userposted}</span>
                </Link>
                <p className="date-text">
                  Asked {moment(question.askedon).fromNow()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─ Answers list ───────────────────────────────────── */}
      <section>
        <h3>
          {(question.answer?.length || 0) > 0
            ? `${question.answer.length} Answers`
            : "No Answers"}
        </h3>
        <Displayanswer question={question} handleshare={handleShare} />
      </section>

      {/* ─ Post answer form ────────────────────────────────── */}
      <section className="post-ans-container">
        <h3>Your Answer</h3>
        <form onSubmit={handlePostAns}>
          <textarea
            rows="8"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <button type="submit" className="post-ans-btn">
            Post Your Answer
          </button>
        </form>
      </section>
       {/* ─ Browse other tags ─ */}
       <p style={{ marginTop: "20px" }}>
  Browse other Question tagged{" "}
  {Array.isArray(question.questiontags) &&
    question.questiontags.map((t) => (
      <Link to="/Tags" key={t} className="ans-tags">
        {" "}{t}{" "}
      </Link>
    ))}{" "}
  or{" "}
  <Link
    to="/AskQuestion"
    style={{ textDecoration: "none", color: "#009dff" }}
  >
    ask your own question.
  </Link>
</p>
    </div>
  );
}
