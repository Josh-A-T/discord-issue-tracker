import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";

export default function CreateIssue() {
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newIssue = {
        username: "current_user",
        comment,
        comment_media: "",
        status: "Open",
        is_pinned: false,
        reply_to: null,
      };
      const { data } = await apiClient.post("/issues", newIssue);
      navigate(`/issues/&{data.id}`);
    } catch (err) {
      setError("Failed to create issue");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="createIssue-form">
      <h1>Create New Issue</h1>
      <form onSubmit={handleSubmit} className="Title">
        <div>
          <label className="createIssue-title-label">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="createIssue-details-field"
            placeholder="Title..."
          />
        </div>
        <div>
          <label className="createIssue-details-label">Details: </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="createIssue-details-field"
            required
            placeholder="Details..."
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 rounded text-white ${
            isSubmitting ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Create Issue"}
        </button>
      </form>
    </div>
  );
}
