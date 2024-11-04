import React, { useState } from 'react';
import './Myhomepost.css';

const Myhomepost = () => {
    // 임시 게시글 데이터
    const posts = [
        {
            id: 1,
            title: "임시 게시글1",
            date: "2023-11-04",
            content: "임시 글 내용. 임시 글 내용 임시 글 내용임시 글 내용임시 글 내용임시 글 내용임시 글 내용임시 글 내용임시 글 내용임시 글 내용임시 글 내용임시 글 내용임시 글 내용임시 글 내용임시 글 내용임시 글 내용임시 글 내용임시 글 내용임시 글 내용임시 글 내용임시 글 내용임시 글 내용",
            images: [
                'https://img.freepik.com/free-photo/full-shot-cool-people-wearing-chain-necklace_23-2149409723.jpg',
            ],
            likes: 1400,
            views: 1360,
            commentsCount: 95,
            comments: [
                {
                    id: 1,
                    profileImage: 'https://via.placeholder.com/40',
                    name: '댓글 작성자1',
                    date: '2023-11-03',
                    content: '댓글내용1 댓글내용1 댓글내용1'
                },
                {
                    id: 2,
                    profileImage: 'https://via.placeholder.com/40',
                    name: '댓글 작성자2',
                    date: '2023-11-03',
                    content: '댓글내용2 댓글내용2 댓글내용2'
                }
            ]
        },
        {
            id: 1,
            title: "임시 게시글2",
            date: "2023-11-04",
            content: "임시 글 내용2..",
            images: [
                'https://pimg.mk.co.kr/meet/neds/2022/07/image_readtop_2022_635451_16582076355112096.jpg',
                'https://image.msscdn.net/mfile_s01/cms-files/64cb2f0e791467.76930275.jpg',
            ],
            likes: 1400,
            views: 1360,
            commentsCount: 95,
            comments: [
                {
                    id: 1,
                    profileImage: 'https://via.placeholder.com/40',
                    name: '댓글작성자1',
                    date: '2023-11-03',
                    content: '아아아'
                },
                {
                    id: 2,
                    profileImage: 'https://via.placeholder.com/40',
                    name: '댓글작성자2',
                    date: '2023-11-03',
                    content: '으으으으'
                }
            ]
        },
        {
            id: 1,
            title: "임시 게시글3",
            date: "2023-11-04",
            content: "임시 글 내용3..",
            images: [
                'https://the-edit.co.kr/wp-content/uploads/2023/08/RWP_222_GY_.jpeg',
                'https://img.wkorea.com/w/2023/02/style_63ecdbdca8817-800x1200.jpg',
                'https://img.gqkorea.co.kr/gq/2024/02/style_65bf6596ef552-933x1400.jpg',                
            ],
            likes: 1400,
            views: 1360,
            commentsCount: 95,
            comments: [
                {
                    id: 1,
                    profileImage: 'https://via.placeholder.com/40',
                    name: '댓글작성자1',
                    date: '2023-11-03',
                    content: '아아아'
                },
                {
                    id: 2,
                    profileImage: 'https://via.placeholder.com/40',
                    name: '댓글작성자2',
                    date: '2023-11-03',
                    content: '으으으으'
                }
            ]
        },
        {
            id: 1,
            title: "임시 게시글4",
            date: "2023-11-04",
            content: "임시 글 내용4..",
            images: [
                'https://the-edit.co.kr/wp-content/uploads/2024/03/1000_linda2.jpg',
                'https://www.elle.co.kr/resources_old/online/org_online_image/el/bb17968e-dcae-4fda-bc97-1b0a2d8df293.jpg',
                'https://pimg.mk.co.kr/meet/neds/2022/10/image_readtop_2022_892548_16653604425191510.png',
                'https://img.etnews.com/photonews/2002/1273389_20200220102047_080_0001.jpg',
            ],
            likes: 1400,
            views: 1360,
            commentsCount: 95,
            comments: [
                {
                    id: 1,
                    profileImage: 'https://via.placeholder.com/40',
                    name: '댓글작성자1',
                    date: '2023-11-03',
                    content: '아아아'
                },
                {
                    id: 2,
                    profileImage: 'https://via.placeholder.com/40',
                    name: '댓글작성자2',
                    date: '2023-11-03',
                    content: '으으으으'
                }
            ]
        },
        {
            id: 1,
            title: "임시 게시글5",
            date: "2023-11-04",
            content: "임시 글 내용5..",
            images: [
                'https://cdn.mhns.co.kr/news/photo/202009/417247_541937_2341.jpg',
                'https://www.handsome.co.kr/resources/mobile/ext/images/bg_b1_t02_ko.jpg?dt=20241002_1',
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2_GYuiRB-3JeSinbTrsYvtSCtkFC1hWyaEQ&s',
                'https://m.fashion-full.com/renewImg/image/m/main_banner/2_202410041017002189.jpg',
                'https://lh6.googleusercontent.com/proxy/Mgf4_YkGN__KoIvw3R_NlNf72eHo-iqK8tcd4yZCbw-9IMXGB3RaPebbaR1E5RlOb5WFOvVE-ztt2IYrjS6PJM29d9ShQCCLViBVCI6hUqewgBiG',
            ],
            likes: 1400,
            views: 1360,
            commentsCount: 95,
            comments: [
                {
                    id: 1,
                    profileImage: 'https://via.placeholder.com/40',
                    name: '댓글작성자1',
                    date: '2023-11-03',
                    content: '아아아'
                },
                {
                    id: 2,
                    profileImage: 'https://via.placeholder.com/40',
                    name: '댓글작성자2',
                    date: '2023-11-03',
                    content: '으으으으'
                }
            ]
        },
        {
            id: 1,
            title: "임시 게시글6",
            date: "2023-11-04",
            content: "임시 글 내용6..",
            images: [
                'https://img.allurekorea.com/allure/2023/06/style_6478200c82102.jpg',
                'https://i.pinimg.com/236x/85/86/c8/8586c85681429a4d119fae0508ac7eed.jpg',
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAErlhxVtdxAykoNBgRM-OTA90VXzXdAekuQ&s',
                'https://www.dailypop.kr/news/photo/202210/63490_121436_3647.jpg',
                'https://cafe24.poxo.com/ec01/eutrend/UVTjSep0dwP4/wX7AtHyXH0XDZKF2tKAE8nugwMevepGg4nZbslWEikNS2yTxNGvaXbga/9q74OOVoA+txAC9A==/_/web/product/big/202108/561139efef0e45e49f192ad4e40a13d3.jpg',
                'https://blog.kakaocdn.net/dn/EtjtT/btsh6aks1Gt/PxwohP1pK5LsUX0NSQvo80/img.png',
            ],
            likes: 1400,
            views: 1360,
            commentsCount: 95,
            comments: [
                {
                    id: 1,
                    profileImage: 'https://via.placeholder.com/40',
                    name: '댓글작성자1',
                    date: '2023-11-03',
                    content: '아아아'
                },
                {
                    id: 2,
                    profileImage: 'https://via.placeholder.com/40',
                    name: '댓글작성자2',
                    date: '2023-11-03',
                    content: '으으으으'
                }
            ]
        }
        
    ];

    const [showMore, setShowMore] = useState(false);
    const [modalImage, setModalImage] = useState(null);

    const openModal = (image) => {
        setModalImage(image);
    };

    const closeModal = () => {
        setModalImage(null);
    };

    return (
        <div className="myhomepost-container">
            {posts.map((post) => (
                <div key={post.id} className="myhomepost">
                    <a href={`/post/${post.id}`} className="myhomepost-title">{post.title}</a>
                    <p className="myhomepost-date">{post.date}</p>
                    <p className="myhomepost-content">
                        {showMore || post.content.length <= 100
                            ? post.content
                            : `${post.content.slice(0, 100)}... `}
                        {post.content.length > 100 && (
                            <button onClick={() => setShowMore(!showMore)} className="myhomepost-show-more">
                                {showMore ? '닫기' : '더보기'}
                            </button>
                        )}
                    </p>
                    <div className={`myhomepost-images layout-${Math.min(post.images.length, 6)}`}>
                        {post.images.slice(0, 6).map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`Post image ${index + 1}`}
                                className="myhomepost-image"
                                onClick={() => openModal(image)}
                            />
                        ))}
                        {post.images.length > 6 && (
                            <div className="myhomepost-more-images">+{post.images.length - 6}장</div>
                        )}
                    </div>
                    <div className="myhomepost-stats">
                        <span>👍 {post.likes}</span>
                        <span>👁️ {post.views}</span>
                        <span>💬 {post.commentsCount}</span>
                    </div>
                    <div className="myhomepost-comments">
                        {post.comments.slice(0, 2).map((comment) => (
                            <div key={comment.id} className="myhomepost-comment">
                                <img src={comment.profileImage} alt={comment.name} className="myhomepost-comment-profile" />
                                <div className="myhomepost-comment-content">
                                    <span className="myhomepost-comment-name">{comment.name}</span>
                                    <span className="myhomepost-comment-date">{comment.date}</span>
                                    <p className="myhomepost-comment-text">{comment.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {modalImage && (
                <div className="myhomepost-modal" onClick={closeModal}>
                    <img src={modalImage} alt="Modal" className="myhomepost-modal-image" />
                </div>
            )}
        </div>
    );
};

export default Myhomepost;
