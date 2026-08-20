import { useState, useEffect } from "react";

import { useSearchParams, useNavigate } from "react-router-dom";

import { selectWorkationApplicationListApi } from "../api/workationApi"

function WorkationApplicationList() {

    let navigate = useNavigate();

    const [keyword, setKeyword] = useState("");

    const [dataList, setDataList] = useState([]);

    const [cpage, setCpage] = useState(1);

    const handlePesonse = response => {

        const pageInfo = response.data.pi;

        const btnArr = [];

        if(cpage == 1){

            btnArr.push(
                <button key="prev" className="btn btn-info btn-sm">
                    &lt;
                </button>
            );
        } else {

            btnArr.push(
                <button key="prev" className="btn btn-info btn-sm"
                        onClick={ () => {
                            setCpage(cpage - 1);
                        }}>
                    &lt;
                </button>
            );
        }

        for(let p = pageInfo.startPage; p <= pageInfo.endPage; p++) {

            if(cpage == p) {

                btnArr.push(
                    <button key={ p } className="btn btn-info btn-sm">
                        { p }
                    </button>
                );
            } else {

                btnArr.push(
                    <button key={ p } className="btn btn-info btn-sm"
                            onClick={() => {
                                setCpage(p);
                            }}>
                        { p }
                    </button>
                );
            }
        }

        if(cpage == pageInfo.maxPage) {

            btnArr.push(
                <button key="next" className="btn btn-info btn-sm">
                    &gt;
                </button>
            );
        } else {

                btnArr.push(
                    <button key="next" className="btn btn-outline-info btn-sm" 
                            onClick={() => { 
                                setCpage(cpage + 1);
                            }}>
                        &gt;
                    </button>
                );
            }

        setPageList(btnArr);
    }

    return (
        <div>

            <br /><br />

            <div align="center" className="search-area">
                <form>
                    <input type="text" name="keyword" placeholder="제목을 입력하세요"
                           value={ keyword } onChange={ handleChange } />
                    <button type="submit"
                            onClick={ handleClick }>검색</button>
                </form>
            </div>

            <br /><br />

            <table className="list-area table table-hover">
                <thead>
                    <tr>
                        <th width="200">크루장</th>
                        <th width="500">신청기간</th>
                        <th width="300">장소</th>
                        <th width="200">예약상태</th>
                        <th width="200">예약신청일</th>
                    </tr>
                </thead>
                <tbody>{ dataList }</tbody>
            </table>

            <br/>

            <div align="center" className="paging-area">{ pageList }</div>

            <br /><br />

        </div>
    );
}

export default WorkationApplicationList;