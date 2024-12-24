import './home.css';
import React, { useState, useEffect } from "react";
import { Button, Popover } from 'antd';
import { getQuesList } from './service';

function Tips({onButtonClick}) {
    const [quesList, setQuesList] = useState([]);
    useEffect(async () => {
        const res=await getQuesList();
        setQuesList(res.questions);
    }, []);
    return <div className="tips">
        {quesList.map((item, index) => (
            <Popover
                overlayStyle={{ width: '80%', fontSize: '20px' }}
                key={index}
                content={item.answer}
                title={item.question}
                trigger="click"
            >
                <Button onClick={()=>onButtonClick(item.answer)} style={{ marginTop: '20px', fontSize:'20px' }}>{item.question}</Button>
            </Popover>
        ))}
    </div>
}
export default Tips;