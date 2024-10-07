import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PageView.css';

import reportIcon from '../image/report.png';  // 신고하기 아이콘
import replyIcon from '../image/reply.png';    // 대댓글 작성 아이콘

const PageView = () => {
  const { postId } = useParams(); // URL에서 postId를 가져옴
  const navigate = useNavigate(); // 목록으로 돌아가기 위한 네비게이션
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]); // 댓글 목록
  const [newComment, setNewComment] = useState(''); // 새로운 댓글
  const [newReply, setNewReply] = useState({}); // 대댓글 상태
  const [activeReply, setActiveReply] = useState(null); // 활성화된 대댓글 입력창 상태

  useEffect(() => {
    const fetchedPost = mockFetchPost(postId); // mockFetchPost 함수를 사용
    setPost(fetchedPost);
    setComments(fetchedPost.comments || []); // 게시물의 댓글 가져오기
  }, [postId]);

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      setComments([
        ...comments,
        {
          id: Date.now(),
          author: '사용자1', // 새로운 댓글 작성자의 이름 추가
          text: newComment,
          replies: [],
          date: new Date().toLocaleDateString(),
          profileImageUrl: 'https://example.com/profile.jpg',
        },
      ]);
      setNewComment('');
    }
  };

  const handleReplySubmit = (commentId) => {
    if (newReply[commentId]?.trim()) {
      const updatedComments = comments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              replies: [
                ...comment.replies,
                {
                  id: Date.now(),
                  author: '사용자2', // 대댓글 작성자의 이름 추가
                  text: newReply[commentId],
                  date: new Date().toLocaleDateString(),
                  profileImageUrl: 'https://example.com/profile.jpg',
                },
              ],
            }
          : comment
      );
      setComments(updatedComments);
      setNewReply({ ...newReply, [commentId]: '' });
      setActiveReply(null); // 대댓글 입력 후 비활성화
    }
  };

  const toggleReplyInput = (commentId) => {
    setActiveReply((prev) => (prev === commentId ? null : commentId));
  };

  if (!post) return <div>게시물을 불러오는 중입니다...</div>;

  return (
    <div className="PageView-container">
      <h1 className="PageView-post-title">{post.title}</h1>
      <div className="PageView-post-info">
        <img src={post.profileImageUrl} alt={`${post.author} 프로필`} className="PageView-profile-image" />
        <p className="PageView-author">{post.author}</p>
        <p className="PageView-date">작성일자: {post.date}</p>
        <p className="PageView-views">조회수: {post.views}</p>
        <p className="PageView-likes">추천수: {post.likes}</p>
      </div>
      <div className="PageView-post-content">
        {post.content.map((item, index) => {
          if (typeof item === 'string') {
            return <p key={index}>{item}</p>; // 텍스트일 경우 p 태그로 렌더링
          } else if (item.type === 'image') {
            return <img key={index} src={item.src} alt={item.alt} className="PageView-post-image" />; // 이미지일 경우 img 태그로 렌더링
          }
          return null;
        })}
      </div>

      <div className="PageView-actions">
        <button className="PageView-like-button">추천</button>
        <button className="PageView-comment-button" onClick={() => navigate('/community')}>목록으로</button>
      </div>

      <div className="PageView-comments-section">
        <h2>댓글</h2>
        <div className="PageView-comment-input">
          <textarea
            id="PageView-comment-input"
            rows="3"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 작성하세요..."
          />
          <button onClick={handleCommentSubmit} className="PageView-comment-button">
            댓글 등록
          </button>
        </div>

        {comments.map((comment) => (
          <div key={comment.id} className="PageView-comment">
            <img
              src={comment.profileImageUrl || 'https://example.com/default-profile.png'}
              alt="프로필"
              className="PageView-comment-profile-image"
            />
            <div className="PageView-comment-content">
              <p className="PageView-comment-author">{comment.author}</p> {/* 댓글 작성자 표시 */}
              <p>{comment.text}</p>
              <p className="PageView-comment-date">{comment.date}</p>
            </div>

            {/* 대댓글 작성 버튼 및 신고하기 버튼 */}
            <div className="PageView-comment-buttons">
              <button
                className="PageView-reply-toggle-button"
                onClick={() => toggleReplyInput(comment.id)}
              >
                <img src={replyIcon} alt="대댓글 작성" className="PageView-icon" />
              </button>

              <button className="PageView-report-button">
                <img src={reportIcon} alt="신고" className="PageView-icon" />
              </button>
            </div>

            {/* 대댓글 입력창 */}
            {activeReply === comment.id && (
              <div className="PageView-reply-input">
                <textarea
                  rows="2"
                  value={newReply[comment.id] || ''}
                  onChange={(e) =>
                    setNewReply({ ...newReply, [comment.id]: e.target.value })
                  }
                  placeholder="대댓글을 작성하세요..."
                />
                <button
                  onClick={() => handleReplySubmit(comment.id)}
                  className="PageView-comment-button"
                >
                  대댓글 등록
                </button>
              </div>
            )}

            {/* 대댓글 렌더링 */}
            {comment.replies.map((reply) => (
              <div key={reply.id} className="PageView-reply">
                <img
                  src={reply.profileImageUrl || 'https://example.com/default-profile.png'}
                  alt="프로필"
                  className="PageView-comment-profile-image"
                />
                <div className="PageView-reply-content">
                  <p className="PageView-comment-author">{reply.author}</p> {/* 대댓글 작성자 표시 */}
                  <p>{reply.text}</p>
                  <p className="PageView-comment-date">{reply.date}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// 임시로 게시물 데이터를 불러오는 함수
const mockFetchPost = (postId) => {
  const allPosts = [
    {
      id: 1,
      title: '첫 번째 게시물 제목입니다.',
      author: '사용자1',
      date: '2024-09-30',
      views: 100,
      likes: 20,
      profileImageUrl:
        'https://mblogthumb-phinf.pstatic.net/MjAyMDEyMDNfODEg/MDAxNjA2OTYwMTMwMDIz.CH0wwi3vq1NRbCMo4vSD2DxwqUjWhLAfGK3vs_HYAVMg.ew3TvMIDK86UJADD7363U3K2eQwi4TOwoG__QRwLgCUg.GIF.bidsh/01.gif?type=w800',
      content: [
        `헌법재판소는 법관의 자격을 가진 9인의 재판관으로 구성하며, 재판관은 대통령이 임명한다. 
        정당의 설립은 자유이며, 복수정당제는 보장된다. 국민경제의 발전을 위한 중요정책의 수립에 관하여 대통령의 자문에 응하기 위하여 국민경제자문회의를 둘 수 있다.`,
        
        { type: 'image', src: 'https://cc-prod.scene7.com/is/image/CCProdAuthor/Fashion-photography_P1_900x420?$pjpeg$&jpegSize=200&wid=900', alt: '이미지' },
        
        `환경권의 내용과 행사에 관하여는 법률로 정한다. 재판의 심리와 판결은 공개한다. 다만, 심리는 국가의 안전보장 또는 안녕질서를 방해하거나 선량한 풍속을 해할 염려가 있을 때에는 법원의 결정으로 공개하지 아니할 수 있다.
        
        국가는 건전한 소비행위를 계도하고 생산품의 품질향상을 촉구하기 위한 소비자보호운동을 법률이 정하는 바에 의하여 보장한다. 훈장등의 영전은 이를 받은 자에게만 효력이 있고, 어떠한 특권도 이에 따르지 아니한다.`,
        
        `언론·출판은 타인의 명예나 권리 또는 공중도덕이나 사회윤리를 침해하여서는 아니된다. 언론·출판이 타인의 명예나 권리를 침해한 때에는 피해자는 이에 대한 피해의 배상을 청구할 수 있다.
      
        국군의 조직과 편성은 법률로 정한다. 모든 국민은 행위시의 법률에 의하여 범죄를 구성하지 아니하는 행위로 소추되지 아니하며, 동일한 범죄에 대하여 거듭 처벌받지 아니한다.
      
        국무총리는 국회의 동의를 얻어 대통령이 임명한다. 헌법재판소의 조직과 운영 기타 필요한 사항은 법률로 정한다. 모든 국민은 신체의 자유를 가진다. 누구든지 법률에 의하지 아니하고는 체포·구속·압수·수색 또는 심문을 받지 아니하며, 법률과 적법한 절차에 의하지 아니하고는 처벌·보안처분 또는 강제노역을 받지 아니한다.`
      ],
      comments: [
        {
          id: 1,
          author: '댓글작성자1',
          text: '테스트 댓글1',
          replies: [
            { id: 11, author: '대댓글작성자1',profileImageUrl: 'https://i.pinimg.com/originals/a3/66/6a/a3666aa57ceb02a22b155cb1b287f9e7.gif', text: '대댓글테스트', date: '2024-10-01' },
          ],
          date: '2024-09-30',
          profileImageUrl: 'https://i.pinimg.com/originals/a3/66/6a/a3666aa57ceb02a22b155cb1b287f9e7.gif',
        },
        {
          id: 2,
          author: '댓글작성자2',
          text: '테스트 댓글2',
          replies: [],
          date: '2024-09-30',
          profileImageUrl: 'https://i.namu.wiki/i/t7F8pzHw36_DxvmZD7h39NuCJYqXKZowmyvvO29Ng4DOY3jrnGRwWZUE1oCtyF2HNPHrxAENVfx9Nc8SG5ajJQ.gif',
        },
      ],
    },{
      id: 2,
      title: '두 번째 게시물 제목입니다.',
      author: '사용자2',
      date: '2024-09-30',
      views: 150,
      likes: 30,
      profileImageUrl:
        'https://i.pinimg.com/originals/a3/66/6a/a3666aa57ceb02a22b155cb1b287f9e7.gif',
      content: [
        `국무위원은 국정에 관하여 대통령을 보좌하며, 국무회의의 구성원으로서 국정을 심의한다. 지방의회의 조직·권한·의원선거와 지방자치단체의 장의 선임방법 기타 지방자치단체의 조직과 운영에 관한 사항은 법률로 정한다.

국회는 의원의 자격을 심사하며, 의원을 징계할 수 있다. 형사피해자는 법률이 정하는 바에 의하여 당해 사건의 재판절차에서 진술할 수 있다. 대법관의 임기는 6년으로 하며, 법률이 정하는 바에 의하여 연임할 수 있다.`,
        
        { type: 'image', src: 'https://img.khan.co.kr/news/2024/02/03/news-p.v1.20240131.e92b61eee105426b8fb091a0d5d8b0fe_P1.jpg', alt: '이미지' },
        
        `모든 국민은 법률이 정하는 바에 의하여 선거권을 가진다. 이 헌법은 1988년 2월 25일부터 시행한다. 다만, 이 헌법을 시행하기 위하여 필요한 법률의 제정·개정과 이 헌법에 의한 대통령 및 국회의원의 선거 기타 이 헌법시행에 관한 준비는 이 헌법시행 전에 할 수 있다.

대통령후보자가 1인일 때에는 그 득표수가 선거권자 총수의 3분의 1 이상이 아니면 대통령으로 당선될 수 없다. 국회의원과 정부는 법률안을 제출할 수 있다.

의무교육은 무상으로 한다. 명령·규칙 또는 처분이 헌법이나 법률에 위반되는 여부가 재판의 전제가 된 경우에는 대법원은 이를 최종적으로 심사할 권한을 가진다.

대법원장의 임기는 6년으로 하며, 중임할 수 없다. 근로조건의 기준은 인간의 존엄성을 보장하도록 법률로 정한다. 국회에 제출된 법률안 기타의 의안은 회기중에 의결되지 못한 이유로 폐기되지 아니한다. 다만, 국회의원의 임기가 만료된 때에는 그러하지 아니하다.`
      ],
      comments: [
        {
          id: 1,
          text: '테스트 댓글 일',
          replies: [
            { id: 11, text: '테스트 대댓글1', date: '2024-10-01' },
          ],
          date: '2024-09-30',
          profileImageUrl: 'https://i.pinimg.com/originals/a3/66/6a/a3666aa57ceb02a22b155cb1b287f9e7.gif',
        },
        {
          id: 2,
          text: '테스트 댓글 이',
          replies: [],
          date: '2024-09-30',
          profileImageUrl: 'https://i.namu.wiki/i/t7F8pzHw36_DxvmZD7h39NuCJYqXKZowmyvvO29Ng4DOY3jrnGRwWZUE1oCtyF2HNPHrxAENVfx9Nc8SG5ajJQ.gif',
        },
      ],
    }
  ];
  return allPosts.find((post) => post.id === parseInt(postId));
};

export default PageView;
