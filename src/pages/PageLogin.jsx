import React, { useEffect, useState } from "react"
import koop from '../assets/koop.png'
import { data } from "autoprefixer"
import { ROUTES } from "../helpers/flow";

const API = 'https://fakestoreapi.com/products/'

export default function PageLogin(props){

    const [posts, setPosts] = useState([])

    const { setSelectedPage } = props;

    useEffect(() => {

        let data = false;

        async function fetchData() {

            setPosts([])
            const response = await fetch(API);
            data = await response.json();
            setPosts(data);
            console.log('data -> ', data);
        }

        fetchData();
       

    }, [])

    

    return(
        <div className="bg-koop-def min-h-screen">

            <div className="head fixed bg-sky-500/ w-full ">
                <button onClick={ setSelectedPage(ROUTES.HOME.name) } ><img className="mx-auto" src={koop} /></button>
                <p className="text-center">+ 10000 des services a votre dispositions</p>
            </div>

            <main className="main-diapo pt-[220px] w-full mx-auto" >

                <ul className='galery py-0 px-[14px] max-w-[1100px] mx-auto my-0 flex flex-wrap gap-[2vmin]' >
                   { posts && posts.map((it, i) => <li className=" grow-[1] list-none h-[250px] " ><img className=" w-[100%] h-[100%] object-cover " src={it.image} /></li> ) }
                </ul>

               {/*  <div className="flex flex-wrap justify-around" >
                { posts && posts.map((it, i) =>  <div className="max-w-[140px] max-h-[140px] bg-red-400 " ><img className="w-full object-fill"  src={it.image} /></div> )
                }
                </div> */}
            </main>

            cool

        </div>
    )
}