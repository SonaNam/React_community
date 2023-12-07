import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import http from "@/utils/http";

export interface PostFile {
  name: string;
  mimeType: string;
  url: string;
}

const EditPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<{
    title: string;
    content: string;
    files: PostFile[];
  }>({
    title: "",
    content: "",
    files: [],
  });
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await http.get(
          `http://localhost:8080/community/posts/${postId}`
        );
        setPost({
          title: response.data.title,
          content: response.data.content,
          files: response.data.files,
        });
      } catch (error) {
        console.error("게시물 로드 실패", error);
      }
    };
    fetchPost();
  }, [postId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await http.put(`http://localhost:8080/community/update/${postId}`, post);
      alert("게시글이 수정되었습니다.");
      navigate(`/community/posts/${postId}`);
    } catch (error) {
      console.error("게시물 수정 실패", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={post.title}
        onChange={(e) => setPost({ ...post, title: e.target.value })}
      />
      <textarea
        value={post.content}
        onChange={(e) => setPost({ ...post, content: e.target.value })}
      />
      {post.files.map((file, index) =>
        file.mimeType.startsWith(`image/`) ? (
          <img key={index} src={file.url} alt={`Image ${index}`} />
        ) : (
          <video key={index} controls>
            <source src={file.url} type={file.mimeType} />
          </video>
        )
      )}
      <button type="submit">저장</button>
    </form>
  );
};

export default EditPost;
