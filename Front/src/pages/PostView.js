import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PostView.css';
import api from '../axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';  // 따봉, 신고 아이콘
import banner1 from '../image/infobanner.jpg';
import book1 from '../image/book1.png';
import book2 from '../image/book2.png';
import Banner from '../components/Banner';
import LoadingModal from '../components/LoadingModal';
import profileImageSrc from '../image/profile.png';

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
  const [reportTargetId, setReportTargetId] = useState(null);  // 신고 대상 ID
  const [reportTargetType, setReportTargetType] = useState('post');  // 신고 대상 타입 ('post' 또는 'comment')
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);  // 신고 모달 상태
  const [editingCommentId, setEditingCommentId] = useState(null);  // 댓글 수정 상태
  const [commentEditText, setCommentEditText] = useState('');  // 댓글 수정 텍스트
  const [isBookmarked, setIsBookmarked] = useState(false); // 북마크 여부 상태
  const [userId, setuserId] = useState(null); // 현재 사용자 ID
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentId, setcommentId] = useState(null);
  const [loadingBookmark, setLoadingBookmark] = useState(false);
  const [loadingDislike, setLoadingDislike] = useState(false);
  const [loadingComment, setLoadingComment] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const defaultProfileImageUrl = profileImageSrc;

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
        setLoading(true);
        const [postResponse, commentsResponse, bookmarkStatus] = await Promise.all([
        api.get(`/posts/${postId}`),
        api.get(`/posts/${postId}/comments`),
        checkBookmarkStatus()
        ]);
        setPost(postResponse.data); // 게시물 데이터 설정
        setComments(commentsResponse.data || []); // 댓글 데이터 설정
        setIsBookmarked(bookmarkStatus); // 북마크 상태 설정
        if (postResponse.data.isBlind) {
          setIsBlind(true);
        }
      } catch (error) {
        console.error('데이터를 불러오는 중 오류가 발생했습니다:', error);
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false); // 로딩 상태 종료
      }
    };

    const toggleBookmark = async () => {
      try {
        setLoading(true);
        await api.post(`/bookmarks/toggle/${postId}`);
        setIsBookmarked(prev => {
          const newState = !prev;  // 북마크 상태를 토글
          alert(newState ? '북마크가 추가되었습니다.' : '북마크를 취소했습니다.');
          return newState;
        });
      } catch (error) {
        console.error("북마크 토글 중 오류가 발생했습니다:", error);
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


// 추천
  const handleLike = async () => {
    setLoading(true); // 추천 처리 중 로딩 표시
    try {
      await api.post(`/posts/${postId}/like`);
      setPost({ ...post, likes: post.likes + 1 });
    } finally {
      alert('이 게시물을 추천했습니다.');
      setLoading(false);
    }
  };


// 비추천
  const handleDislike = async () => {
    setLoading(true);
    try {
      await api.post(`/posts/${postId}/dislike`);
      setPost({ ...post, dislikes: post.dislikes + 1 });
    } finally {
      alert('이 게시물을 비추천했습니다.');
      setLoading(false);
    }
  };


// 댓글 등록 함수
  const handleCommentSubmit = async () => {
    setLoading(true);
    if (!commentText.trim()) return;
    try {
      // 서버에 댓글을 등록 요청
      const response = await api.post(`/posts/${postId}/comments`, { content: commentText });
      const newComment = response.data; // 서버에서 반환된 새 댓글 데이터

      // 댓글 리스트 상태 업데이트 (기존 댓글에 새 댓글 추가)
      setComments((prevComments) => [...prevComments, newComment]);
      setCommentText(''); // 입력창 초기화

      // 성공 시 알림 메시지
      alert("댓글이 등록되었습니다.");
    } catch (error) {
      console.error("댓글 등록 중 오류가 발생했습니다:", error);
      alert("댓글 등록에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setLoading(false); // 로딩 상태 종료
    }
  };

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/posts/${postId}/comments`);
      setComments(Array.isArray(response.data) ? response.data : []); // 배열이 아니면 빈 배열 설정
    } catch (error) {
      console.error("댓글을 불러오는 중 오류 발생:", error);
      setComments([]); // 오류 발생 시 빈 배열로 설정
    } finally {
      setLoading(false); // 로딩 상태 종료
    }
  };

  const handleLikeComment = async (commentId) => {
    setLoading(true);
    try {
      await api.post(`/comments/${commentId}/like`);
      setComments((prevComments) =>
          prevComments.map((comment) =>
              comment.id === commentId ? { ...comment, likes: (comment.likes || 0) + 1 } : comment
          )
      );
    } catch (error) {
      console.error("댓글 추천 중 오류가 발생했습니다:", error);
    } finally {
      setLoading(false); // 로딩 상태 종료
    }
  };

  const handleDislikeComment = async (commentId) => {
    setLoading(true);
    try {
      await api.post(`/comments/${commentId}/dislike`);
      setComments((prevComments) =>
          prevComments.map((comment) =>
              comment.id === commentId ? { ...comment, dislikes: (comment.dislikes || 0) + 1 } : comment
          )
      );
    } catch (error) {
      console.error("댓글 비추천 중 오류가 발생했습니다:", error);
    } finally {
      setLoading(false); // 로딩 상태 종료
    }
  };

  // 신고 모달 열기
  const handleOpenReportModal = (id, type = 'post') => {
    setReportTargetId(id);  // 신고 대상 ID 설정
    setReportTargetType(type);  // 신고 대상 타입 설정
    setIsReportModalOpen(true);  // 모달 열기
  };

  // 신고 모달 닫기
  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
    setReportReason('');
  };

  // 신고 제출
  const handleReportSubmit = async () => {
    if (!reportReason.trim()) {
      alert("신고 사유를 입력해 주세요.");
      return;
    }
    try {
      const url = reportTargetType === 'post' ? `/posts/${reportTargetId}/report` : `/comments/${reportTargetId}/report`;
      await api.post(url, { reason: reportReason });
      alert("신고가 접수되었습니다.");
      handleCloseReportModal();  // 신고 후 모달 닫기
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

// 글 삭제
  const handleDeletePost = async () => {
    if (window.confirm("정말로 이 글을 삭제하시겠습니까?")) {
      setLoading(true);
      try {
        await api.delete(`/posts/${postId}`);
        navigate("/");
      } finally {
        setLoading(false);
      }
    }
  };

    if (loading) {
      return <LoadingModal />; // 로딩 중일 때 모달 표시
    }

  // 댓글 삭제
  const handleDeleteComment = async (commentId) => {
    setLoading(true);
    if (window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
      try {
        await api.delete(`/comments/${commentId}`); // axios 인스턴스 사용
        alert("댓글이 삭제되었습니다.");
        setComments(comments.filter(comment => comment.id !== commentId)); // 상태 업데이트
        // 댓글 목록 갱신 로직 필요
      } catch (error) {
        alert("댓글 삭제 중 오류가 발생했습니다. 다시 시도해주세요");
      } finally {
         setLoading(false);
      }
    }
  };

// 북마크
  const toggleBookmark = async () => {
    setLoading(true);
    try {
      await api.post(`/bookmarks/toggle/${postId}`);
      setIsBookmarked((prev) => !prev);
    } finally {
      setLoading(false);
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

        {/* 글삭제 버튼 */}
        <button className="PageView-comment-button3" onClick={handleDeletePost}>글 삭제</button>

        {/* 북마크 버튼 */}
        <button className="bookmark-button-con" onClick={toggleBookmark} style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}>
            <img src={isBookmarked ? book2 : book1} alt="Bookmark button" style={{ width: '50px', height: '50px' }} /> </button>

        {/* 목록 버튼 */}
        <button onClick={() => navigate(-1)} className="PageView-comment-button2">목록</button>

        <div className="PageView-post-info">
          <img src={post.profileImageUrl} alt={`${post.author} 프로필`} className="PageView-profile-image"/>
          <p className="PageView-author">{post.author}</p>
          <div className="PageView-post-info2">
          <p className="PageView-date">작성일자: {new Date(post.date).toLocaleDateString()}</p>
          <p className="PageView-views">조회수: {post.views}</p></div>
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
          <button className="postview-but-a" onClick={handleLike}>
            <span style={{ fontSize: '20px' }}>👍{post.likes}</span>
          </button>
          <button className="postview-but-a" onClick={handleDislike}>
            <span style={{ fontSize: '20px' }}>👎{post.dislikes}</span>
          </button>
          <button className="postview-but-a" onClick={() => handleOpenReportModal(postId, 'post')}>
            <span style={{ fontSize: '20px' }}>⚠️</span>
          </button>
        </div>

        <div className="PageView-comments-section">
        <hr className="PageView-comment-separator" />
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
                      <div className="PostView-comment-author-info">
                        <img
                            src={comment.authorProfileImageUrl || defaultProfileImageUrl} // 기본 이미지 제공
                            alt={`${comment.authorNickname} 프로필`}
                            className="PostView-comment-profile-image"
                        />
                        <p className="PostView-comment-nickname">{comment.authorNickname}</p>
                        <p className="PostView-comment-date">
                          {new Date(comment.date).toLocaleDateString()} {/* 작성일자 표시 */}
                        </p>
                      </div>
                      <p className="PostView-comment-content">{comment.content}</p>
                      <div className="comment-reactions-button">
                        <button onClick={() => handleLikeComment(comment.id)}>
                          <span>👍{comment.likes || 0}</span>
                        </button>
                        <button onClick={() => handleDislikeComment(comment.id)}>
                          <span>👎{comment.dislikes || 0}</span>
                        </button>
                        <button onClick={() => handleOpenReportModal(comment.id, 'comment')}>
                          <span>⚠️</span>
                        </button>
                        <button onClick={() => handleDeleteComment(comment.id)}>삭제</button>
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

        {isReportModalOpen && (
            <div className="report-modal">
              <div className="report-modal-content">
                <h3>신고 사유를 입력해 주세요</h3>
                <textarea
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    placeholder="신고 사유를 입력하세요..."
                />
                 <button onClick={handleReportSubmit} className="report-modal-button">
                    신고 제출
                  </button>
                  <button onClick={handleCloseReportModal} className="report-modal-button cancel">
                    취소
                  </button>
              </div>
            </div>
        )


          }
        </div>
          );
          };


export default PostView;

