import { Link } from 'react-router-dom';

import '../styles/Footer.css';

// 모든 페이지 하단에 들어갈 Footer 컴포넌트
function Footer() {

    return (
        <div>
            <div className="footer-area">
                <hr/>
                <div id="footer_1">
                    <Link to="">이용약관</Link> | &nbsp;
                    <Link to="">개인정보취급방침</Link> | &nbsp;
                    <Link to="">인재채용</Link> | &nbsp;
                    <Link to="">오시는길</Link>
                </div>
                <div id="footer_2">
                    강남점 1관 : 서울특별시 강남구 테헤란로14길 6 남도빌딩 2F, 3F, 4F, 5F, 6F <br/>
                    종로지원 : 서울특별시 중구 남대문로 120 그레이츠 청계(구 대일빌딩) 2F, 3F <br/>
                    부산점 : 부산 부산진구 중앙대로 627 삼비빌딩 2F,12F <br/>

                </div>
                <div id="footer_3">
                    Copyright © 1998-2026 KH Information Educational Institute All Right Reserved
                </div>
            </div>
        </div>
    );
}

export default Footer;