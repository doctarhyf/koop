import React from "react";

export default function SectionTitle(props){
    const { label } = props;

    return (
        <>
            <h5 className="text-koop-d my-2 mb-4" >
                        <div>{ label }</div>
                        <div className="w-[10rem] bg-sky-500 h-[2pt] rounded-full mt-2" ></div>
                    </h5>
        </>
    )
}