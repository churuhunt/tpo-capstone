import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PostView.css';
import api from '../axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';  // 따봉, 신고 아이콘
import banner1 from '../image/infobanner.jpg';
import Banner from '../components/Banner';
import LoadingModal from '../components/LoadingModal';

import reportIcon from '../image/report.png';  // 신고하기 아이콘
import replyIcon from '../image/reply.png';    // 대댓글 작성 아이콘

const PostView = () => {
  const { postId } = useParams(); // URL에서 postId를 가져옴
  const navigate = useNavigate(); // 목록으로 돌아가기 위한 네비게이션
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [isBlind, setIsBlind] = useState(false);  // 블라인드 여부 상태
  const [newComment, setNewComment] = useState(''); // 새로운 댓글
  const [newReply, setNewReply] = useState({}); // 대댓글 상태
  const [activeReply, setActiveReply] = useState(null); // 활성화된 대댓글 입력창 상태
  const [reportReason, setReportReason] = useState('');  // 신고 사유
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);  // 신고 모달 상태
  const [editingCommentId, setEditingCommentId] = useState(null);  // 댓글 수정 상태
  const [commentEditText, setCommentEditText] = useState('');  // 댓글 수정 텍스트
  const [isBookmarked, setIsBookmarked] = useState(false); // 북마크 여부 상태
  const [userId, setuserId] = useState(null); // 현재 사용자 ID
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentId, setcommentId] = useState(null)

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await api.get('/users/current');
        setuserId(response.data.id); // Set the current user's ID
      } catch (error) {
        console.error('현재 사용자 정보를 불러오는 중 오류가 발생했습니다:', error);
      }
    };


    const fetchPost = async () => {
      try {
        const response = await api.get(`/posts/${postId}`); // axios 인스턴스 사용
        setPost(response.data);
        setComments(response.data.comments || []);
        // 현재 게시물이 북마크 상태인지 확인합니다.
        // 북마크 상태 확인 로직을 분리
        const bookmarkStatus = await checkBookmarkStatus(response.data.id); // 수정된 코드
        setIsBookmarked(bookmarkStatus);
        if (response.data.isBlind) {
          setIsBlind(true);
        }
      } catch (error) {
        console.error('게시물을 불러오는 중 오류가 발생했습니다:', error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await api.get(`/posts/${postId}/comments`);
        setComments(Array.isArray(response.data) ? response.data : []); // 배열이 아니면 빈 배열 설정
      } catch (error) {
        console.error("댓글을 불러오는 중 오류 발생:", error);
        setComments([]); // 오류 발생 시 빈 배열로 설정
      }
    };

    const checkBookmarkStatus = async () => {
      try {
        const response = await api.get(`/bookmarks`);
        const bookmarkedPosts = response.data;
        console.log(bookmarkedPosts)
        // 이 게시물이 북마크된 게시물 목록에 있는지 확인
        return bookmarkedPosts.some((post) => post.id === parseInt(postId));
      } catch (error) {
        console.error('북마크 상태를 확인하는 중 오류가 발생했습니다:', error);
        return false;  // 오류가 발생하면 기본값은 false
      }
    };

    fetchCurrentUser(); // Fetch current user
    fetchPost();
    fetchComments();
  }, [postId]);


  const handleLike = async () => {
    await api.post(`/posts/${postId}/like`); // axios 인스턴스 사용
    setPost({ ...post, likes: post.likes + 1 });
  };


  const handleDislike = async () => {
    await api.post(`/posts/${postId}/dislike`); // axios 인스턴스 사용
    setPost({ ...post, dislikes: post.dislikes + 1 });
    if (post.dislikes + 1 >= 10) {
      setIsBlind(true);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    try {
      const response = await api.post(`/posts/${postId}/comments`, { content: commentText }); // axios 인스턴스 사용
      setComments([...comments, { ...response.data }]); // 서버에서 반환한 댓글 데이터 추가
      setCommentText('');
    } catch (error) {
      alert("댓글 제출 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };


  const handleLikeComment = async (commentId) => {
    try {
      await api.post(`/comments/${commentId}/like`);
      setComments((prevComments) =>
          prevComments.map((comment) =>
              comment.id === commentId ? { ...comment, likes: (comment.likes || 0) + 1 } : comment
          )
      );
    } catch (error) {
      console.error("댓글 추천 중 오류가 발생했습니다:", error);
    }
  };

  const handleDislikeComment = async (commentId) => {
    try {
      await api.post(`/comments/${commentId}/dislike`);
      setComments((prevComments) =>
          prevComments.map((comment) =>
              comment.id === commentId ? { ...comment, dislikes: (comment.dislikes || 0) + 1 } : comment
          )
      );
    } catch (error) {
      console.error("댓글 비추천 중 오류가 발생했습니다:", error);
    }
  };

  const handleOpenReportModal = () => {
    setIsReportModalOpen(true);  // 신고 모달 열기
  };

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);  // 신고 모달 닫기
  };

  const handleReportSubmit = async () => {
    if (!reportReason.trim()) {
      alert("신고 사유를 입력해 주세요.");
      return;
    }
    try {
      await api.post(`/posts/${postId}/report`, { reason: reportReason }); // axios 인스턴스 사용
      alert("신고가 접수되었습니다.");
      setIsReportModalOpen(false);  // 신고 후 모달 닫기
      setReportReason('');  // 신고 사유 초기화
    } catch (error) {
      console.error("신고 중 오류가 발생했습니다:", error);
    }
  };


  const handlecommentReportSubmit = async (commentId) => {
    if (!reportReason.trim()) {
      alert("신고 사유를 입력해 주세요.");
      return;
    }
    try {
      await api.post(`/comments/${commentId}/report`, { reason: reportReason });
      alert("신고가 접수되었습니다.");
      setIsReportModalOpen(false);
      setReportReason('');
    } catch (error) {
      console.error("신고 중 오류가 발생했습니다:", error);
    }
  };

  const handleConfirmBlindPost = () => {
    setIsBlind(false);
  };

  const handleConfirmBlindComment = (commentId) => {
    setComments(
        comments.map(comment => comment.id === commentId ? { ...comment, isBlind: false } : comment)
    );
  };

  // 글 삭제 로직
  const handleDeletePost = async () => {
    if (window.confirm("정말로 이 글을 삭제하시겠습니까?")) {
      try {
        await api.delete(`/posts/${postId}`); // axios 인스턴스 사용
        alert("게시물이 삭제되었습니다.");
        navigate("/");  // 목록으로 이동
      } catch (error) {
        console.error("게시물 삭제 중 오류가 발생했습니다:", error);
      }
    }
  };


  // 댓글 삭제
  const handleDeleteComment = async (commentId) => {
    if (window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
      try {
        await api.delete(`/comments/${commentId}`); // axios 인스턴스 사용
        alert("댓글이 삭제되었습니다.");
        setComments(comments.filter(comment => comment.id !== commentId)); // 상태 업데이트
        // 댓글 목록 갱신 로직 필요
      } catch (error) {
        alert("댓글 삭제 중 오류가 발생했습니다. 다시 시도해주세요");
      }
    }
  };

  //북마크
  const toggleBookmark = async () => {
    try {
      await api.post(`/bookmarks/toggle/${postId}`);
      setIsBookmarked((prev) => !prev);
    } catch (error) {
      console.error("북마크 토글 중 오류가 발생했습니다:", error);
    }
  };

  // <img> 태그와 base64 문자열을 제거하는 함수
  const removeImagesAndBase64 = (content) => {
    // <img> 태그 제거
    let filteredContent = content.replace(/<img[^>]*>/g, '');
    // base64 문자열 제거 (이미지가 있을 수 있는 부분만 처리)
    filteredContent = filteredContent.replace(/data:image\/(png|jpg|jpeg|gif);base64,[^\s]+/g, '');
    return filteredContent;
  };



  if (!post) {
    return <div>게시물을 불러오는 중입니다...</div>;
  }


  if (isBlind) {
    return (
        <div className="blind-post">
          <p>이 게시글은 블라인드 처리되었습니다. 확인하시겠습니까?</p>
          <button onClick={handleConfirmBlindPost}>확인</button>
        </div>
    );
  }

  const toggleReplyInput = (commentId) => {
    setActiveReply((prev) => (prev === commentId ? null : commentId));
  };

  if (!post) return <div>게시물을 불러오는 중입니다...</div>;

  return (
      <div className="PageView-container">
        <h1 className="PageView-post-title">{post.title}</h1>
        <div className="PageView-post-info">
          <img src={post.profileImageUrl} alt={`${post.author} 프로필`} className="PageView-profile-image"/>
          <p className="PageView-author">{post.author}</p>
          <p className="PageView-date">작성일자: {new Date(post.date).toLocaleDateString()}</p>
          <p className="PageView-views">조회수: {post.views}</p>
          <p className="PageView-likes">추천수: {post.likes}</p>
        </div>
        <div className="PageView-post-content">
          <div>{removeImagesAndBase64(post.content)}</div>

          {/* 이미지 출력 부분 */}
          {post.imageUrl && (
              <div>
                <img src={post.imageUrl} alt="Post Image" style={{width: '100%', height: 'auto'}}/>
              </div>
          )}


        </div>

        <div className="post-reactions">
          <button onClick={handleLike}>
            <FontAwesomeIcon icon={faThumbsUp}/> 추천 {post.likes}
          </button>
          <button onClick={handleDislike}>
            <FontAwesomeIcon icon={faThumbsDown}/> 비추천 {post.dislikes}
          </button>
          <button onClick={handleOpenReportModal}>
            <FontAwesomeIcon icon={faExclamationTriangle}/> 신고
          </button>
          <button onClick={toggleBookmark}>
            {isBookmarked ? '북마크 해제' : '북마크'}
          </button>
          <button onClick={handleDeletePost}>글 삭제</button>
        </div>

        <div className="PageView-comments-section">
          <h2>댓글</h2>
          {Array.isArray(comments) && comments.map((comment, index) => (
              <div key={index} className="comment-item">
                {comment.isBlind ? (
                    <div>
                      <p>이 댓글은 블라인드 처리되었습니다. 확인하시겠습니까?</p>
                      <button onClick={() => handleConfirmBlindComment(comment.id)}>확인</button>
                    </div>
                ) : (
                    <>
                      <p>{comment.author.nickname}: {comment.content}</p>
                      <div className="comment-reactions">
                        <button onClick={() => handleLikeComment(comment.id)}>
                          <FontAwesomeIcon icon={faThumbsUp}/> 추천 {comment.likes || 0}
                        </button>
                        <button onClick={() => handleDislikeComment(comment.id)}>
                          <FontAwesomeIcon icon={faThumbsDown}/> 비추천 {comment.dislikes || 0}
                        </button>
                        <button onClick={() => handleOpenReportModal(comment.id)}>
                          <FontAwesomeIcon icon={faExclamationTriangle}/> 신고
                        </button>
                        <button onClick={() => handleDeleteComment(comment.id)}>댓글 삭제</button>

                      </div>
                    </>
                )}
              </div>
          ))}

          <div className="PageView-comment-input">
          <textarea
              id="PageView-comment-input"
              rows="3"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="댓글을 작성하세요..."
          />
            <button onClick={handleCommentSubmit} className="PageView-comment-button">
              댓글 등록
            </button>
          </div>
        </div>

        <button onClick={() => navigate(-1)}>목록으로 돌아가기</button>

        {isReportModalOpen && (
            <div className="report-modal">
              <div className="report-modal-content">
                <h3>신고 사유를 입력해 주세요</h3>
                <textarea
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    placeholder="신고 사유를 입력하세요..."
                />
                <button onClick={handleReportSubmit}>신고 제출</button>
                <button onClick={handleCloseReportModal}>취소</button>
              </div>
            </div>
        )


          }
        </div>
          );
          };


export default PostView;

