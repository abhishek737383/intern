import React, { useState } from "react";
import moment from "moment";
import copy from "copy-to-clipboard";
import upvoteIcon from "../../assets/sort-up.svg";
import downvoteIcon from "../../assets/sort-down.svg";
import "./Question.css";
import Avatar from "../../Comnponent/Avatar/Avatar";
import Displayanswer from "./Displayanswer";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import { deletequestion, votequestion, postanswer } from "../../action/question";

export default function Qustiondetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const question = useSelector((state) =>
    state.questionreducer.data?.find((q) => q._id === id)
  );
  const user = useSelector((state) => state.currentuserreducer);
  const navigate = useNavigate();
  const location = useLocation();
  const baseUrl = window.location.origin;
  const [answer, setAnswer] = useState("");

  const handlePostAns = (e) => {
    e.preventDefault();
    if (!user) {
      alert("Login or Signup to answer a question");
      navigate("/Auth");
      return;
    }
    if (!answer.trim()) {
      alert("Enter an answer before submitting");
      return;
    }
    dispatch(
      postanswer({
        id,
        noofanswers: (question.answers?.length || 0) + 1, // update count based on answers array length
        answerbody: answer,
        userid: user.result._id,
        useranswered: user.result.name,
      })
    );
    setAnswer("");
  };

  const handleShare = () => {
    copy(`${baseUrl}${location.pathname}`);
    alert("Copied URL: " + baseUrl + location.pathname);
  };

  const handleDelete = () => dispatch(deletequestion(id, navigate));

  const handleUpvote = () => {
    if (!user) {
      alert("Login or Signup to upvote");
      navigate("/Auth");
      return;
    }
    dispatch(votequestion(id, "upvote"));
  };

  const handleDownvote = () => {
    if (!user) {
      alert("Login or Signup to downvote");
      navigate("/Auth");
      return;
    }
    dispatch(votequestion(id, "downvote"));
  };

  if (!question)
    return (
      <div className="question-details-page">
        <h1>Question not found or has been deleted.</h1>
        <Link to="/">Return to Home</Link>
      </div>
    );

  return (
    <div className="question-details-page">
      <section className="question-details-container">
        <h1>{question.questiontitile}</h1>
        <div className="question-details-container-2">
          <div className="question-votes">
            <img
              src={upvoteIcon}
              alt="upvote"
              width={18}
              className="votes-icon"
              onClick={handleUpvote}
            />
            <p>{question.upvote.length - question.downvote.length}</p>
            <img
              src={downvoteIcon}
              alt="downvote"
              width={18}
              className="votes-icon"
              onClick={handleDownvote}
            />
          </div>
          <div style={{ width: "100%" }}>
            <p className="question-body">{question.questionbody}</p>
            <div className="question-details-tags">
              {question.questiontags.map((tag) => (
                <p key={tag}>{tag}</p>
              ))}
            </div>
            <div className="question-actions-user">
              <div>
                <button onClick={handleShare}>Share</button>
                {user?.result?._id === question.userid && (
                  <button onClick={handleDelete}>Delete</button>
                )}
              </div>
              <div>
                <p>Asked {moment(question.askedon).fromNow()}</p>
                <Link
                  to={`/Users/${question.userid}`}
                  className="user-link"
                  style={{ color: "#0086d8" }}
                >
                  <Avatar
                    backgroundColor="orange"
                    px="8px"
                    py="5px"
                    borderRadius="4px"
                  >
                    {question.userposted.charAt(0).toUpperCase()}
                  </Avatar>
                  <div>{question.userposted}</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h3>
          {question.answers && question.answers.length > 0
            ? `${question.answers.length} Answers`
            : "No Answers"}
        </h3>
        <Displayanswer question={question} handleshare={handleShare} />
      </section>

      <section className="post-ans-container">
        <h3>Your Answer</h3>
        <form onSubmit={handlePostAns}>
          <textarea
            cols="30"
            rows="10"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <br />
          <input
            type="submit"
            className="post-ans-btn"
            value="Post your Answer"
          />
        </form>
        <p>
          Browse other Questions tagged{" "}
          {question.questiontags.map((tag) => (
            <Link to="/Tags" key={tag} className="ans-tag">
              {tag}
            </Link>
          ))}{" "}
          or{" "}
          <Link
            to="/Askquestion"
            style={{ textDecoration: "none", color: "#009dff" }}
          >
            Ask your own question
          </Link>
        </p>
      </section>
    </div>
  );
}
