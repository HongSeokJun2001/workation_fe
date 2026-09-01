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
                    <Link to="">개인정보처리방침</Link> | &nbsp;
                    <Link to="">서비스소개</Link> | &nbsp;
                    <Link to="">고객센터</Link>
                </div>
                <div id="footer_2">
                    (주) 근휴일 (Geunhuil) | 대표이사 : 홍길동 | 사업자등록번호 : 123-45-67890 <br/>
                    본사 : 서울특별시 강남구 테헤란로 123 근휴일타워 5층 <br/>
                    고객센터 : 1588-0000 (평일 09:00 ~ 18:00) | 이메일 : support@geunhuil.com
                </div>
                <div id="footer_3">
                    Copyright © 2026 Geunhuil Workation Platform All Rights Reserved
                </div>
            </div>
        </div>
    );
}

export default Footer;