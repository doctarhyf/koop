import React from "react";

export default function DiapoItem(props){
    let { data, w, h } = props;
    const img = `/diapo/${data.img}.jpg`;
    const defw = '240pt';
    const defh = '160pt';
    
    function onClick(e){
        console.log('data', data)
    }

    return (
        <button onClick={onClick}  className={`flex-shrink-0 object-cover  cursor-pointer  overflow-hidden w-[240pt] rounded-[14pt] h-[160pt] bg-slate-500 mx-2`}  >
            <img src={img} className={`object-cover  w-[${ w ? w : defw }] rounded-[14pt] h-[${h ? h : defh }] `} />
        </button>
    )
}